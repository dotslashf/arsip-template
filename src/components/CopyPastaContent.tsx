import Link from 'next/link';
import React from 'react';
import { trimContent, } from '~/lib/utils';
import { buttonVariants } from './ui/button';

interface CopyPastaContentProps {
    id: string;
    content: string;
}

function CopyPastaContent(props: CopyPastaContentProps) {
    return (
        <>
            {props.content.length > 255 ?
                (<span className='flex flex-col'>
                    "{trimContent(props.content)}"{
                        <span>
                            <Link href={`/copy-pasta/${props.id}`} className={buttonVariants({ variant: 'link', size: 'url' })}>Read More</Link>
                        </span>
                    }
                </span>)
                : `"${props.content}"`
            }
        </ >
    );
}

export default CopyPastaContent;