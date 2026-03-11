"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button, MobileLayout, Toast } from "@/components";
import { PROFILE_USER_ID } from "@/app/profile/edit/constants";

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

type MyPageSummary = {
  name: string;
  age: number;
  location: string;
  marriageStatus: string;
  religion: string;
  job: string;
  completionRate: number;
  profileImage: string | null;
};

const DEFAULT_SUMMARY: MyPageSummary = {
  name: "임승리",
  age: 36,
  location: "서울",
  marriageStatus: "초혼",
  religion: "창신교회",
  job: "사무직",
  completionRate: 80,
  profileImage: null,
};

export default function Home() {
  const router = useRouter();
  const [myPageSummary, setMyPageSummary] = useState(DEFAULT_SUMMARY);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [fetchErrorMessage, setFetchErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadMyPageSummary = async () => {
      try {
        const response = await fetch(`/api/profile/${PROFILE_USER_ID}/mypage`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("마이페이지 정보를 불러오지 못했습니다.");
        }

        const summary = (await response.json()) as Partial<MyPageSummary>;

        if (!isMounted) {
          return;
        }

        setMyPageSummary({
          name: summary.name ?? DEFAULT_SUMMARY.name,
          age: summary.age ?? DEFAULT_SUMMARY.age,
          location: summary.location ?? DEFAULT_SUMMARY.location,
          marriageStatus:
            summary.marriageStatus ?? DEFAULT_SUMMARY.marriageStatus,
          religion: summary.religion ?? DEFAULT_SUMMARY.religion,
          job: summary.job ?? DEFAULT_SUMMARY.job,
          completionRate:
            summary.completionRate ?? DEFAULT_SUMMARY.completionRate,
          profileImage: summary.profileImage ?? DEFAULT_SUMMARY.profileImage,
        });
        setFetchErrorMessage("");
      } catch (error) {
        console.error("마이페이지 조회 실패:", error);

        if (isMounted) {
          setFetchErrorMessage(
            "마이페이지 정보를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.",
          );
        }
      }
    };

    void loadMyPageSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("saved") !== "1") {
      return;
    }

    setShowSavedToast(true);
    router.replace("/");
  }, [router]);

  useEffect(() => {
    if (!showSavedToast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowSavedToast(false);
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showSavedToast]);

  const completionRate = Math.min(
    Math.max(myPageSummary.completionRate, 0),
    100,
  );

  return (
    <MobileLayout
      title="마이페이지"
      activeTab="mypage"
      showNav={true}
      showTabBar={true}
      onBack={() => {}}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-2xl bg-white px-3 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4">
            <div
              className="relative h-[84px] w-[84px] rounded-full"
              style={{
                background: `conic-gradient(var(--color-primary) ${completionRate}%, var(--color-gray-4, #E4E6F0) ${completionRate}%)`,
              }}
            >
              <div className="absolute left-1/2 top-1/2 flex h-[78px] w-[78px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white">
                <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full bg-gray-6">
                  {myPageSummary.profileImage ? (
                    <Image
                      src={myPageSummary.profileImage}
                      alt={`${myPageSummary.name} 프로필 사진`}
                      fill
                      sizes="72px"
                      unoptimized
                      className="object-cover"
                      priority
                    />
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <h2 className="text-B1 text-gray-black">
                  {myPageSummary.name} {myPageSummary.age}
                </h2>
              </div>
              <p className="mt-1 text-b2 text-gray-2">
                {myPageSummary.location} • {myPageSummary.marriageStatus} •{" "}
                {myPageSummary.religion} • {myPageSummary.job}
              </p>
              <p className="mt-1 text-b3 text-gray-2">
                프로필 완성도{" "}
                <span className="font-medium text-primary">
                  {completionRate}%
                </span>
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="m"
            className="mt-4 w-full"
            leftIcon={<IcoVolume className="h-6 w-6 text-primary" />}
          >
            목소리로 첫인상 전달하기
          </Button>

          {fetchErrorMessage && (
            <p className="mt-3 text-b3 text-sub-red">{fetchErrorMessage}</p>
          )}
        </div>

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

      <Toast
        message="프로필 저장이 완료되었어요"
        visible={showSavedToast}
      />
    </MobileLayout>
  );
}
