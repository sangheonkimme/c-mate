"use client";

import { ReactNode } from "react";

import { MobileLayout } from "@/components";

interface BasicInfoEditLayoutProps {
  heading: string;
  description?: ReactNode;
  notice?: ReactNode;
  onBack: () => void;
  footer: ReactNode;
  children: ReactNode;
}

const BasicInfoEditLayout = ({
  heading,
  description,
  notice,
  onBack,
  footer,
  children,
}: BasicInfoEditLayoutProps) => {
  return (
    <MobileLayout
      title="기본정보"
      activeTab="mypage"
      onBack={onBack}
      showNav={true}
      showTabBar={true}
    >
      <div className="flex min-h-[calc(100dvh-175px)] flex-col bg-white p-4">
        <div>
          <h2 className="text-H1 text-gray-black">{heading}</h2>
          {description && <div className="mt-4 text-b1 text-gray-2">{description}</div>}
          {notice && <div className="mt-4">{notice}</div>}
          <div className="mt-6">{children}</div>
        </div>

        <div className="mt-auto">{footer}</div>
      </div>
    </MobileLayout>
  );
};

export default BasicInfoEditLayout;
