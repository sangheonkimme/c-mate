"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "textLink";
type ButtonSize = "xl" | "l" | "m" | "s";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const sizeStyles: Record<ButtonSize, string> = {
  xl: "h-16 px-7 text-B1",
  l: "h-14 px-6 text-B1",
  m: "h-12 px-5 text-B1",
  s: "h-8 px-3 text-b3",
};

const variantStyles: Record<ButtonVariant, {
  base: string;
  hover: string;
  disabled: string;
}> = {
  primary: {
    base: "bg-primary text-white rounded-[12px]",
    hover: "hover:brightness-80",
    disabled: "disabled:bg-primary/12 disabled:text-white",
  },
  secondary: {
    base: "bg-white text-primary border border-[#FF5F7980] rounded-[8px]",
    hover: "hover:bg-primary/10 hover:border-primary",
    disabled: "disabled:text-primary/12 disabled:border-primary/30",
  },
  ghost: {
    base: "bg-transparent text-gray-1 border-none rounded-[8px]",
    hover: "hover:bg-gray-3 hover:text-gray-black",
    disabled: "disabled:text-gray-3 disabled:bg-gray-6",
  },
  textLink: {
    base: "bg-transparent text-gray-1 border-none p-0",
    hover: "hover:text-gray-black",
    disabled: "disabled:text-gray-3",
  },
};

export default function Button({
  variant = "primary",
  size = "m",
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];
  const sizeClass = variant === "textLink" ? "" : sizeStyles[size];

  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-1.5 font-bold
        transition-all duration-150 cursor-pointer
        disabled:cursor-not-allowed
        ${styles.base} ${styles.hover} ${styles.disabled}
        ${sizeClass} ${className}
      `.trim()}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
