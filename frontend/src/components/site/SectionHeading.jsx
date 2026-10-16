export function SectionHeading({ eyebrow, title, description, light = false }) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2
        className={`mt-4 text-3xl font-bold leading-tight md:text-5xl ${light ? "text-primary-foreground" : "text-foreground"}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 max-w-2xl leading-7 ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
