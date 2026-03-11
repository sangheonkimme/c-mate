"use client";

import { create } from "zustand";
import type { ProfileResponse } from "@/types/profile";

import {
  DEFAULT_HEIGHT,
  DEFAULT_MARRIAGE_STATUS,
  DEFAULT_PROFILE_NAME,
} from "@/features/profile-edit/constants";
import type {
  EditablePhoto,
  EditablePhotoSource,
  EditableProfile,
} from "@/features/profile-edit/types";
import {
  createMainProfilePhoto,
  createPhotobookPhotos,
  createSubProfilePhotos,
  formatHeightValue,
  normalizeMarriageStatus,
} from "@/features/profile-edit/utils/profileMapper";

interface ProfileEditState {
  hasLoadedProfile: boolean;
  profile: EditableProfile;
}

type ProfileUpdate =
  | Partial<EditableProfile>
  | ((profile: EditableProfile) => Partial<EditableProfile>);

interface ProfileEditActions {
  hydrateProfile: (profile: ProfileResponse) => void;
  setProfile: (update: ProfileUpdate) => void;
}

export type ProfileEditStore = ProfileEditState & {
  actions: ProfileEditActions;
};

const initialProfile: EditableProfile = {
  name: DEFAULT_PROFILE_NAME,
  marriageStatus: DEFAULT_MARRIAGE_STATUS,
  height: DEFAULT_HEIGHT,
  mainProfilePhoto: createMainProfilePhoto(),
  subProfilePhotos: createSubProfilePhotos(),
  photobookPhotos: createPhotobookPhotos(),
};

const initialState: ProfileEditState = {
  hasLoadedProfile: false,
  profile: initialProfile,
};

export const useProfileEditStore = create<ProfileEditStore>((set) => ({
  ...initialState,
  actions: {
    hydrateProfile: (profile) =>
      set((state) => {
        revokePhotoPreview(state.profile.mainProfilePhoto);
        revokePhotoCollection(state.profile.subProfilePhotos);
        revokePhotoCollection(state.profile.photobookPhotos);

        return {
          hasLoadedProfile: true,
          profile: {
            name: profile.name?.trim() || state.profile.name,
            marriageStatus: normalizeMarriageStatus(profile.marriage_status),
            height: formatHeightValue(profile.height),
            mainProfilePhoto: createMainProfilePhoto(
              profile.profile_image ?? null,
            ),
            subProfilePhotos: createSubProfilePhotos(profile.subImages),
            photobookPhotos: createPhotobookPhotos(profile.photobook),
          },
        };
      }),
    setProfile: (update) =>
      set((state) => {
        const nextProfilePatch =
          typeof update === "function" ? update(state.profile) : update;
        const nextProfile = {
          ...state.profile,
          ...nextProfilePatch,
        };

        if (
          nextProfilePatch.mainProfilePhoto &&
          !isSamePhotoValue(
            state.profile.mainProfilePhoto,
            nextProfile.mainProfilePhoto,
          )
        ) {
          revokePhotoPreview(state.profile.mainProfilePhoto);
        }

        if (nextProfilePatch.subProfilePhotos) {
          revokeChangedPhotoCollection(
            state.profile.subProfilePhotos,
            nextProfile.subProfilePhotos,
          );
        }

        if (nextProfilePatch.photobookPhotos) {
          revokeChangedPhotoCollection(
            state.profile.photobookPhotos,
            nextProfile.photobookPhotos,
          );
        }

        return {
          profile: nextProfile,
        };
      }),
  },
}));

const revokePhotoPreview = (photo: {
  src: EditablePhotoSource;
  file: File | null;
}) => {
  if (
    photo.file &&
    typeof photo.src === "string" &&
    photo.src.startsWith("blob:")
  ) {
    URL.revokeObjectURL(photo.src);
  }
};

const revokePhotoCollection = (
  photos: Array<{ src: EditablePhotoSource; file: File | null }>,
) => {
  photos.forEach(revokePhotoPreview);
};

const isSamePhotoValue = (
  currentPhoto: { src: EditablePhotoSource; file: File | null },
  nextPhoto: { src: EditablePhotoSource; file: File | null },
) => {
  return (
    currentPhoto.src === nextPhoto.src && currentPhoto.file === nextPhoto.file
  );
};

const revokeChangedPhotoCollection = (
  currentPhotos: EditablePhoto[],
  nextPhotos: EditablePhoto[],
) => {
  const nextPhotosBySlot = new Map(
    nextPhotos.map((photo) => [photo.slotNumber, photo] as const),
  );

  currentPhotos.forEach((currentPhoto) => {
    const nextPhoto = nextPhotosBySlot.get(currentPhoto.slotNumber);

    if (!nextPhoto || !isSamePhotoValue(currentPhoto, nextPhoto)) {
      revokePhotoPreview(currentPhoto);
    }
  });
};
