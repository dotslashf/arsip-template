import { Card, CardContent } from "~/components/ui/card"
import Link from "next/link"
import { badgeVariants } from "~/components/ui/badge"
import { CopyPasta, CopyPastasOnTags, Tag } from "@prisma/client";
import { cn } from "~/lib/utils";
import CopyPastaContent from "./CopyPastaContent";
import { buttonVariants } from "./ui/button";
import { LinkIcon } from "./ui/icons";

export interface CopyPastaCardWithTagsProps extends CopyPasta {
    tags: Tag[]
}

interface CopyPastaProps {
    copyPastaProps: CopyPastaCardWithTagsProps;
}

export default function CopyPastaCard({ copyPastaProps }: CopyPastaProps) {
    return (
        <Card className="w-full h-full lg:max-w-md shadow-sm text-justify">
            <CardContent className="p-6 h-full flex flex-col justify-between gap-4">
                <div className="text-sm text-primary">
                    {<CopyPastaContent content={copyPastaProps.content} id={copyPastaProps.id} />}
                </div>
                <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-4">
                    <span>Posted on {copyPastaProps.createdAt.toDateString()}</span>
                    {copyPastaProps.tags.length || copyPastaProps.sourceUrl ?
                        <div className="flex w-full items-center justify-between relative">
                            {copyPastaProps.tags.length ? <div className="flex flex-wrap gap-2">
                                {copyPastaProps.tags.map(tag =>
                                    <Link href={`/?tag=${tag.id}`} key={tag.id} className={badgeVariants({ variant: "default" })} prefetch={false}>
                                        {tag.name}
                                    </Link>
                                )}
                            </div>
                                : null
                            }
                            {
                                copyPastaProps.sourceUrl ?
                                    <div className="absolute right-0">
                                        <Link href={copyPastaProps.sourceUrl} className={cn(buttonVariants({ variant: "link", size: "url" }))} prefetch={false}>
                                            Cek Doksli <LinkIcon className="ml-2 w-3 h-3" />
                                        </Link>
                                    </div> : null
                            }
                        </div> : null}
                </div>
            </CardContent>
        </Card>
    )
}
