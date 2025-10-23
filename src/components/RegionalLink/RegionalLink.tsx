"use client";

import Link, { LinkProps } from "next/link";
import { ReactNode, useMemo } from "react";
import { useAppSelector } from "@/store/store";
import { UserRegion } from "@/types/types";

interface RegionalLinkProps extends LinkProps {
  children: ReactNode;
  seo?: boolean; // добавлять региональный префикс
  citySlug?: string; // если передан явно (SSR)
}

const getRegionFromLocalStorage = (): UserRegion | null => {
  if (typeof window === "undefined") return null;
  const regionLS = localStorage.getItem("region-user");
  if (!regionLS) return null;
  try {
    return JSON.parse(regionLS) as UserRegion;
  } catch {
    return null;
  }
};

export const RegionalLink = ({
  href,
  seo = true,
  children,
  citySlug,
  ...props
}: RegionalLinkProps) => {
  const regionUserRedux = useAppSelector((state) => state.auth.regionUser);

  const regionalHref = useMemo(() => {
    let path = typeof href === "string" ? href : href.toString();

    // console.log(`слаг из хедер = ` + regionUserRedux?.slug);

    // приоритет: переданный Redux > citySlug > localStorage > Москва
    const city =
      regionUserRedux?.slug ||
      citySlug ||
      getRegionFromLocalStorage()?.slug ||
      "msk";

    if (seo && city !== "msk") {
      const hasPrefix = path.startsWith(`/${city}/`) || path === `/${city}`;
      if (!hasPrefix) {
        path = path.startsWith("/") ? `/${city}${path}` : `/${city}/${path}`;
      }
    }

    return path;
  }, [href, regionUserRedux, citySlug, seo]);

  return (
    <Link href={regionalHref} {...props}>
      {children}
    </Link>
  );
};
