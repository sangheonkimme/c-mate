import { Label } from "@/components";

interface TagPanelProps {
  tags: string[];
  minHeight?: string;
}

const TagPanel = ({ tags, minHeight = "min-h-[176px]" }: TagPanelProps) => {
  return (
    <div className={`mt-4 rounded-[12px] border border-gray-4 bg-white px-3 py-4 ${minHeight}`}>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Label key={tag} variant="default">
            {tag}
          </Label>
        ))}
      </div>
    </div>
  );
};

export default TagPanel;
