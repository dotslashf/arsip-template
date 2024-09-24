import { type VariantProps } from "class-variance-authority";
import { Badge, type badgeVariants } from "./badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

interface HoverBadgeProps {
  badge: VariantProps<typeof badgeVariants>;
  children: JSX.Element | JSX.Element[] | string;
  buttonText: JSX.Element;
}
export default function HoverBadge({
  badge,
  buttonText,
  children,
}: HoverBadgeProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Badge variant={badge.variant} className="cursor-pointer">
          {buttonText}
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">{children}</HoverCardContent>
    </HoverCard>
  );
}
