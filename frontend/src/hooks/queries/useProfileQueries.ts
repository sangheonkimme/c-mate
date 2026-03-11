"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchMyPageSummary,
  fetchProfile,
  saveProfile,
} from "@/lib/api/profile";
import type {
  MyPageSummary,
  ProfileResponse,
  SaveProfilePayload,
} from "@/types/profile";

export const profileQueryKeys = {
  all: ["profile"],
  detail: (userId: number) => [...profileQueryKeys.all, "detail", userId],
  myPage: (userId: number) => [...profileQueryKeys.all, "mypage", userId],
};

export const useProfileQuery = (userId: number, enabled = true) => {
  return useQuery<ProfileResponse>({
    queryKey: profileQueryKeys.detail(userId),
    queryFn: () => fetchProfile(userId),
    enabled,
  });
};

export const useMyPageSummaryQuery = (userId: number) => {
  return useQuery<MyPageSummary>({
    queryKey: profileQueryKeys.myPage(userId),
    queryFn: () => fetchMyPageSummary(userId),
  });
};

export const useSaveProfileMutation = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation<ProfileResponse, Error, SaveProfilePayload>({
    mutationFn: (payload) => saveProfile(userId, payload),
    onSuccess: async (profile) => {
      queryClient.setQueryData(profileQueryKeys.detail(userId), profile);

      await queryClient.invalidateQueries({
        queryKey: profileQueryKeys.detail(userId),
      });

      await queryClient.fetchQuery({
        queryKey: profileQueryKeys.myPage(userId),
        queryFn: () => fetchMyPageSummary(userId),
      });
    },
  });
};
