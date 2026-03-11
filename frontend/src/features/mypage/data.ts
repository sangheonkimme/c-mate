import type { ComponentType } from "react";
import { PROFILE_USER_ID } from "@/features/profile-edit/constants";
import type { MyPageSummary } from "@/types/profile";

import IcoBell from "@/assets/icons/ico-bell.svg";
import IcoBroadcast from "@/assets/icons/ico-broadcast.svg";
import IcoEdit from "@/assets/icons/ico-edit.svg";
import IcoEye from "@/assets/icons/ico-eye.svg";
import IcoHeart from "@/assets/icons/ico-heart.svg";
import IcoSettings from "@/assets/icons/ico-settings.svg";
import IcoStar from "@/assets/icons/ico-star.svg";
import IcoUsers from "@/assets/icons/ico-users.svg";

export const MY_PAGE_TOAST_MESSAGE = "프로필 저장이 완료되었어요";

export type MyPageMenuItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  href?: string;
};

export const MY_PAGE_MENU_ITEMS: MyPageMenuItem[] = [
  { label: "나의 프로필 보기", icon: IcoEye },
  { label: "프로필 수정하기", icon: IcoEdit, href: "/profile/edit" },
  { label: "호감 리스트", icon: IcoHeart },
  { label: "매니저 추천", icon: IcoStar },
  { label: "파티공고 보기", icon: IcoBroadcast },
  { label: "공지사항", icon: IcoBell },
  { label: "1:1 문의", icon: IcoUsers },
  { label: "설정", icon: IcoSettings },
];

export const MY_PAGE_DEFAULT_SUMMARY: MyPageSummary = {
  id: PROFILE_USER_ID,
  name: "임승리",
  age: 36,
  location: "서울",
  marriageStatus: "초혼",
  religion: "창신교회",
  job: "사무직",
  completionRate: 80,
  profileImage: null,
};
