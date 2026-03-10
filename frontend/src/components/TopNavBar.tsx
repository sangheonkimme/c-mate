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
    <header className="fixed top-0 left-0 right-0 z-50 mx-auto w-full max-w-[375px] bg-white border-b border-gray-6 h-[96px]">
      <div className="relative flex h-full w-full flex-col justify-end">
        {/* 네비바 컨텐츠 영역 (높이 48px) */}
        <div className="relative flex h-[48px] w-full items-center justify-center">
          
          {/* Left: Action */}
          <div className="absolute left-2 flex h-full items-center">
            {onBack && ( // Assuming onBack implies a back button, similar to the original logic
              <button
                type="button"
                onClick={onBack}
                className="flex h-10 w-10 items-center justify-center text-gray-black" // Original text-gray-black
                aria-label="뒤로가기"
              >
                <div className="flex h-[24px] w-[24px] items-center justify-center"> {/* Original icon wrapper */}
                  <IcoLeft />
                </div>
              </button>
            )}
          </div>

          {/* Center: Title (정중앙 고정) */}
          <div className="absolute left-1/2 flex -translate-x-1/2 transform items-center justify-center">
            <h1 className="text-B1 text-gray-black">
              {title}
            </h1>
          </div>

          {/* Right: Action */}
          <div className="absolute right-2 flex h-full items-center">
            {rightAction}
          </div>
        </div>
      </div>
    </header>
  );
}
