"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import IcoCancelCircle from "@/assets/icons/ico-cancel-circle.svg";
import { BasicInfoEditLayout } from "@/components/profile-edit";
import { Button, TextField } from "@/components";
import { useProfileEditStore } from "@/stores/profileEditStore";

const HeightEditPage = () => {
  const router = useRouter();
  const savedHeight = useProfileEditStore((state) => state.profile.height);
  const { setProfile } = useProfileEditStore((state) => state.actions);
  const [height, setHeightDraft] = useState(savedHeight);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setHeightDraft(savedHeight);
  }, [savedHeight]);

  const trimmedHeight = height.trim();
  const isChanged = trimmedHeight.length > 0 && trimmedHeight !== savedHeight;
  const heightTextColor =
    !isFocused && trimmedHeight === savedHeight
      ? "text-gray-3"
      : "text-gray-black";

  const inputClassName = useMemo(
    () =>
      [
        "h-12 w-full rounded-[12px] border border-gray-4 bg-white px-5 pr-12 text-b1 leading-6 outline-none transition-colors",
        "hover:border-gray-2 focus:border-gray-2",
        heightTextColor,
      ].join(" "),
    [heightTextColor],
  );

  const handleComplete = () => {
    if (!isChanged) return;
    setProfile({ height: trimmedHeight });
    router.push("/profile/edit");
  };

  return (
    <BasicInfoEditLayout
      heading="키(신장)을 입력해주세요"
      onBack={() => router.push("/profile/edit")}
      footer={
        <Button
          size="m"
          className="w-full"
          disabled={!isChanged}
          onClick={handleComplete}
        >
          완료
        </Button>
      }
    >
      <TextField
        type="text"
        value={height}
        onChange={(event) => setHeightDraft(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={inputClassName}
        aria-label="신장 입력"
        rightAdornment={
          isFocused && height ? (
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setHeightDraft("")}
              className="flex h-6 w-6 items-center justify-center"
              aria-label="신장 지우기"
            >
              <IcoCancelCircle className="h-6 w-6" />
            </button>
          ) : null
        }
      />
    </BasicInfoEditLayout>
  );
};

export default HeightEditPage;
