"use client";

import { MobileLayout } from "@/components";

export default function Home() {
  return (
    <MobileLayout
      title="마이페이지"
      showNav={true}
      showTabBar={true}
      onBack={() => {}} // 임시 핸들러
    >
      {/* 본문 컨텐츠 */}
    </MobileLayout>
  );
}
