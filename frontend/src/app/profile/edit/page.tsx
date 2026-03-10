"use client";

import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";

import profileMainImage from "@/assets/imgs/profile-main.jpg";
import profilePhotobook01Image from "@/assets/imgs/profile-photobook-01.jpg";
import profileSub01Image from "@/assets/imgs/profile-sub-01.jpg";
import profileSub02Image from "@/assets/imgs/profile-sub-02.jpg";
import IcoImgEdit from "@/assets/icons/ico-img-edit.svg";
import IcoPlus from "@/assets/icons/ico-plus.svg";
import IcoVolume from "@/assets/icons/ico-volume.svg";
import {
  Button,
  InfoRow,
  Label,
  MobileLayout,
  Section,
  SectionTitle,
  TagPanel,
  TextArea,
} from "@/components";

type BasicInfoItem = {
  label: string;
  value: string;
  editable?: boolean;
  muted?: boolean;
};

const BASIC_INFO: BasicInfoItem[] = [
  { label: "이름", value: "임승리" },
  { label: "성별", value: "여성", editable: false, muted: true },
  { label: "나이", value: "89년생", editable: false, muted: true },
  { label: "결혼경험", value: "초혼" },
  { label: "신장", value: "170cm" },
  { label: "나의 체형", value: "조금 통통" },
  { label: "거주 지역", value: "서울" },
  { label: "최종학력", value: "대졸" },
  { label: "학교/전공", value: "총신대학교 / 신학과" },
  { label: "직장명/직무", value: "크리스천 메이트 / 커플 매니저" },
  { label: "연봉", value: "3000~4000만원" },
  { label: "출석 교회명", value: "창신교회" },
  { label: "모태신앙", value: "그렇다" },
  { label: "음주 여부", value: "아예 하지 않습니다" },
  { label: "흡연 여부", value: "비흡연" },
];

const CHARM_TAGS = [
  "선함",
  "긍정적인 마인드",
  "건강미",
  "키큰",
  "뚜렷한 이목구비",
  "부드러운",
];
const IDEAL_TAGS = [
  "슬림 탄탄한",
  "절실한 신앙심",
  "동갑,연상",
  "180 이상",
  "유머러스함",
  "섬세함",
];
const LIFESTYLE_TAGS = [
  "💃 라틴댄스",
  "👯 현대무용",
  "✝️ 신앙서적",
  "🎥 유튜브",
  "✈️ 해외 여행",
  "👟 러닝",
  "🏋️ 헬스",
  "🎶 찬양/CCM",
];

const PLUS_TILE_CLASS = "flex items-center justify-center bg-gray-4 text-white";
const SUB_PROFILE_SLOT_COUNT = 4;

const SUB_PROFILE_IMAGES = [
  { src: profileSub01Image, alt: "서브 프로필 사진 1" },
  { src: profileSub02Image, alt: "서브 프로필 사진 2" },
];

function PhotoCard({
  src,
  alt,
  className = "",
  imageClassName = "",
  overlayClassName,
  overlayStyle,
  sizes,
  priority = false,
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
  imageClassName?: string;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-cover ${imageClassName}`}
        priority={priority}
      />
      <div
        className={`absolute ${
          overlayClassName ??
          "inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(53,54,68,0)_0%,rgba(53,54,68,0.14)_100%)]"
        }`}
        style={overlayStyle}
      />
    </div>
  );
}

export default function ProfileEditPage() {
  const router = useRouter();

  return (
    <MobileLayout
      title="프로필 수정하기"
      activeTab="mypage"
      onBack={() => router.push("/")}
      showNav={true}
      showTabBar={true}
    >
      <div className="flex flex-col gap-4 bg-gray-6 py-4">
        <Section>
          <div className="relative">
            <PhotoCard
              src={profileMainImage}
              alt="메인 프로필 사진"
              className="h-[300px] w-full"
              imageClassName="object-[center_0%]"
              overlayClassName="inset-x-0 bottom-0 h-[80px] opacity-80"
              overlayStyle={{
                background:
                  "linear-gradient(180deg, rgba(0, 0, 0, 0) 1.82%, #111111 99.43%)",
              }}
              sizes="(max-width: 375px) 100vw, 343px"
              priority
            />
            <Label
              variant="primary"
              className="absolute left-3 top-4 rounded-[20px] px-2 py-[3px]"
            >
              메인 프로필
            </Label>
            <button
              type="button"
              className="absolute bottom-4 right-4 flex items-center justify-center bg-transparent p-0"
              aria-label="메인 프로필 수정"
            >
              <IcoImgEdit className="h-9 w-9" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            {SUB_PROFILE_IMAGES.map((image) => (
              <PhotoCard
                key={image.alt}
                src={image.src}
                alt={image.alt}
                className="h-[85px] w-[81px] rounded-[8px]"
                sizes="81px"
              />
            ))}
            {Array.from({
              length: Math.max(
                SUB_PROFILE_SLOT_COUNT - SUB_PROFILE_IMAGES.length,
                0,
              ),
            }).map((_, index) => (
              <div
                key={`sub-profile-empty-${index}`}
                className={`${PLUS_TILE_CLASS} h-[85px] w-[81px] rounded-[8px]`}
              >
                <IcoPlus className="h-6 w-6" />
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <SectionTitle title="기본정보" />
          <div className="mt-4">
            {BASIC_INFO.map((item) => (
              <InfoRow key={item.label} {...item} />
            ))}
          </div>

          <Button
            variant="secondary"
            size="m"
            className="mt-8 w-full"
            leftIcon={<IcoVolume className="h-6 w-6 text-primary" />}
          >
            목소리 녹음하기
          </Button>
        </Section>

        <Section>
          <SectionTitle title="포토북 등록하기" showArrow />
          <div className="mt-4 flex gap-2">
            <PhotoCard
              src={profilePhotobook01Image}
              alt="포토북 사진 1"
              className="h-[120px] w-[109px] rounded-[8px]"
              sizes="109px"
            />
            <div
              className={`${PLUS_TILE_CLASS} h-[120px] w-[109px] rounded-[8px]`}
            >
              <IcoPlus className="h-6 w-6" />
            </div>
            <div
              className={`${PLUS_TILE_CLASS} h-[120px] w-[109px] rounded-[8px]`}
            >
              <IcoPlus className="h-6 w-6" />
            </div>
          </div>
        </Section>

        <Section>
          <SectionTitle title="나의 소개" showArrow />
          <div className="mt-4">
            <TextArea
              label="나를 한줄로 표현한다면?"
              disabled
              defaultValue="하나님의 말씀으로 하나님의 다음세대를 세우는 하나님의 동역자!"
              className="min-h-[164px]"
            />
          </div>
        </Section>

        <Section>
          <SectionTitle title="나의 매력 어필" showArrow />
          <TagPanel tags={CHARM_TAGS} />
        </Section>

        <Section>
          <SectionTitle title="나의 이상형" showArrow />
          <TagPanel tags={IDEAL_TAGS} />
        </Section>

        <Section>
          <SectionTitle title="라이프 스타일" showArrow />
          <TagPanel tags={LIFESTYLE_TAGS} minHeight="min-h-[184px]" />

          <Button size="m" className="mt-4 w-full">
            프로필 저장하기
          </Button>
        </Section>
      </div>
    </MobileLayout>
  );
}
