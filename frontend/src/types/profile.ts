export type ProfilePhotoResponse = {
  id?: string;
  profile_id?: number;
  type?: "sub" | "photobook";
  slot_number?: number | null;
  url: string;
  created_at?: string;
};

export type ProfileResponse = {
  id?: number;
  name?: string | null;
  marriage_status?: string | null;
  height?: number | string | null;
  profile_image?: string | null;
  created_at?: string;
  updated_at?: string;
  subImages?: ProfilePhotoResponse[];
  photobook?: ProfilePhotoResponse[];
};

export type MyPageSummary = {
  id: number;
  name: string;
  age: number;
  location: string;
  marriageStatus: string;
  religion: string;
  job: string;
  completionRate: number;
  profileImage: string | null;
};

export type SaveProfilePayload = {
  name: string;
  marriageStatus: string;
  height: string;
  mainProfileImageFile?: File | null;
  subProfileFiles: Array<{
    slotNumber: number;
    file: File | null;
  }>;
  photobookFiles: Array<{
    slotNumber: number;
    file: File | null;
  }>;
};
