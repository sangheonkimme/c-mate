"use client";

import { ReactNode } from "react";
import IcoHome from "@/assets/icons/ico-home.svg";
import IcoSearch from "@/assets/icons/ico-search.svg";
import IcoHeart from "@/assets/icons/ico-heart.svg";
import IcoMsg from "@/assets/icons/ico-msg.svg";
import IcoUser from "@/assets/icons/ico-user.svg";

export interface TabItem {
  key: string;
  label: string;
  icon: ReactNode;
}

/** 피그마 기준 기본 5탭 */
export const DEFAULT_TABS: TabItem[] = [
  { key: "home", label: "Home", icon: <IcoHome /> },
  { key: "search", label: "탐색", icon: <IcoSearch /> },
  { key: "match", label: "매칭", icon: <IcoHeart /> },
  { key: "chat", label: "대화", icon: <IcoMsg /> },
  { key: "mypage", label: "마이페이지", icon: <IcoUser /> },
];

interface TabBarProps {
  tabs?: TabItem[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export default function TabBar({
  tabs = DEFAULT_TABS,
  activeTab,
  onTabChange,
}: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-[375px] h-[83px] border-t border-neutral-lighter bg-white">
      {/* 343px 폭으로 고정된 내부 컨테이너 (좌우 16px 패딩 효과), 위쪽 여백 4px(또는 적절히 띄움) */}
      <div className="mx-auto flex h-full w-[343px] flex-col pt-[4px]">
        <ul className="flex h-[46px] w-full items-center justify-between">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <li key={tab.key} className="h-[46px] w-[68px]">
                <button
                  type="button"
                  onClick={() => onTabChange(tab.key)}
                  className={`flex h-full w-full flex-col items-center justify-center gap-[2px] transition-colors ${
                    isActive ? "text-primary" : "text-neutral-light hover:text-neutral"
                  }`}
                >
                  <div className="flex h-6 w-6 items-center justify-center">
                    <span className="[&_svg]:h-[22px] [&_svg]:w-[22px]">{tab.icon}</span>
                  </div>
                  <span className="text-[10px] font-medium leading-none">{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
