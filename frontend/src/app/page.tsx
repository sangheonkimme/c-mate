"use client";

import { MobileLayout, Button } from "@/components";
import Image from "next/image";

import IcoEye from "@/assets/icons/ico-eye.svg";
import IcoEdit from "@/assets/icons/ico-edit.svg";
import IcoHeart from "@/assets/icons/ico-heart.svg";
import IcoStar from "@/assets/icons/ico-star.svg";
import IcoBroadcast from "@/assets/icons/ico-broadcast.svg";
import IcoBell from "@/assets/icons/ico-bell.svg";
import IcoUsers from "@/assets/icons/ico-users.svg";
import IcoSettings from "@/assets/icons/ico-settings.svg";
import IcoRight from "@/assets/icons/ico-right.svg";

const IconSpeaker = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-1">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);

const MENU_ITEMS = [
  { label: "나의 프로필 보기", icon: <IcoEye className="text-gray-2 w-6 h-6" /> },
  { label: "프로필 수정하기", icon: <IcoEdit className="text-gray-2 w-6 h-6" /> },
  { label: "호감 리스트", icon: <IcoHeart className="text-gray-2 w-6 h-6" /> },
  { label: "매니저 추천", icon: <IcoStar className="text-gray-2 w-6 h-6" /> },
  { label: "파티공고 보기", icon: <IcoBroadcast className="text-gray-2 w-6 h-6" /> },
  { label: "공지사항", icon: <IcoBell className="text-gray-2 w-6 h-6" /> },
  { label: "1:1 문의", icon: <IcoUsers className="text-gray-2 w-6 h-6" /> },
  { label: "설정", icon: <IcoSettings className="text-gray-2 w-6 h-6" /> },
];

export default function Home() {
  return (
    <MobileLayout
      title="마이페이지"
      showNav={true}
      showTabBar={true}
      onBack={() => {}} // 뒤로가기 기본 동작 임시 연결 (필요 시 라우팅 구현)
    >
      {/* 바깥쪽 패딩 p-4(16px), 하위 2개의 내부 박스는 flex-col로 배치 */}
      <div className="flex flex-col gap-4 p-4">
        
        {/* 1. 프로필 박스 */}
        <div className="rounded-2xl bg-white px-3 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4">
            
            {/* 프로필 이미지 (완성도 80% 링) */}
            <div
              className="relative flex items-center justify-center rounded-full w-[84px] h-[84px]"
              style={{ background: "conic-gradient(var(--color-primary) 80%, var(--color-gray-4, #E4E6F0) 80%)" }}
            >
              <div className="flex items-center justify-center w-[78px] h-[78px] bg-white rounded-full">
                <div className="w-[72px] h-[72px] overflow-hidden rounded-full bg-gray-6">
                  {/* 실제 사진 위치 - 현재는 뷰 목적으로 플레이스홀더 */}
                  <div className="w-full h-full bg-gray-300"></div>
                </div>
              </div>
            </div>

            {/* 유저 텍스트 정보 */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <h2 className="text-B1 text-gray-black">임승리 36</h2>
              </div>
              <p className="mt-1 text-b2 text-gray-2">서울 • 초혼 • 창신교회 • 사무직</p>
              <p className="mt-1 text-b3 text-gray-2">
                프로필 완성도 <span className="text-primary font-medium">80%</span>
              </p>
            </div>
            
          </div>

          {/* 목소리로 첫인상 전달하기 버튼 */}
          <Button
            variant="secondary"
            size="m"
            className="mt-4 w-full"
            leftIcon={<IconSpeaker />}
          >
            목소리로 첫인상 전달하기
          </Button>
        </div>

        {/* 2. 메뉴 리스트 박스 */}
        <div className="rounded-2xl bg-white px-5 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <ul className="flex flex-col">
            {MENU_ITEMS.map((item, idx) => (
              <li
                key={idx}
                className={`flex cursor-pointer items-center justify-between py-[18px] transition-colors active:bg-gray-50 ${
                  idx !== MENU_ITEMS.length - 1 ? "border-b border-gray-6" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-b1 text-gray-black">{item.label}</span>
                </div>
                <IcoRight className="w-6 h-6 text-gray-3" />
              </li>
            ))}
          </ul>
        </div>
        
      </div>
    </MobileLayout>
  );
}
