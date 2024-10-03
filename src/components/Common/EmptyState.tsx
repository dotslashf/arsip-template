import { type ReactElement, type HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  message?: string | ReactElement;
  action?: ReactElement;
}
export default function EmptyState({
  message,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex h-32 w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed bg-secondary text-sm",
        props.className,
      )}
    >
      {message}
      {action}
    </div>
  );
}
