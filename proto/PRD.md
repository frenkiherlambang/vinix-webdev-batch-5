# Product Requirement Document (PRD)

| Attribute | Details |
| :--- | :--- |
| **Feature Name** | Module 5 – Canteen Pre-Order & Checkout |
| **Author / PM Role** | Technical Lead PM (Campus Life Web App) |
| **Status** | draft |
| **Target Release** | Sprint 5.1 |

---

## 1. Executive Summary & Problem Statement

### 1.1 Context & Background
University students face tight schedules where transition intervals between consecutive lectures are as short as 15 minutes. Traditional canteen ordering requires queuing twice: once to order and settle cash payments (often slowed down by change shortages), and once to wait for preparation. As a result, students routinely skip meals.

### 1.2 Target Persona
* **Name:** Maya (20), 2nd-year undergraduate student.
* **Core Need:** Quickly grab lunch between consecutive classes without queuing or carrying physical cash.
* **Pain Points:** 15-minute inter-class window; long cash checkout queues; frequent delays due to vendors lacking exact change.

### 1.3 Goals & Success Metrics
* **Primary Objective:** Reduce total transaction and waiting friction to under 3 minutes upon arriving at the stall.
* **North Star Metric:** Median Time-to-Pickup (Order Placement $\to$ Counter Collection) $< 5$ minutes.
* **KPIs:**
  * Payment completion rate $\ge 92\%$ within the active payment window.
  * Payment gateway status latency $\le 1.5$ seconds post-settlement.
  * Reduction in reported cash-change stall delays by $80\%$.

---

## 2. User Story & Core Journey

### 2.1 User Story
> **As a** college student with short class breaks,  
> **I want to** pay for my canteen order directly via an integrated e-wallet QR code,  
> **So that** I can pick up my meal immediately at the stall counter without standing in the cash queue.

### 2.2 End-to-End User Flow
1. **Tray Review:** Student inspects items in cart, reviews subtotal, applied campus discounts, and tax/fees.
2. **Checkout Initiation:** Student taps "Pay via QRIS / E-Wallet"; backend creates an order record and renders a dynamic QR code accompanied by a 5-minute countdown timer.
3. **Payment Execution:** Student scans the dynamic QR code using GoPay, OVO, or Dana on their mobile device.
4. **Real-time Status Transition:** Payment gateway fires a webhook; client UI updates instantly from `UNPAID` to `PAID` via WebSockets/SSE.
5. **Pickup Token Display:** System assigns and displays a bold 3-Digit Pickup Token (e.g., `#104`) with stall details, which the student shows at the counter to claim food.

---

## 3. Scope Definition

### 3.1 In Scope
* **Dynamic E-Wallet QR Generation:** Dynamic QR (QRIS standard compatible with GoPay, OVO, and Dana) embedded with exact payable amounts and order ID.
* **5-Minute Countdown & Expiration Engine:** Real-time visual countdown timer; auto-expires and transitions orders to `CANCELLED_EXPIRED` if unfulfilled at $T = 00:00$.
* **Instant Reactive Payment State Update:** Bidirectional communication channel (WebSocket / Server-Sent Events) to push settlement confirmation to the UI without page refreshes.
* **Counter Pickup Token:** Auto-generated 3-digit cyclic/stall-scoped token (001–999) rendered upon transaction confirmation.

### 3.2 Out of Scope
* Bill splitting among multiple students/accounts.
* Gratuity/tipping system for stall staff.
* Advance meal scheduling (e.g., ordering for tomorrow or future dates).
* Direct settlement via Campus Student ID RFID / NFC balances.
* In-app food delivery to campus classrooms.

---

## 4. Functional Specifications

| ID | Feature Component | Behavior & Logic Rules | Error Handling & Edge Cases |
| :--- | :--- | :--- | :--- |
| **FR-01** | **Tray Summary & Discount Calculation** | • Display itemized summary, unit prices, applied student discounts, and final total.<br>• Checkout button triggers single-use order creation payload. | If an item runs out of stock while in tray, highlight out-of-stock item and disable checkout until adjusted. |
| **FR-02** | **Dynamic QR Generation** | • Generate a dynamic QR string via payment aggregator API.<br>• Encode exact settlement value (inclusive of discounts and service fee).<br>• Lock inventory for 300 seconds (5 minutes). | If payment gateway API returns an error/timeout, display retry CTA: *"Unable to generate payment code. Please try again."* |
| **FR-03** | **5-Minute TTL & Auto-Cancel** | • Visual countdown timer formatted as `MM:SS`.<br>• At `00:00`, invalidate backend payment transaction ID.<br>• Transition order to `EXPIRED` and release reserved stock. | If payment clears at edge interval ($T = 00:01$), handle via idempotent webhook reconciliation (fulfill if settlement received). |
| **FR-04** | **Instant Payment Sync** | • Listen to backend payment events via SSE / WebSocket channel (`order:{order_id}`).<br>• On settlement event: switch screen status immediately from `UNPAID` to `PAID`. | Fallback to HTTP polling every 3 seconds if WebSocket connection drops or fails to establish. |
| **FR-05** | **Pickup Token Allocation** | • Increment 3-digit token counter scoped per stall per day (format: `001` to `999`).<br>• Render persistent visual token card with high contrast for easy verification at counter. | Token persists in "Active Orders" tab until marked as completed/collected by stall operator. |

---

## 5. Technical & Architecture Requirements

### 5.1 System Architecture & Data Flow

```text
[Client Web App] 
     │  1. POST /api/v1/orders/checkout
     ▼
[App Backend / API Gateway] ───► [Payment Gateway / Aggregator]
     │                                     │
     │ 2. Listen WebSocket / SSE            │ 3. Webhook: Payment Settled
     ▼                                     ▼
[Client UI: PAID Screen] ◄────── [Backend Event Dispatcher]
```

* **Communication Protocol:** Server-Sent Events (SSE) or WebSockets for real-time frontend updates; HTTPS for REST endpoints.
* **Payment Integration:** Unified QRIS dynamic payload compliant with Indonesian e-wallets (GoPay, OVO, Dana, ShopeePay).
* **Concurrency & Race Conditions:** Redis distributed lock on stall stock decrement during the 5-minute checkout window.

### 5.2 Key Data Entities

#### Order Schema
```json
{
  "order_id": "ord_883921049",
  "student_id": "std_2024_9811",
  "stall_id": "stl_warung_bu_sri",
  "subtotal": 22000,
  "discount_amount": 2000,
  "total_amount": 20000,
  "status": "UNPAID",
  "payment_provider": "QRIS",
  "qr_payload": "00020101021226670016ID.CO.QRIS.WWW...",
  "pickup_token": "042",
  "expires_at": "2026-10-13T12:45:00Z",
  "created_at": "2026-10-13T12:40:00Z"
}
```
> **Status Enum:** `UNPAID` | `PAID` | `EXPIRED` | `COLLECTED`

---

## 6. Non-Functional Requirements (NFRs)

* **Performance & Latency:**
  * Dynamic QR render latency: $< 1.2\text{ s}$ from checkout tap.
  * Webhook-to-Client screen update latency: $< 800\text{ ms}$.
* **Availability & Reliability:**
  * $99.9\%$ uptime during campus peak hours ($11:00\text{ AM} - 2:00\text{ PM}$).
  * Webhook listener must be idempotent (using unique transaction references) to eliminate duplicate token generation.
* **Usability & Mobile Optimization:**
  * Token screen must feature ultra-legible typography (minimum 48pt font for the 3-digit token) readable from 1.5 meters across a canteen counter.
  * Screen keep-alive/wake-lock enabled on the pickup token screen to prevent phone display sleep while waiting.

---

## 7. Open Questions & Future Considerations

* **Vendor Dashboard Sync:** How does stall staff mark the 3-digit token as "Collected" (merchant tablet app vs. physical scan)?
* **Refund Policy for Expired Orders:** Standard automated refund flow if an e-wallet deducts funds after an order expires due to network latency.
* **Phase 2 Expansion:** Integration with student campus meal plan cards and scheduled pre-ordering for upcoming class days.
