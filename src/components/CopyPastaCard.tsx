import { Card, CardContent } from "~/components/ui/card"
import Link from "next/link"
import { Badge } from "~/components/ui/badge"
import { CopyPasta } from "@prisma/client";
import { trimContent } from "~/lib/utils";
import CopyPastaContent from "./CopyPastaContent";

interface Tag {
    name: string
}

export interface CopyPastaCardWithTagsProps extends CopyPasta {
    tags: Tag[]
}


export default function CopyPastaCard(props: CopyPastaCardWithTagsProps) {
    return (
        <Card className="w-full h-full max-w-md shadow-sm text-justify">
            <CardContent className="p-6 h-full flex flex-col justify-between gap-4">
                <div className="text-sm text-primary">
                    {<CopyPastaContent content={props.content} id={props.id} />}
                </div>
                <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-4">
                    <span>Posted on {props.createdAt.toDateString()}</span>
                    <div className="flex w-full justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                            {props.tags.map(tag =>
                                <Badge variant={'secondary'} key={tag.name}>{tag.name}</Badge>
                            )}
                        </div>

                        <Link href="#" className="underline" prefetch={false}>
                            View source
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
