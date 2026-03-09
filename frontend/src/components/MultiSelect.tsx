"use client";

interface MultiSelectProps {
  options: { value: string; label: string }[];
  values: string[];
  onChange?: (values: string[]) => void;
  className?: string;
}

export default function MultiSelect({
  options,
  values,
  onChange,
  className = "",
}: MultiSelectProps) {
  const toggle = (val: string) => {
    const next = values.includes(val)
      ? values.filter((v) => v !== val)
      : [...values, val];
    onChange?.(next);
  };

  return (
    <ul className={`rounded-lg border border-neutral-light bg-white ${className}`}>
      {options.map((option) => {
        const isSelected = values.includes(option.value);
        return (
          <li key={option.value}>
            <button
              type="button"
              onClick={() => toggle(option.value)}
              className={`
                flex w-full items-center px-3 py-2.5 text-b1 transition-colors
                ${isSelected ? "text-neutral-dark font-bold" : "text-neutral-light"}
              `.trim()}
            >
              {option.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
