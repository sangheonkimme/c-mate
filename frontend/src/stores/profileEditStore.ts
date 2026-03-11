"use client";

import { create } from "zustand";
import type { StaticImageData } from "next/image";

import {
  DEFAULT_HEIGHT,
  DEFAULT_MARRIAGE_STATUS,
  DEFAULT_PROFILE_NAME,
  MAX_PHOTOBOOK_COUNT,
  SUB_PROFILE_SLOT_COUNT,
} from "@/app/profile/edit/constants";

export type EditablePhotoSource = StaticImageData | string | null;

export interface EditablePhoto {
  id: string;
  alt: string;
  src: EditablePhotoSource;
  file: File | null;
  slotNumber: number;
}

type ProfilePhotoResponse = {
  id?: string;
  slot_number?: number | null;
  url: string;
};

type ProfileResponse = {
  name?: string | null;
  marriage_status?: string | null;
  height?: number | string | null;
  profile_image?: string | null;
  subImages?: ProfilePhotoResponse[];
  photobook?: ProfilePhotoResponse[];
};

interface ProfileEditState {
  hasLoadedProfile: boolean;
  profileName: string;
  marriageStatus: string;
  height: string;
  mainProfilePhoto: Omit<EditablePhoto, "slotNumber">;
  subProfilePhotos: EditablePhoto[];
  photobookPhotos: EditablePhoto[];
  hydrateProfile: (profile: ProfileResponse) => void;
  setProfileName: (profileName: string) => void;
  setMarriageStatus: (marriageStatus: string) => void;
  setHeight: (height: string) => void;
  setMainProfilePhoto: (file: File) => void;
  setSubProfilePhoto: (slotNumber: number, file: File) => void;
  replacePhotobookPhoto: (photoId: string, file: File) => void;
  addPhotobookPhotos: (files: File[]) => void;
}

const createMainProfilePhoto = (
  src: EditablePhotoSource = null,
): Omit<EditablePhoto, "slotNumber"> => ({
  id: "main-profile",
  alt: "메인 프로필 사진",
  src,
  file: null,
});

const createSubProfilePhotos = (
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

const createPhotobookPhotos = (
  photos: ProfilePhotoResponse[] = [],
): EditablePhoto[] => {
  return photos
    .filter((photo): photo is ProfilePhotoResponse & { slot_number: number } => {
      return typeof photo.slot_number === "number";
    })
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

const createObjectUrl = (file: File) => URL.createObjectURL(file);

const revokePhotoPreview = (photo: { src: EditablePhotoSource; file: File | null }) => {
  if (photo.file && typeof photo.src === "string" && photo.src.startsWith("blob:")) {
    URL.revokeObjectURL(photo.src);
  }
};

const revokePhotoCollection = (photos: Array<{ src: EditablePhotoSource; file: File | null }>) => {
  photos.forEach(revokePhotoPreview);
};

const replacePhotoWithFile = <T extends { src: EditablePhotoSource; file: File | null }>(
  photo: T,
  file: File,
): T => {
  revokePhotoPreview(photo);

  return {
    ...photo,
    src: createObjectUrl(file),
    file,
  };
};

const normalizeMarriageStatus = (marriageStatus?: string | null) => {
  if (marriageStatus === "미혼") {
    return "초혼";
  }

  if (marriageStatus === "기혼") {
    return "재혼";
  }

  return marriageStatus?.trim() || DEFAULT_MARRIAGE_STATUS;
};

const formatHeightValue = (height?: number | string | null) => {
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

const createPhotobookId = (slotNumber: number) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `photobook-${slotNumber}-${crypto.randomUUID()}`;
  }

  return `photobook-${slotNumber}-${Math.random().toString(36).slice(2, 10)}`;
};

export const useProfileEditStore = create<ProfileEditState>((set) => ({
  hasLoadedProfile: false,
  profileName: DEFAULT_PROFILE_NAME,
  marriageStatus: DEFAULT_MARRIAGE_STATUS,
  height: DEFAULT_HEIGHT,
  mainProfilePhoto: createMainProfilePhoto(),
  subProfilePhotos: createSubProfilePhotos(),
  photobookPhotos: createPhotobookPhotos(),
  hydrateProfile: (profile) =>
    set((state) => {
      revokePhotoPreview(state.mainProfilePhoto);
      revokePhotoCollection(state.subProfilePhotos);
      revokePhotoCollection(state.photobookPhotos);

      return {
        hasLoadedProfile: true,
        profileName: profile.name?.trim() || state.profileName,
        marriageStatus: normalizeMarriageStatus(profile.marriage_status),
        height: formatHeightValue(profile.height),
        mainProfilePhoto: createMainProfilePhoto(profile.profile_image ?? null),
        subProfilePhotos: createSubProfilePhotos(profile.subImages),
        photobookPhotos: createPhotobookPhotos(profile.photobook),
      };
    }),
  setProfileName: (profileName) => set({ profileName: profileName.trim() }),
  setMarriageStatus: (marriageStatus) => set({ marriageStatus }),
  setHeight: (height) => set({ height: height.trim() }),
  setMainProfilePhoto: (file) =>
    set((state) => ({
      mainProfilePhoto: replacePhotoWithFile(state.mainProfilePhoto, file),
    })),
  setSubProfilePhoto: (slotNumber, file) =>
    set((state) => ({
      subProfilePhotos: state.subProfilePhotos.map((photo) =>
        photo.slotNumber === slotNumber ? replacePhotoWithFile(photo, file) : photo,
      ),
    })),
  replacePhotobookPhoto: (photoId, file) =>
    set((state) => ({
      photobookPhotos: state.photobookPhotos.map((photo) =>
        photo.id === photoId ? replacePhotoWithFile(photo, file) : photo,
      ),
    })),
  addPhotobookPhotos: (files) =>
    set((state) => {
      const remainingSlotCount = Math.max(
        MAX_PHOTOBOOK_COUNT - state.photobookPhotos.length,
        0,
      );
      const nextFiles = files.slice(0, remainingSlotCount);

      if (nextFiles.length === 0) {
        return state;
      }

      let nextSlotNumber = state.photobookPhotos.reduce(
        (maxSlot, photo) => Math.max(maxSlot, photo.slotNumber),
        0,
      );

      const appendedPhotos = nextFiles.map((file) => {
        nextSlotNumber += 1;

        return {
          id: createPhotobookId(nextSlotNumber),
          alt: `포토북 사진 ${nextSlotNumber}`,
          src: createObjectUrl(file),
          file,
          slotNumber: nextSlotNumber,
        };
      });

      return {
        photobookPhotos: [...state.photobookPhotos, ...appendedPhotos],
      };
    }),
}));
