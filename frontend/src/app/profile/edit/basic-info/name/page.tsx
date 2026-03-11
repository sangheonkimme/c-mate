"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import IcoCancelCircle from "@/assets/icons/ico-cancel-circle.svg";
import { BasicInfoEditLayout } from "@/components/profile-edit";
import { Button, TextField } from "@/components";
import { useProfileEditStore } from "@/stores/profileEditStore";

const NameEditPage = () => {
  const router = useRouter();
  const savedName = useProfileEditStore((state) => state.profile.name);
  const { setProfile } = useProfileEditStore((state) => state.actions);
  const [name, setName] = useState(savedName);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setName(savedName);
  }, [savedName]);

  const trimmedName = name.trim();
  const isChanged = trimmedName.length > 0 && trimmedName !== savedName;
  const nameTextColor = !isFocused && trimmedName === savedName ? "text-gray-3" : "text-gray-black";

  const inputClassName = useMemo(
    () =>
      [
        "h-12 w-full rounded-[12px] border border-gray-4 bg-white px-5 pr-12 text-b1 leading-6 outline-none transition-colors",
        "hover:border-gray-2 focus:border-gray-2",
        nameTextColor,
      ].join(" "),
    [nameTextColor],
  );

  const handleComplete = () => {
    if (!isChanged) {
      return;
    }

    setProfile({ name: trimmedName });
    router.push("/profile/edit");
  };

  return (
    <BasicInfoEditLayout
      heading="이름을 변경하시겠어요?"
      description="이름은 언제든지 수정할 수 있습니다"
      onBack={() => router.push("/profile/edit")}
      footer={
        <Button size="m" className="w-full" disabled={!isChanged} onClick={handleComplete}>
          완료
        </Button>
      }
    >
      <TextField
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={inputClassName}
        aria-label="이름 입력"
        rightAdornment={
          isFocused && name ? (
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setName("")}
              className="flex h-6 w-6 items-center justify-center"
              aria-label="이름 지우기"
            >
              <IcoCancelCircle className="h-6 w-6" />
            </button>
          ) : null
        }
      />
    </BasicInfoEditLayout>
  );
};

export default NameEditPage;
