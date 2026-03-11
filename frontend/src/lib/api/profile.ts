import axios from "axios";
import type {
  MyPageSummary,
  ProfileResponse,
  SaveProfilePayload,
} from "@/types/profile";

import apiClient from "@/lib/api/client";

const parseErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    const errorMessage = error.response?.data as
      | { message?: string }
      | undefined;

    return errorMessage?.message ?? fallbackMessage;
  }

  return fallbackMessage;
};

export const fetchProfile = async (
  userId: number,
): Promise<ProfileResponse> => {
  try {
    const response = await apiClient.get<ProfileResponse>(
      `/api/profile/${userId}`,
    );

    return response.data;
  } catch (error) {
    throw new Error(
      parseErrorMessage(error, "프로필 정보를 불러오지 못했습니다."),
    );
  }
};

export const fetchMyPageSummary = async (
  userId: number,
): Promise<MyPageSummary> => {
  try {
    const response = await apiClient.get<MyPageSummary>(
      `/api/profile/${userId}/mypage`,
    );

    return response.data;
  } catch (error) {
    throw new Error(
      parseErrorMessage(error, "마이페이지 정보를 불러오지 못했습니다."),
    );
  }
};

export const saveProfile = async (
  userId: number,
  payload: SaveProfilePayload,
): Promise<ProfileResponse> => {
  const formData = new FormData();

  formData.set("name", payload.name);
  formData.set("marriageStatus", payload.marriageStatus);
  formData.set("height", payload.height);

  if (payload.mainProfileImageFile) {
    formData.append("profileImage", payload.mainProfileImageFile);
  }

  payload.subProfileFiles.forEach(({ slotNumber, file }) => {
    if (file) {
      formData.append(`sub_${slotNumber}`, file);
    }
  });

  payload.photobookFiles.forEach(({ slotNumber, file }) => {
    if (file) {
      formData.append(`photobook_${slotNumber}`, file);
    }
  });

  try {
    const response = await apiClient.post<ProfileResponse>(
      `/api/profile/${userId}/save`,
      formData,
    );

    return response.data;
  } catch (error) {
    throw new Error(parseErrorMessage(error, "프로필 저장에 실패했습니다."));
  }
};
