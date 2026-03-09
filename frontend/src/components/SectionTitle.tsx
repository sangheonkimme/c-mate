import { ReactNode } from "react";

interface SectionTitleProps {
  title: string;
  /** 오른쪽 보조 텍스트 또는 요소 */
  sub?: string | ReactNode;
  /** 화살표 클릭 시 (없으면 화살표 미표시) */
  onMore?: () => void;
}

export default function SectionTitle({ title, sub, onMore }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-baseline gap-2">
        <h2 className="text-b1-bold font-bold text-neutral-dark">{title}</h2>
        {sub && typeof sub === "string" ? (
          <span className="text-b3 text-primary">{sub}</span>
        ) : (
          sub
        )}
      </div>

      {onMore && (
        <button
          type="button"
          onClick={onMore}
          className="flex h-6 w-6 items-center justify-center text-neutral-light"
          aria-label="더보기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}
    </div>
  );
}
