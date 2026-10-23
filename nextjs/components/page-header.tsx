type PageHeaderProps = {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="pb-6 pt-1">
      <h1 className="font-head text-[24px] font-semibold tracking-[-0.02em] text-charcoal">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 text-[13px] leading-relaxed text-fog">
          {description}
        </p>
      ) : null}
    </header>
  )
}
