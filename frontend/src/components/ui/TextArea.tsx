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
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={textareaId} className="text-b1 text-gray-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            min-h-[150px] w-full resize-none rounded-[12px] border border-gray-4
            bg-white px-5 py-3 text-b1 leading-6 text-gray-black
            placeholder:text-gray-3 outline-none transition-colors
            hover:border-gray-2
            focus:border-gray-2
            disabled:border-gray-4 disabled:bg-gray-5 disabled:text-gray-3 disabled:hover:border-gray-4
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
