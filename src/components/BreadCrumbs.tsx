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
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href={"/"}>
              <BreadCrumbWithIcon text="home" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {path.map((p, i) => {
          return i !== path.length - 1 ? (
            <>
              <BreadcrumbItem key={i}>
                <BreadcrumbLink>
                  <Link href={p.url}>
                    <BreadCrumbWithIcon text={p.text} />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage>{p.text}</BreadcrumbPage>
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
