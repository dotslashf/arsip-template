import React from "react"
import { cn } from "~/lib/utils";

interface IconsWrapperProps {
    children: React.ReactNode;
    className?: string
}

interface IconProps {
    className?: string;
}

export function IconsWrapper({ children, className }: IconsWrapperProps) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={cn("w-4 h-4", className)}>
        {children}
    </svg >)
}

export function SearchIcon(props: IconProps) {
    return (
        <IconsWrapper className={props.className}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </IconsWrapper>
    )
}

export function LinkIcon(props: IconProps) {
    return (
        <IconsWrapper className={props.className}>
            <path d="M9 17H7A5 5 0 0 1 7 7h2" /><path d="M15 7h2a5 5 0 1 1 0 10h-2" /><line x1="8" x2="16" y1="12" y2="12" />
        </IconsWrapper>
    )
}

export function ArrowDownIcon(props: IconProps) {
    return (
        <IconsWrapper className={props.className}>
            <path d="M12 5v14" /><path d="m19 12-7 7-7-7" />
        </IconsWrapper>
    )
}

export function LoaderCircleIcon(props: IconProps) {
    return (
        <IconsWrapper className={props.className}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </IconsWrapper>
    )
}

export function SkullIcon(props: IconProps) {
    return (
        <IconsWrapper className={props.className}>
            <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><path d="M8 20v2h8v-2" /><path d="m12.5 17-.5-1-.5 1h1z" /><path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20" />
        </IconsWrapper>
    )
}