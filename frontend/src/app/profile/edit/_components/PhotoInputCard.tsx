"use client";

import Image, { type StaticImageData } from "next/image";
import {
  type CSSProperties,
  type ChangeEvent,
  type ReactNode,
  useId,
} from "react";

type PhotoInputCardProps = {
  src?: StaticImageData | string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  sizes: string;
  priority?: boolean;
  accept?: string;
  multiple?: boolean;
  placeholder?: ReactNode;
  children?: ReactNode;
  onSelectFiles: (files: File[]) => void;
};

const PhotoInputCard = ({
  src,
  alt,
  className = "",
  imageClassName = "",
  overlayClassName,
  overlayStyle,
  sizes,
  priority = false,
  accept = "image/*",
  multiple = false,
  placeholder,
  children,
  onSelectFiles,
}: PhotoInputCardProps) => {
  const inputId = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    onSelectFiles(files);
    event.target.value = "";
  };

  return (
    <label
      htmlFor={inputId}
      className={`relative block cursor-pointer overflow-hidden ${className}`}
    >
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={handleChange}
      />

      {src ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            unoptimized={typeof src === "string"}
            className={`object-cover ${imageClassName}`}
          />
          {(overlayClassName || overlayStyle) && (
            <div
              className={`absolute ${overlayClassName ?? "inset-0"}`}
              style={overlayStyle}
            />
          )}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-4 text-white">
          {placeholder}
        </div>
      )}

      {children}
    </label>
  );
};

export default PhotoInputCard;
