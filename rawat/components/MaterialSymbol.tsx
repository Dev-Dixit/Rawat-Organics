import type { HTMLAttributes } from "react";

type MaterialSymbolProps = {
  /** Icon name as Material Symbols ligature, e.g. "spa", "arrow_forward" */
  name: string;
  /** Filled style (e.g. rating stars) */
  filled?: boolean;
} & Omit<HTMLAttributes<HTMLSpanElement>, "children">;

const iconOutline =
  "inline-block font-['Material_Symbols_Outlined',sans-serif] not-italic font-normal leading-none whitespace-nowrap [font-variation-settings:'FILL'_0,'wght'_300,'GRAD'_0,'opsz'_24] antialiased";

const iconFilled =
  "inline-block font-['Material_Symbols_Outlined',sans-serif] not-italic font-normal leading-none whitespace-nowrap [font-variation-settings:'FILL'_1,'wght'_300,'GRAD'_0,'opsz'_24] antialiased";

/**
 * Material Symbols icon — styling is Tailwind-only (no global CSS class).
 */
export function MaterialSymbol({ name, filled = false, className = "", ...props }: MaterialSymbolProps) {
  return (
    <span className={`${filled ? iconFilled : iconOutline} ${className}`.trim()} {...props}>
      {name}
    </span>
  );
}
