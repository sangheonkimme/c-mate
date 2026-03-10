"use client";

import Image from "next/image";
import { MobileLayout, Button } from "@/components";
import { useRouter } from "next/navigation";

import profileMainImage from "@/assets/imgs/profile-main.jpg";
import IcoEye from "@/assets/icons/ico-eye.svg";
import IcoEdit from "@/assets/icons/ico-edit.svg";
import IcoHeart from "@/assets/icons/ico-heart.svg";
import IcoStar from "@/assets/icons/ico-star.svg";
import IcoBroadcast from "@/assets/icons/ico-broadcast.svg";
import IcoBell from "@/assets/icons/ico-bell.svg";
import IcoUsers from "@/assets/icons/ico-users.svg";
import IcoSettings from "@/assets/icons/ico-settings.svg";
import IcoRight from "@/assets/icons/ico-right.svg";
import IcoVolume from "@/assets/icons/ico-volume.svg";

const MENU_ITEMS = [
  { label: "나의 프로필 보기", icon: IcoEye },
  { label: "프로필 수정하기", icon: IcoEdit, href: "/profile/edit" },
  { label: "호감 리스트", icon: IcoHeart },
  { label: "매니저 추천", icon: IcoStar },
  { label: "파티공고 보기", icon: IcoBroadcast },
  { label: "공지사항", icon: IcoBell },
  { label: "1:1 문의", icon: IcoUsers },
  { label: "설정", icon: IcoSettings },
];

export default function Home() {
  const router = useRouter();

  return (
    <MobileLayout
      title="마이페이지"
      activeTab="mypage"
      showNav={true}
      showTabBar={true}
      onBack={() => {}}
    >
      {/* 바깥쪽 패딩 p-4(16px), 하위 2개의 내부 박스는 flex-col로 배치 */}
      <div className="flex flex-col gap-4 p-4">
        {/* 1. 프로필 박스 */}
        <div className="rounded-2xl bg-white px-3 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4">
            {/* 프로필 이미지 (완성도 80% 링) */}
            <div
              className="relative flex items-center justify-center rounded-full w-[84px] h-[84px]"
              style={{
                background:
                  "conic-gradient(var(--color-primary) 80%, var(--color-gray-4, #E4E6F0) 80%)",
              }}
            >
              <div className="flex items-center justify-center w-[78px] h-[78px] bg-white rounded-full">
                <div className="relative w-[72px] h-[72px] overflow-hidden rounded-full bg-gray-6">
                  <Image
                    src={profileMainImage}
                    alt="임승리 프로필 사진"
                    fill
                    sizes="72px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* 유저 텍스트 정보 */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <h2 className="text-B1 text-gray-black">임승리 36</h2>
              </div>
              <p className="mt-1 text-b2 text-gray-2">
                서울 • 초혼 • 창신교회 • 사무직
              </p>
              <p className="mt-1 text-b3 text-gray-2">
                프로필 완성도{" "}
                <span className="text-primary font-medium">80%</span>
              </p>
            </div>
          </div>

          {/* 목소리로 첫인상 전달하기 버튼 */}
          <Button
            variant="secondary"
            size="m"
            className="mt-4 w-full"
            leftIcon={<IcoVolume className="h-6 w-6 text-primary" />}
          >
            목소리로 첫인상 전달하기
          </Button>
        </div>

        {/* 2. 메뉴 리스트 박스 */}
        <div className="rounded-2xl bg-white px-5 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <ul className="flex flex-col">
            {MENU_ITEMS.map((item, idx) => {
              const Icon = item.icon;

              return (
                <li
                  key={item.label}
                  className={`${
                    idx !== MENU_ITEMS.length - 1
                      ? "border-b border-gray-6"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (item.href) {
                        router.push(item.href);
                      }
                    }}
                    className="flex w-full cursor-pointer items-center justify-between py-[18px] transition-colors active:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-gray-2" />
                      <span className="text-b1 text-gray-black">
                        {item.label}
                      </span>
                    </div>
                    <IcoRight className="shrink-0 text-gray-3" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </MobileLayout>
  );
}
