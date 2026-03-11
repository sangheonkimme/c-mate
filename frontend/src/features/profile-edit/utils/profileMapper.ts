import type {
  EditablePhoto,
  EditablePhotoSource,
} from "@/features/profile-edit/types";
import type { ProfilePhotoResponse } from "@/types/profile";

import {
  DEFAULT_HEIGHT,
  DEFAULT_MARRIAGE_STATUS,
  MAX_PHOTOBOOK_COUNT,
  SUB_PROFILE_SLOT_COUNT,
} from "@/features/profile-edit/constants";

export const createMainProfilePhoto = (
  src: EditablePhotoSource = null,
): Omit<EditablePhoto, "slotNumber"> => ({
  id: "main-profile",
  alt: "메인 프로필 사진",
  src,
  file: null,
});

export const createSubProfilePhotos = (
  photos: ProfilePhotoResponse[] = [],
): EditablePhoto[] => {
  const photosBySlot = new Map<number, ProfilePhotoResponse>();

  photos.forEach((photo) => {
    if (!photo.slot_number) {
      return;
    }

    photosBySlot.set(photo.slot_number, photo);
  });

  return Array.from({ length: SUB_PROFILE_SLOT_COUNT }, (_, index) => {
    const slotNumber = index + 1;
    const photo = photosBySlot.get(slotNumber);

    return {
      id: photo?.id ?? `sub-${slotNumber}`,
      alt: `서브 프로필 사진 ${slotNumber}`,
      src: photo?.url ?? null,
      file: null,
      slotNumber,
    };
  });
};

export const createPhotobookPhotos = (
  photos: ProfilePhotoResponse[] = [],
): EditablePhoto[] => {
  return photos
    .filter(
      (photo): photo is ProfilePhotoResponse & { slot_number: number } => {
        return typeof photo.slot_number === "number";
      },
    )
    .sort((left, right) => left.slot_number - right.slot_number)
    .slice(0, MAX_PHOTOBOOK_COUNT)
    .map((photo, index) => ({
      id: photo.id ?? `photobook-${photo.slot_number ?? index + 1}`,
      alt: `포토북 사진 ${photo.slot_number ?? index + 1}`,
      src: photo.url,
      file: null,
      slotNumber: photo.slot_number ?? index + 1,
    }));
};

export const normalizeMarriageStatus = (marriageStatus?: string | null) => {
  if (marriageStatus === "미혼") {
    return "초혼";
  }

  if (marriageStatus === "기혼") {
    return "재혼";
  }

  return marriageStatus?.trim() || DEFAULT_MARRIAGE_STATUS;
};

export const formatHeightValue = (height?: number | string | null) => {
  if (typeof height === "number" && Number.isFinite(height)) {
    return `${height}cm`;
  }

  if (typeof height === "string") {
    const trimmedHeight = height.trim();

    if (!trimmedHeight) {
      return DEFAULT_HEIGHT;
    }

    return trimmedHeight.endsWith("cm") ? trimmedHeight : `${trimmedHeight}cm`;
  }

  return DEFAULT_HEIGHT;
};
