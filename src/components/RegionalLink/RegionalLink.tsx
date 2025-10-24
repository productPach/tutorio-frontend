"use client";

import Link, { LinkProps } from "next/link";
import { ReactNode, useMemo } from "react";
import { useAppSelector } from "@/store/store";
import { UserRegion } from "@/types/types";

interface RegionalLinkProps extends LinkProps {
  children: ReactNode;
  seo?: boolean;
  citySlug?: string;
  target?: string;
  rel?: string;
  className?: string;
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
  target,
  rel,
  className,
  ...props
}: RegionalLinkProps) => {
  const regionUserRedux = useAppSelector((state) => state.auth.regionUser);

  const regionalHref = useMemo(() => {
    let path = typeof href === "string" ? href : href.toString();

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
    <Link
      href={regionalHref}
      target={target}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
};
