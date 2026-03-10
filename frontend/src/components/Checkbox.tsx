"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", id, ...props }, ref) => {
    const inputId = id || label?.replace(/\s/g, "_");

    return (
      <label htmlFor={inputId} className={`inline-flex cursor-pointer items-center gap-2 ${className}`}>
        <span className="relative flex h-5 w-5 items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            className="peer sr-only"
            {...props}
          />
          {/* Off state */}
          <span className="absolute h-5 w-5 rounded border-2 border-gray-3 peer-checked:border-primary peer-checked:bg-primary" />
          {/* Check icon */}
          <svg
            className="absolute h-3 w-3 scale-0 text-white transition-transform peer-checked:scale-100"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 6l3 3 5-5" />
          </svg>
        </span>
        {label && <span className="text-b1 text-gray-black">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
