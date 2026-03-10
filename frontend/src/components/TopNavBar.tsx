"use client";

import { ReactNode } from "react";
import IcoLeft from "@/assets/icons/ico-left.svg";

interface TopNavBarProps {
  title: string;
  onBack?: () => void;
  rightAction?: ReactNode;
}

export default function TopNavBar({ title, onBack, rightAction }: TopNavBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 mx-auto h-[92px] w-full max-w-[375px] border-b border-gray-6 bg-white">
      <div className="grid h-full grid-rows-[44px_48px]">
        <div aria-hidden="true" />

        <div className="relative flex h-12 items-center justify-center">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="absolute left-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-gray-black"
              aria-label="뒤로가기"
            >
              <IcoLeft className="h-6 w-6" />
            </button>
          )}

          <h1 className="text-B1 text-gray-black">{title}</h1>

          <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center">
            {rightAction}
          </div>
        </div>
      </div>
    </header>
  );
}
