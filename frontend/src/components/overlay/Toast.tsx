"use client";

interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <div
      aria-live="polite"
      aria-hidden={!visible}
      className={`pointer-events-none fixed bottom-[99px] left-1/2 z-50 w-[calc(100%-32px)] max-w-[343px] -translate-x-1/2 rounded-[12px] bg-gray-black/90 px-4 py-3 text-center text-b2 text-white shadow-[0_8px_24px_rgba(17,17,17,0.18)] transition-all duration-200 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-3 opacity-0"
      }`}
      role="status"
    >
      {message}
    </div>
  );
}
