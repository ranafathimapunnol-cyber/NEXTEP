import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
};

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200";

  const variants = {
    primary:
      "bg-gray-900 text-white shadow-sm hover:bg-gray-800 hover:-translate-y-0.5",
    secondary:
      "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-300",
    ghost:
      "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  };

  const styles = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={styles}>
      {children}
    </button>
  );
}