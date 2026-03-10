"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ label, className = "", id, ...props }, ref) => {
    const inputId = id || label?.replace(/\s/g, "_");

    return (
      <label htmlFor={inputId} className={`inline-flex cursor-pointer items-center gap-2 ${className}`}>
        <span className="relative flex h-5 w-5 items-center justify-center">
          <input
            ref={ref}
            type="radio"
            id={inputId}
            className="peer sr-only"
            {...props}
          />
          {/* Outer circle */}
          <span className="absolute h-5 w-5 rounded-full border-2 border-gray-3 peer-checked:border-primary" />
          {/* Inner dot */}
          <span className="absolute h-2.5 w-2.5 scale-0 rounded-full bg-primary transition-transform peer-checked:scale-100" />
        </span>
        {label && <span className="text-b1 text-gray-black">{label}</span>}
      </label>
    );
  }
);

RadioButton.displayName = "RadioButton";
export default RadioButton;
