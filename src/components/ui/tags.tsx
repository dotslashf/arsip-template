import { cn } from "~/lib/utils";
import { Badge } from "./badge";
import { type Tag as TagType } from "@prisma/client";
import { Hash } from "lucide-react";

interface TagProps {
  tagContent: TagType;
  active?: boolean;
  className?: string;
  onClick: (tag: TagType) => void;
}
export default function Tag(props: TagProps) {
  return (
    <Badge
      onClick={() => props.onClick(props.tagContent)}
      className={cn(props.className)}
      variant={props.active ? "default" : "outline"}
    >
      <Hash className="h-3 w-3" />
      {props.tagContent.name}
    </Badge>
  );
}
