import { cn, trimContent } from "~/utils";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import Tag from "~/components/ui/tags";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "~/lib/track";
import { ANALYTICS_EVENT } from "~/lib/constant";

interface CardDisplayProps {
  id: string;
  content: string;
  tags: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}
export default function CardDisplay({ id, content, tags }: CardDisplayProps) {
  function handleMoreInfo() {
    void trackEvent(ANALYTICS_EVENT.VIEW_FULL_COPY_PASTA, {
      button: "more_info",
      value: `hero`,
      path: "/",
    });
  }
  return (
    <Card className="flex w-fit flex-col justify-between">
      <CardContent className="flex flex-col justify-between gap-2 overflow-x-hidden pb-2 pt-4 text-sm hover:cursor-auto">
        <blockquote className="w-full select-none border-l-4 pl-3 italic">
          &quot;{trimContent(content, 45)}&quot;
        </blockquote>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between">
          <div className="flex space-x-2">
            {tags.map((tag) => {
              return (
                <Tag
                  key={tag.id}
                  tagContent={tag}
                  className="rounded-sm shadow-sm hover:bg-primary hover:text-primary-foreground"
                  onClick={() => null}
                />
              );
            })}
          </div>
          <Link
            href={`/copy-pasta/${id}?utm_content=hero`}
            className={cn(
              buttonVariants({ variant: "link", size: "url" }),
              "ml-2",
            )}
            onClick={handleMoreInfo}
          >
            Lebih Lanjut <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
