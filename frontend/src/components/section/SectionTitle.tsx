import { ReactNode } from "react";

import IcoRight from "@/assets/icons/ico-right.svg";

interface SectionTitleProps {
  title: string;
  sub?: string | ReactNode;
  showArrow?: boolean;
  onMore?: () => void;
}

export default function SectionTitle({
  title,
  sub,
  showArrow = false,
  onMore,
}: SectionTitleProps) {
  const shouldShowArrow = showArrow || Boolean(onMore);

  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex items-center gap-2">
        <h2 className="text-H2 text-gray-black">{title}</h2>
        {sub && typeof sub === "string" ? <span className="text-b3 text-primary">{sub}</span> : sub}
      </div>

      {shouldShowArrow &&
        (onMore ? (
          <button
            type="button"
            onClick={onMore}
            className="flex items-center justify-center text-gray-3"
            aria-label="더보기"
          >
            <IcoRight className="shrink-0" />
          </button>
        ) : (
          <IcoRight className="shrink-0 text-gray-3" aria-hidden="true" />
        ))}
    </div>
  );
}
