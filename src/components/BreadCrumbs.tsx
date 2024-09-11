import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { type Breadcrumb as BreadCrumbType } from "~/lib/interface";
import BreadCrumbWithIcon from "./ui/breadcrumb-with-icon";
import { trackEvent } from "~/lib/track";
import { ANALYTICS_EVENT } from "~/lib/constant";

interface BreadCrumbsProps {
  path: BreadCrumbType[];
}
export default function BreadCrumbs({ path }: BreadCrumbsProps) {
  function handleTrack(path: string) {
    void trackEvent(ANALYTICS_EVENT.BREADCRUMB_CLICKED, {
      path,
    });
  }

  return (
    <Breadcrumb className="mb-6 lg:mb-8">
      <BreadcrumbList>
        <BreadcrumbItem onClick={() => handleTrack("/")}>
          <BreadcrumbLink href="/">
            <BreadCrumbWithIcon text="home" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {path.map((p, i) => {
          return i !== path.length - 1 ? (
            <BreadcrumbItem key={i} onClick={() => handleTrack(p.url)}>
              <BreadcrumbLink href={p.url}>
                <BreadCrumbWithIcon text={p.text} />
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem key={i}>
              <BreadcrumbPage>
                <BreadCrumbWithIcon text={p.text} />
              </BreadcrumbPage>
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
