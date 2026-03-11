import type { StaticImageData } from "next/image";

export type EditablePhotoSource = StaticImageData | string | null;

export interface EditablePhoto {
  id: string;
  alt: string;
  src: EditablePhotoSource;
  file: File | null;
  slotNumber: number;
}

export interface EditableProfile {
  name: string;
  marriageStatus: string;
  height: string;
  mainProfilePhoto: Omit<EditablePhoto, "slotNumber">;
  subProfilePhotos: EditablePhoto[];
  photobookPhotos: EditablePhoto[];
}
