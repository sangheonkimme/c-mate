import { create } from "zustand";

import {
  DEFAULT_HEIGHT,
  DEFAULT_MARRIAGE_STATUS,
  DEFAULT_PROFILE_NAME,
} from "@/app/profile/edit/constants";

interface ProfileEditState {
  profileName: string;
  marriageStatus: string;
  height: string;
  setProfileName: (profileName: string) => void;
  setMarriageStatus: (marriageStatus: string) => void;
  setHeight: (height: string) => void;
}

export const useProfileEditStore = create<ProfileEditState>((set) => ({
  profileName: DEFAULT_PROFILE_NAME,
  marriageStatus: DEFAULT_MARRIAGE_STATUS,
  height: DEFAULT_HEIGHT,
  setProfileName: (profileName) => set({ profileName: profileName.trim() }),
  setMarriageStatus: (marriageStatus) => set({ marriageStatus }),
  setHeight: (height) => set({ height: height.trim() }),
}));
