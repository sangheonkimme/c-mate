type LabelVariant = "primary" | "default" | "outline";

interface LabelProps {
  children: string;
  variant?: LabelVariant;
  className?: string;
}

const variantStyles: Record<LabelVariant, string> = {
  primary: "bg-primary text-white",
  default: "bg-neutral-lighter text-neutral",
  outline: "bg-transparent text-primary border border-primary/50",
};

export default function Label({
  children,
  variant = "primary",
  className = "",
}: LabelProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-b3 font-bold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
