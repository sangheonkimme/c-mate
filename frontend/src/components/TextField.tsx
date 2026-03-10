"use client";

import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightAdornment?: ReactNode;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, className = "", id, rightAdornment, ...props }, ref) => {
    const inputId = id || label?.replace(/\s/g, "_");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-b2 font-bold text-gray-black">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`
              h-11 w-full rounded-lg border border-gray-3 bg-white
              px-3 text-b1 text-gray-black placeholder:text-gray-3
              outline-none transition-colors
              hover:border-gray-2
              focus:border-gray-2
              disabled:border-gray-4 disabled:bg-gray-6 disabled:text-gray-3 disabled:hover:border-gray-4
              ${error ? "border-red-500" : ""}
              ${className}
              ${rightAdornment ? "pr-12" : ""}
            `.trim()}
            {...props}
          />
          {rightAdornment && (
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center">
              {rightAdornment}
            </div>
          )}
        </div>
        {error && <p className="text-b3 text-red-500">{error}</p>}
      </div>
    );
  }
);

TextField.displayName = "TextField";
export default TextField;
