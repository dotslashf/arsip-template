import { type HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
}
export default function EmptyState({ message, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex h-32 w-full items-center justify-center rounded-md border border-dashed bg-secondary text-sm",
        { ...props },
      )}
    >
      {message}
    </div>
  );
}
