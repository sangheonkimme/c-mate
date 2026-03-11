import type { StaticImageData } from "next/image";

import { MAX_PHOTOBOOK_COUNT } from "@/features/profile-edit/constants";

type PreviewPhotoSource = StaticImageData | string | null;

type PreviewablePhoto = {
  src: PreviewPhotoSource;
  file: File | null;
};

type SlottedPreviewPhoto = PreviewablePhoto & {
  id: string;
  alt: string;
  slotNumber: number;
};

const createObjectUrl = (file: File) => URL.createObjectURL(file);

const createPhotobookId = (slotNumber: number) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `photobook-${slotNumber}-${crypto.randomUUID()}`;
  }

  return `photobook-${slotNumber}-${Math.random().toString(36).slice(2, 10)}`;
};

export const createPreviewPhoto = <T extends PreviewablePhoto>(
  photo: T,
  file: File,
): T => ({
  ...photo,
  src: createObjectUrl(file),
  file,
});

export const createPreviewPhotobookPhotos = (
  currentPhotos: SlottedPreviewPhoto[],
  files: File[],
) => {
  const remainingSlotCount = Math.max(
    MAX_PHOTOBOOK_COUNT - currentPhotos.length,
    0,
  );
  const nextFiles = files.slice(0, remainingSlotCount);

  if (nextFiles.length === 0) {
    return currentPhotos;
  }

  let nextSlotNumber = currentPhotos.reduce(
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

  return [...currentPhotos, ...appendedPhotos];
};
