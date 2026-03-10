"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const textareaId = id || label?.replace(/\s/g, "_");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-b2 font-bold text-gray-black">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            min-h-[150px] w-full resize-none rounded-lg border border-gray-3
            bg-white px-3 py-3 text-b1 text-gray-black
            placeholder:text-gray-3 outline-none transition-colors
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

TextArea.displayName = "TextArea";
export default TextArea;
