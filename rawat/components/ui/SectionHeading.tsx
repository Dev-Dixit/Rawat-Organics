type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  align?: "center" | "left";
  /** Accent bar under title (centered layout) */
  showDivider?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  align = "center",
  showDivider = false,
  className = "",
}: SectionHeadingProps) {
  const alignEyebrow = align === "center" ? "text-center" : "text-left";
  const titleAlign = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`mb-12 md:mb-20 ${className}`.trim()}>
      {eyebrow ? (
        <span
          className={`text-secondary font-headline text-sm font-bold uppercase tracking-widest ${alignEyebrow} mb-4 block`}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={`text-primary font-headline text-4xl font-extrabold tracking-tight md:text-5xl ${titleAlign} mb-4`}
      >
        {title}
      </h2>
      {showDivider ? (
        <div className={`flex ${align === "center" ? "justify-center" : "justify-start"}`}>
          <div className="h-1 w-24 rounded-full bg-secondary" />
        </div>
      ) : null}
    </div>
  );
}
