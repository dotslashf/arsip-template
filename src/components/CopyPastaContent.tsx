import Link from "next/link";
import React from "react";
import { cn, trimContent } from "~/lib/utils";
import { buttonVariants } from "./ui/button";
import { ArrowRightIcon } from "./ui/icons";

interface CopyPastaContentProps {
  id: string;
  content: string;
  fullMode?: boolean;
}

function CopyPastaContent(props: CopyPastaContentProps) {
  return (
    <div className="flex flex-col gap-2">
      {props.content.length > 255 && !props.fullMode
        ? `"${trimContent(props.content)}"`
        : `"${props.content}"`}
      {!props.fullMode && (
        <Link
          href={`/copy-pasta/${props.id}`}
          className={cn(
            buttonVariants({ variant: "link", size: "url" }),
            "flex self-start",
          )}
          prefetch={false}
        >
          Lebih Lanjut <ArrowRightIcon className="ml-2 h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

export default CopyPastaContent;
