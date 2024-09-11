import Link from "next/link";
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

interface BreadCrumbsProps {
  path: BreadCrumbType[];
}
export default function BreadCrumbs({ path }: BreadCrumbsProps) {
  return (
    <Breadcrumb className="mb-6 lg:mb-8">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <BreadCrumbWithIcon text="home" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {path.map((p, i) => {
          return i !== path.length - 1 ? (
            <BreadcrumbItem key={i}>
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
