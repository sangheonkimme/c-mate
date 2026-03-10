import IcoRight from "@/assets/icons/ico-right.svg";

interface InfoRowProps {
  label: string;
  value: string;
  editable?: boolean;
  muted?: boolean;
}

const InfoRow = ({
  label,
  value,
  editable = true,
  muted = false,
}: InfoRowProps) => {
  return (
    <div className="flex h-14 items-center gap-3 border-b border-gray-4 py-4 last:border-b-0">
      <span className="w-20 shrink-0 text-b1 text-gray-2">{label}</span>
      <span className={`min-w-0 flex-1 text-B1 ${muted ? "text-gray-3" : "text-gray-black"}`}>
        {value}
      </span>
      {editable && <IcoRight className="shrink-0 text-gray-3" />}
    </div>
  );
};

export default InfoRow;
