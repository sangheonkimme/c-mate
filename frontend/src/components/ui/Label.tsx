type LabelVariant = "primary" | "default" | "outline";

interface LabelProps {
  children: string;
  variant?: LabelVariant;
  className?: string;
}

const variantStyles: Record<LabelVariant, string> = {
  primary: "bg-primary text-white font-bold",
  default: "bg-gray-5 text-gray-1",
  outline: "bg-transparent text-primary border border-primary/50",
};

export default function Label({
  children,
  variant = "default",
  className = "",
}: LabelProps) {
  return (
    <span
      className={`inline-flex items-center rounded-[20px] px-2 py-[3px] text-b3 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
