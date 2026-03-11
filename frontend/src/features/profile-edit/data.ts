type ProfileTagSection = {
  title: string;
  tags: string[];
  minHeight?: string;
};

type ProfileEditPageData = {
  profileIntroduction: string;
  fetchErrorMessage: string;
  photobookVisibleSlotCount: number;
  tagSections: ProfileTagSection[];
};

export const PROFILE_EDIT_PAGE_DATA: ProfileEditPageData = {
  profileIntroduction:
    "하나님의 말씀으로 하나님의 다음세대를 세우는 하나님의 동역자!",
  fetchErrorMessage:
    "프로필 정보를 불러오지 못했습니다. 저장 후 다시 확인해주세요.",
  photobookVisibleSlotCount: 3,
  tagSections: [
    {
      title: "나의 매력 어필",
      tags: [
        "선함",
        "긍정적인 마인드",
        "건강미",
        "키큰",
        "뚜렷한 이목구비",
        "부드러운",
      ],
    },
    {
      title: "나의 이상형",
      tags: [
        "슬림 탄탄한",
        "절실한 신앙심",
        "동갑,연상",
        "180 이상",
        "유머러스함",
        "섬세함",
      ],
    },
    {
      title: "라이프 스타일",
      tags: [
        "💃 라틴댄스",
        "👯 현대무용",
        "✝️ 신앙서적",
        "🎥 유튜브",
        "✈️ 해외 여행",
        "👟 러닝",
        "🏋️ 헬스",
        "🎶 찬양/CCM",
      ],
      minHeight: "min-h-[184px]",
    },
  ],
};
