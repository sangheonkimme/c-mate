"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import IcoImgEdit from "@/assets/icons/ico-img-edit.svg";
import IcoPlus from "@/assets/icons/ico-plus.svg";
import IcoVolume from "@/assets/icons/ico-volume.svg";
import {
  getBasicInfoItems,
  MAX_PHOTOBOOK_COUNT,
  PROFILE_USER_ID,
} from "@/app/profile/edit/constants";
import { useProfileEditStore } from "@/stores/profileEditStore";
import {
  Button,
  Label,
  MobileLayout,
  Section,
  SectionTitle,
  TextArea,
} from "@/components";
import {
  InfoRow,
  PhotoInputCard,
  TagPanel,
} from "@/app/profile/edit/_components";

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
const PHOTOBOOK_VISIBLE_SLOT_COUNT = 3;

export default function ProfileEditPage() {
  const router = useRouter();
  const hasLoadedProfile = useProfileEditStore(
    (state) => state.hasLoadedProfile,
  );
  const profileName = useProfileEditStore((state) => state.profileName);
  const marriageStatus = useProfileEditStore((state) => state.marriageStatus);
  const height = useProfileEditStore((state) => state.height);
  const mainProfilePhoto = useProfileEditStore(
    (state) => state.mainProfilePhoto,
  );
  const subProfilePhotos = useProfileEditStore(
    (state) => state.subProfilePhotos,
  );
  const photobookPhotos = useProfileEditStore((state) => state.photobookPhotos);
  const hydrateProfile = useProfileEditStore((state) => state.hydrateProfile);
  const setMainProfilePhoto = useProfileEditStore(
    (state) => state.setMainProfilePhoto,
  );
  const setSubProfilePhoto = useProfileEditStore(
    (state) => state.setSubProfilePhoto,
  );
  const replacePhotobookPhoto = useProfileEditStore(
    (state) => state.replacePhotobookPhoto,
  );
  const addPhotobookPhotos = useProfileEditStore(
    (state) => state.addPhotobookPhotos,
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState("");

  const basicInfoItems = getBasicInfoItems({
    profileName,
    marriageStatus,
    height,
  });

  const photobookAddTileCount =
    photobookPhotos.length < MAX_PHOTOBOOK_COUNT
      ? Math.max(PHOTOBOOK_VISIBLE_SLOT_COUNT - photobookPhotos.length, 1)
      : 0;

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    setSaveErrorMessage("");

    try {
      const formData = new FormData();

      formData.set("name", profileName);
      formData.set("marriageStatus", marriageStatus);
      formData.set("height", height);

      if (mainProfilePhoto.file) {
        formData.append("profileImage", mainProfilePhoto.file);
      }

      subProfilePhotos.forEach((photo) => {
        if (photo.file) {
          formData.append(`sub_${photo.slotNumber}`, photo.file);
        }
      });

      photobookPhotos.forEach((photo) => {
        if (photo.file) {
          formData.append(`photobook_${photo.slotNumber}`, photo.file);
        }
      });

      const response = await fetch(`/api/profile/${PROFILE_USER_ID}/save`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        throw new Error(errorPayload?.message ?? "프로필 저장에 실패했습니다.");
      }

      const profile = await response.json();
      hydrateProfile(profile);
      router.push("/?saved=1");
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      setSaveErrorMessage(
        error instanceof Error ? error.message : "프로필 저장에 실패했습니다.",
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  useEffect(() => {
    if (hasLoadedProfile) {
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      setIsLoadingProfile(true);

      try {
        const response = await fetch(`/api/profile/${PROFILE_USER_ID}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("프로필 정보를 불러오지 못했습니다.");
        }

        const profile = await response.json();

        if (!isMounted) {
          return;
        }

        console.log("[ProfileEditPage] fetched profile:", profile);
        hydrateProfile(profile);
        setSaveErrorMessage("");
      } catch (error) {
        console.error("프로필 조회 실패:", error);

        if (isMounted) {
          setSaveErrorMessage(
            "프로필 정보를 불러오지 못했습니다. 저장 후 다시 확인해주세요.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [hasLoadedProfile, hydrateProfile]);

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
          <PhotoInputCard
            src={mainProfilePhoto.src}
            alt={mainProfilePhoto.alt}
            className="h-[300px] w-full"
            imageClassName="object-[center_0%]"
            overlayClassName="inset-x-0 bottom-0 h-[80px] opacity-80"
            overlayStyle={{
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0) 1.82%, #111111 99.43%)",
            }}
            sizes="(max-width: 375px) 100vw, 343px"
            priority
            placeholder={<IcoPlus className="h-10 w-10" />}
            onSelectFiles={(files) => {
              const [file] = files;

              if (file) {
                setMainProfilePhoto(file);
              }
            }}
          >
            <Label
              variant="primary"
              className="absolute left-3 top-4 rounded-[20px] px-2 py-[3px]"
            >
              메인 프로필
            </Label>

            {mainProfilePhoto.src && (
              <span className="pointer-events-none absolute bottom-4 right-4">
                <IcoImgEdit className="h-9 w-9" />
              </span>
            )}
          </PhotoInputCard>

          <div className="mt-4 flex items-center justify-between">
            {subProfilePhotos.map((photo) => (
              <PhotoInputCard
                key={photo.slotNumber}
                src={photo.src}
                alt={photo.alt}
                className="h-[85px] w-[81px] rounded-[8px]"
                sizes="81px"
                placeholder={<IcoPlus className="h-6 w-6" />}
                onSelectFiles={(files) => {
                  const [file] = files;

                  if (file) {
                    setSubProfilePhoto(photo.slotNumber, file);
                  }
                }}
              />
            ))}
          </div>
        </Section>

        <Section>
          <SectionTitle title="기본정보" />
          <div className="mt-4">
            {basicInfoItems.map((item) => {
              const href = item.href;

              return (
                <InfoRow
                  key={item.label}
                  {...item}
                  onClick={href ? () => router.push(href) : undefined}
                />
              );
            })}
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
          <div className="mt-4 flex flex-wrap gap-2">
            {photobookPhotos.map((photo) => (
              <PhotoInputCard
                key={photo.id}
                src={photo.src}
                alt={photo.alt}
                className="h-[120px] w-[109px] rounded-[8px]"
                sizes="109px"
                placeholder={<IcoPlus className="h-6 w-6" />}
                onSelectFiles={(files) => {
                  const [file] = files;

                  if (file) {
                    replacePhotobookPhoto(photo.id, file);
                  }
                }}
              />
            ))}

            {Array.from({ length: photobookAddTileCount }).map((_, index) => (
              <PhotoInputCard
                key={`photobook-add-${photobookPhotos.length}-${index}`}
                alt="포토북 사진 추가"
                className="h-[120px] w-[109px] rounded-[8px]"
                sizes="109px"
                multiple
                placeholder={<IcoPlus className="h-6 w-6" />}
                onSelectFiles={addPhotobookPhotos}
              />
            ))}
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

          {saveErrorMessage && (
            <p className="mt-4 text-b3 text-sub-red">{saveErrorMessage}</p>
          )}

          <Button
            size="m"
            className="mt-4 w-full"
            onClick={handleSaveProfile}
            disabled={isSavingProfile || isLoadingProfile}
          >
            {isSavingProfile ? "저장 중..." : "프로필 저장하기"}
          </Button>
        </Section>
      </div>
    </MobileLayout>
  );
}
