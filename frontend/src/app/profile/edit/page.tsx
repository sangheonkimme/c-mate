"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

import IcoImgEdit from "@/assets/icons/ico-img-edit.svg";
import IcoPlus from "@/assets/icons/ico-plus.svg";
import IcoVolume from "@/assets/icons/ico-volume.svg";
import {
  getBasicInfoItems,
  MAX_PHOTOBOOK_COUNT,
  PROFILE_USER_ID,
} from "@/features/profile-edit/constants";
import { PROFILE_EDIT_PAGE_DATA } from "@/features/profile-edit/data";
import {
  createPreviewPhoto,
  createPreviewPhotobookPhotos,
} from "@/features/profile-edit/utils/photoPreview";
import {
  useProfileQuery,
  useSaveProfileMutation,
} from "@/hooks/queries/useProfileQueries";
import { useProfileEditStore } from "@/stores/profileEditStore";
import {
  Button,
  Label,
  MobileLayout,
  Section,
  SectionTitle,
  TextArea,
} from "@/components";
import { InfoRow, PhotoInputCard, TagPanel } from "@/components/profile-edit";

const MAIN_PROFILE_OVERLAY_STYLE = {
  background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 1.82%, #111111 99.43%)",
};
const {
  fetchErrorMessage: PROFILE_FETCH_ERROR_MESSAGE,
  photobookVisibleSlotCount: PHOTOBOOK_VISIBLE_SLOT_COUNT,
  profileIntroduction: PROFILE_INTRODUCTION,
  tagSections: TAG_SECTIONS,
} = PROFILE_EDIT_PAGE_DATA;

// 마이페이지 > 프로필 수정하기
export default function ProfileEditPage() {
  const router = useRouter();
  const {
    hasLoadedProfile,
    profile,
    actions: { hydrateProfile, setProfile },
  } = useProfileEditStore(
    useShallow((state) => ({
      hasLoadedProfile: state.hasLoadedProfile,
      profile: state.profile,
      actions: state.actions,
    })),
  );

  const {
    height,
    mainProfilePhoto,
    marriageStatus,
    name: profileName,
    photobookPhotos,
    subProfilePhotos,
  } = profile;

  const {
    data: fetchedProfile,
    isError: hasProfileError,
    isPending: isLoadingProfile,
  } = useProfileQuery(PROFILE_USER_ID, !hasLoadedProfile);

  const {
    error: saveProfileError,
    isError: hasSaveError,
    isPending: isSavingProfile,
    mutateAsync: saveProfile,
  } = useSaveProfileMutation(PROFILE_USER_ID);

  const basicInfoItems = getBasicInfoItems({
    profileName,
    marriageStatus,
    height,
  });

  const photobookAddTileCount =
    photobookPhotos.length < MAX_PHOTOBOOK_COUNT
      ? Math.max(PHOTOBOOK_VISIBLE_SLOT_COUNT - photobookPhotos.length, 1)
      : 0;

  const errorMessage = hasSaveError
    ? saveProfileError.message
    : hasProfileError
      ? PROFILE_FETCH_ERROR_MESSAGE
      : "";
  const isSaveDisabled =
    isSavingProfile || (!hasLoadedProfile && isLoadingProfile);

  // 프로필 수정 화면에서 마이페이지로 돌아간다.
  const handleBack = () => {
    router.push("/");
  };

  // 메인 프로필 사진을 새 파일 프리뷰로 교체한다.
  const handleMainProfileSelect = (files: File[]) => {
    const [file] = files;

    if (file) {
      setProfile((currentProfile) => ({
        mainProfilePhoto: createPreviewPhoto(
          currentProfile.mainProfilePhoto,
          file,
        ),
      }));
    }
  };

  // 선택한 서브 프로필 슬롯의 사진만 교체한다.
  const handleSubProfileSelect = (slotNumber: number) => (files: File[]) => {
    const [file] = files;

    if (file) {
      setProfile((currentProfile) => ({
        subProfilePhotos: currentProfile.subProfilePhotos.map((photo) =>
          photo.slotNumber === slotNumber
            ? createPreviewPhoto(photo, file)
            : photo,
        ),
      }));
    }
  };

  // 기존 포토북 사진 한 장을 새 파일로 교체한다.
  const handlePhotobookReplace = (photoId: string) => (files: File[]) => {
    const [file] = files;

    if (file) {
      setProfile((currentProfile) => ({
        photobookPhotos: currentProfile.photobookPhotos.map((photo) =>
          photo.id === photoId ? createPreviewPhoto(photo, file) : photo,
        ),
      }));
    }
  };

  // 남은 포토북 슬롯에 여러 장의 사진을 순서대로 추가한다.
  const handlePhotobookAdd = (files: File[]) => {
    setProfile((currentProfile) => ({
      photobookPhotos: createPreviewPhotobookPhotos(
        currentProfile.photobookPhotos,
        files,
      ),
    }));
  };

  // 기본정보 상세 수정 페이지로 이동한다.
  const handleBasicInfoClick = (href: string) => () => {
    router.push(href);
  };

  // 현재 편집 중인 프로필 값을 서버에 저장한다.
  const handleSaveProfile = async () => {
    try {
      const savedProfile = await saveProfile({
        name: profileName,
        marriageStatus,
        height,
        mainProfileImageFile: mainProfilePhoto.file,
        subProfileFiles: subProfilePhotos.map((photo) => ({
          slotNumber: photo.slotNumber,
          file: photo.file,
        })),
        photobookFiles: photobookPhotos.map((photo) => ({
          slotNumber: photo.slotNumber,
          file: photo.file,
        })),
      });

      hydrateProfile(savedProfile);
      router.push(`/?saved=${savedProfile.id ?? PROFILE_USER_ID}`);
    } catch (error) {
      console.error("프로필 저장 실패:", error);
    }
  };

  useEffect(() => {
    if (!fetchedProfile || hasLoadedProfile) return;
    hydrateProfile(fetchedProfile);
  }, [fetchedProfile, hasLoadedProfile, hydrateProfile]);

  return (
    <MobileLayout
      title="프로필 수정하기"
      activeTab="mypage"
      onBack={handleBack}
      showNav={true}
      showTabBar={true}
      mainClassName="bg-white"
    >
      <div className="bg-gray-6 pt-4">
        <div className="flex flex-col gap-4">
          <Section>
            <PhotoInputCard
              src={mainProfilePhoto.src}
              alt={mainProfilePhoto.alt}
              className="h-[300px] w-full"
              imageClassName="object-[center_0%]"
              overlayClassName="inset-x-0 bottom-0 h-[80px] opacity-80"
              overlayStyle={MAIN_PROFILE_OVERLAY_STYLE}
              sizes="(max-width: 375px) 100vw, 343px"
              priority
              placeholder={<IcoPlus className="h-10 w-10" />}
              onSelectFiles={handleMainProfileSelect}
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
                  onSelectFiles={handleSubProfileSelect(photo.slotNumber)}
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
                    onClick={href ? handleBasicInfoClick(href) : undefined}
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
                  onSelectFiles={handlePhotobookReplace(photo.id)}
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
                  onSelectFiles={handlePhotobookAdd}
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
                defaultValue={PROFILE_INTRODUCTION}
                className="min-h-[164px]"
              />
            </div>
          </Section>

          {TAG_SECTIONS.map(({ title, tags, minHeight }) => (
            <Section key={title}>
              <SectionTitle title={title} showArrow />
              <TagPanel tags={tags} minHeight={minHeight} />
            </Section>
          ))}
        </div>

        <div className="bg-white px-4 py-4">
          {errorMessage && <p className="text-b3 text-sub-red">{errorMessage}</p>}

          <Button
            size="m"
            className={`${errorMessage ? "mt-4 " : ""}w-full`}
            onClick={handleSaveProfile}
            disabled={isSaveDisabled}
          >
            {isSavingProfile ? "저장 중..." : "프로필 저장하기"}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
