export type BasicInfoItem = {
  label: string;
  value: string;
  editable?: boolean;
  muted?: boolean;
  href?: string;
};

export const DEFAULT_PROFILE_NAME = "임승리";
export const DEFAULT_MARRIAGE_STATUS = "초혼";
export const DEFAULT_HEIGHT = "170cm";
export const PROFILE_EDIT_NAME_PATH = "/profile/edit/basic-info/name";
export const PROFILE_EDIT_MARRIAGE_PATH = "/profile/edit/basic-info/marriage";
export const PROFILE_EDIT_HEIGHT_PATH = "/profile/edit/basic-info/height";
export const MARRIAGE_OPTIONS = ["초혼", "재혼", "사실혼"] as const;

const BASIC_INFO_TEMPLATE: Omit<BasicInfoItem, "value">[] = [
  { label: "성별", editable: false, muted: true },
  { label: "나이", editable: false, muted: true },
  { label: "나의 체형" },
  { label: "거주 지역" },
  { label: "최종학력" },
  { label: "학교/전공" },
  { label: "직장명/직무" },
  { label: "연봉" },
  { label: "출석 교회명" },
  { label: "모태신앙" },
  { label: "음주 여부" },
  { label: "흡연 여부" },
];

const BASIC_INFO_VALUES: Record<string, string> = {
  성별: "여성",
  나이: "89년생",
  "나의 체형": "조금 통통",
  "거주 지역": "서울",
  최종학력: "대졸",
  "학교/전공": "총신대학교 / 신학과",
  "직장명/직무": "크리스천 메이트 / 커플 매니저",
  연봉: "3000~4000만원",
  "출석 교회명": "창신교회",
  모태신앙: "그렇다",
  "음주 여부": "아예 하지 않습니다",
  "흡연 여부": "비흡연",
};

export const getBasicInfoItems = ({
  profileName,
  marriageStatus,
  height,
}: {
  profileName: string;
  marriageStatus: string;
  height: string;
}): BasicInfoItem[] => {
  return [
    {
      label: "이름",
      value: profileName,
      href: PROFILE_EDIT_NAME_PATH,
    },
    {
      label: "결혼경험",
      value: marriageStatus,
      href: PROFILE_EDIT_MARRIAGE_PATH,
    },
    {
      label: "신장",
      value: height,
      href: PROFILE_EDIT_HEIGHT_PATH,
    },
    ...BASIC_INFO_TEMPLATE.map((item) => ({
      ...item,
      value: BASIC_INFO_VALUES[item.label],
    })),
  ];
};
