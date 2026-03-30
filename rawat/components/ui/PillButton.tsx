import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "gradient" | "primary-container" | "glass" | "white";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  gradient:
    "bg-linear-to-r from-primary to-primary-container text-on-primary shadow-xl hover:scale-105 active:scale-95",
  "primary-container":
    "bg-primary-container text-on-primary-container hover:bg-primary active:scale-95",
  glass: "border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
  white: "bg-white text-primary hover:bg-surface-container-highest",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-8 py-3 text-sm",
  md: "px-8 py-3 text-sm",
  lg: "px-10 py-5 text-lg",
};

const base =
  "inline-flex items-center justify-center rounded-full font-headline font-bold transition-all duration-300";

export type PillButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function PillButton({
  children,
  variant = "primary-container",
  size = "md",
  className = "",
  ...props
}: PillButtonProps) {
  return (
    <button
      type="button"
      className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export type PillLinkProps = {
  children: ReactNode;
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
};

export function PillLink({
  children,
  href,
  variant = "primary-container",
  size = "md",
  className = "",
}: PillLinkProps) {
  return (
    <Link
      href={href}
      className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
    >
      {children}
    </Link>
  );
}
