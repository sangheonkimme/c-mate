"use client";

import { useState, useRef, useEffect } from "react";

interface SelectboxProps {
  options: { value: string; label: string }[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}

export default function Selectbox({
  options,
  value,
  placeholder = "선택",
  disabled = false,
  onChange,
  className = "",
}: SelectboxProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`
          flex h-11 w-full items-center justify-between rounded-lg border px-3 text-b1
          transition-colors
          ${disabled
            ? "cursor-not-allowed border-neutral-lighter bg-neutral-lighter text-neutral-light"
            : selected
              ? "border-neutral-dark bg-neutral-dark text-white"
              : "border-neutral-light bg-white text-neutral-dark"
          }
        `.trim()}
      >
        <span className={selected ? "" : "text-neutral-light"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <ul className="absolute z-50 mt-1 w-full rounded-lg border border-neutral-lighter bg-white py-1 shadow-lg">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange?.(option.value);
                    setOpen(false);
                  }}
                  className={`
                    flex w-full items-center justify-between px-3 py-2.5 text-b1 transition-colors
                    ${isSelected
                      ? "bg-neutral-dark text-white"
                      : "text-neutral-dark hover:bg-neutral-lighter"
                    }
                  `.trim()}
                >
                  {option.label}
                  {isSelected && (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
