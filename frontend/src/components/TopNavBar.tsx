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
    <header className="fixed top-0 left-0 right-0 z-50 mx-auto w-full max-w-[375px] bg-white border-b border-neutral-lighter h-[96px]">
      <div className="relative flex h-full w-full flex-col justify-end">
        {/* 네비바 컨텐츠 영역 (높이 48px) */}
        <div className="relative flex h-[48px] w-full items-center justify-center">
          
          {/* Left: Back button (hitbox 40px, icon 24px => left 2 (8px) means icon is at 16px) */}
          <div className="absolute left-2 flex h-full items-center">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex h-10 w-10 items-center justify-center text-neutral-dark"
                aria-label="뒤로가기"
              >
                <div className="flex h-[24px] w-[24px] items-center justify-center">
                  <IcoLeft />
                </div>
              </button>
            )}
          </div>

          {/* Center: Title (정중앙 고정) */}
          <h1 className="text-[16px] font-bold leading-[22px] tracking-[-0.3px] text-neutral-dark">
            {title}
          </h1>

          {/* Right: Action */}
          <div className="absolute right-2 flex h-full items-center">
            {rightAction}
          </div>
        </div>
      </div>
    </header>
  );
}
