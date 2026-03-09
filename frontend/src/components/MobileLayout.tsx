"use client";

import { ReactNode, useState } from "react";
import TopNavBar from "./TopNavBar";
import TabBar, { DEFAULT_TABS, TabItem } from "./TabBar";

interface MobileLayoutProps {
  /** 페이지 타이틀 (TopNavBar에 표시) */
  title?: string;
  /** 뒤로가기 핸들러 (없으면 < 버튼 미표시) */
  onBack?: () => void;
  /** TopNavBar 우측 액션 */
  navRightAction?: ReactNode;
  /** 탭 목록 (기본: DEFAULT_TABS) */
  tabs?: TabItem[];
  /** 활성 탭 키 */
  activeTab?: string;
  /** 탭 변경 핸들러 */
  onTabChange?: (key: string) => void;
  /** TopNavBar 표시 여부 */
  showNav?: boolean;
  /** TabBar 표시 여부 */
  showTabBar?: boolean;
  children: ReactNode;
}

export default function MobileLayout({
  title = "",
  onBack,
  navRightAction,
  tabs = DEFAULT_TABS,
  activeTab: controlledActiveTab,
  onTabChange,
  showNav = true,
  showTabBar = true,
  children,
}: MobileLayoutProps) {
  const [internalTab, setInternalTab] = useState(tabs[0]?.key ?? "");
  const activeTab = controlledActiveTab ?? internalTab;

  const handleTabChange = (key: string) => {
    setInternalTab(key);
    onTabChange?.(key);
  };

  return (
    /* 모바일 뷰포트 컨테이너 — 375×812 기준 */
    <div className="relative mx-auto flex min-h-screen w-full max-w-[375px] flex-col bg-[#F8F8FC]">
      {/* TopNavBar */}
      {showNav && (
        <TopNavBar title={title} onBack={onBack} rightAction={navRightAction} />
      )}

      {/* 스크롤 가능한 본문 영역 */}
      <main
        className={`flex-1 overflow-y-auto ${showNav ? "pt-[96px]" : ""} ${
          showTabBar ? "pb-[83px]" : ""
        }`}
      >
        {children}
      </main>

      {/* TabBar */}
      {showTabBar && (
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      )}
    </div>
  );
}
