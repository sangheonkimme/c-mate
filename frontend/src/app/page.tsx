"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { Button, MobileLayout } from "@/components";
import { PROFILE_USER_ID } from "@/features/profile-edit/constants";
import {
  MY_PAGE_DEFAULT_SUMMARY,
  MY_PAGE_MENU_ITEMS,
  MY_PAGE_TOAST_MESSAGE,
} from "@/features/mypage/data";
import { useMyPageSummaryQuery } from "@/hooks/queries/useProfileQueries";

import IcoRight from "@/assets/icons/ico-right.svg";
import IcoVolume from "@/assets/icons/ico-volume.svg";

export default function Home() {
  const router = useRouter();
  const myPageSummaryQuery = useMyPageSummaryQuery(PROFILE_USER_ID);

  const myPage = {
    summary: myPageSummaryQuery.data ?? MY_PAGE_DEFAULT_SUMMARY,
    fetchErrorMessage: myPageSummaryQuery.isError
      ? myPageSummaryQuery.error.message
      : "",
    completionRate: Math.min(
      Math.max(
        (myPageSummaryQuery.data ?? MY_PAGE_DEFAULT_SUMMARY).completionRate,
        0,
      ),
      100,
    ),
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const savedProfileId = searchParams.get("saved");
    const currentProfileId = myPageSummaryQuery.data?.id;

    if (!savedProfileId || !currentProfileId) return;
    if (savedProfileId !== String(currentProfileId)) return;

    toast(MY_PAGE_TOAST_MESSAGE, { id: "profile-saved" });
    router.replace("/");
  }, [myPageSummaryQuery.data?.id, router]);

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
                background: `conic-gradient(var(--color-primary) ${myPage.completionRate}%, var(--color-gray-4, #E4E6F0) ${myPage.completionRate}%)`,
              }}
            >
              <div className="absolute left-1/2 top-1/2 flex h-[78px] w-[78px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white">
                <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full bg-gray-6">
                  {myPage.summary.profileImage ? (
                    <Image
                      src={myPage.summary.profileImage}
                      alt={`${myPage.summary.name} 프로필 사진`}
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
                  {myPage.summary.name} {myPage.summary.age}
                </h2>
              </div>
              <p className="mt-1 text-b2 text-gray-2">
                {myPage.summary.location} • {myPage.summary.marriageStatus} •{" "}
                {myPage.summary.religion} • {myPage.summary.job}
              </p>
              <p className="mt-1 text-b3 text-gray-2">
                프로필 완성도{" "}
                <span className="font-medium text-primary">
                  {myPage.completionRate}%
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

          {myPage.fetchErrorMessage && (
            <p className="mt-3 text-b3 text-sub-red">
              {myPage.fetchErrorMessage}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-white px-5 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <ul className="flex flex-col">
            {MY_PAGE_MENU_ITEMS.map((item, idx) => {
              const Icon = item.icon;

              return (
                <li
                  key={item.label}
                  className={`${
                    idx !== MY_PAGE_MENU_ITEMS.length - 1
                      ? "border-b border-gray-6"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => (item.href ? router.push(item.href) : null)}
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
