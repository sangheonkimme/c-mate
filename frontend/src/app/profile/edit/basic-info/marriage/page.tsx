"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BasicInfoEditLayout } from "@/components/profile-edit";
import { Button, RadioButton } from "@/components";
import { MARRIAGE_OPTIONS } from "@/features/profile-edit/constants";
import { useProfileEditStore } from "@/stores/profileEditStore";

const MarriageEditPage = () => {
  const router = useRouter();
  const marriage = useProfileEditStore((state) => state.profile.marriageStatus);
  const { setProfile } = useProfileEditStore((state) => state.actions);
  const [selectedMarriage, setSelectedMarriage] = useState(marriage);

  const handleComplete = () => {
    if (!selectedMarriage) return;
    setProfile({ marriageStatus: selectedMarriage });
    router.push("/profile/edit");
  };

  useEffect(() => {
    setSelectedMarriage(marriage);
  }, [marriage]);

  return (
    <BasicInfoEditLayout
      heading="결혼여부를 선택해주세요"
      notice={
        <div className="space-y-1 text-b2 text-sub-red">
          <p>미혼인 경우 초혼을 선택해주세요.</p>
          <p>허위 기재시 민/형사상의 책임을 물으시게 됩니다.</p>
        </div>
      }
      onBack={() => router.push("/profile/edit")}
      footer={
        <Button
          size="m"
          className="w-full"
          disabled={!selectedMarriage}
          onClick={handleComplete}
        >
          완료
        </Button>
      }
    >
      <div className="space-y-2">
        {MARRIAGE_OPTIONS.map((option) => {
          const isSelected = selectedMarriage === option;

          return (
            <RadioButton
              key={option}
              name="marriage-status"
              value={option}
              label={option}
              checked={isSelected}
              onChange={() => setSelectedMarriage(option)}
              className={`h-12 w-full flex-row-reverse justify-between gap-0 rounded-[12px] border px-5 transition-colors ${
                isSelected ? "border-primary" : "border-gray-4"
              }`}
            />
          );
        })}
      </div>
    </BasicInfoEditLayout>
  );
};

export default MarriageEditPage;
