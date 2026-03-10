"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.replace(/\s/g, "_");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-b2 font-bold text-gray-black">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            h-11 w-full rounded-lg border border-gray-3 bg-white
            px-3 text-b1 text-gray-black placeholder:text-gray-3
            outline-none transition-colors
            hover:border-gray-black
            focus:border-primary
            disabled:bg-gray-6 disabled:text-gray-3
            ${error ? "border-red-500" : ""}
            ${className}
          `.trim()}
          {...props}
        />
        {error && <p className="text-b3 text-red-500">{error}</p>}
      </div>
    );
  }
);

TextField.displayName = "TextField";
export default TextField;
