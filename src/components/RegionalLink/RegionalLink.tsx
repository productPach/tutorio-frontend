"use client";

import Link, { LinkProps } from "next/link";
import { ReactNode, useMemo } from "react";
import { useAppSelector } from "@/store/store";
import { UserRegion } from "@/types/types";

interface RegionalLinkProps extends LinkProps {
  children: ReactNode;
  seo?: boolean; // если true — добавляем региональный префикс
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
  ...props
}: RegionalLinkProps) => {
  const regionUserRedux = useAppSelector((state) => state.auth.regionUser);

  const regionalHref = useMemo(() => {
    let path = typeof href === "string" ? href : href.toString();

    // ✅ Берём регион из Redux, если нет — из localStorage
    const regionUser = regionUserRedux || getRegionFromLocalStorage();
    const citySlug = regionUser?.slug || "msk"; // используем slug из UserRegion

    // ✅ Если SEO и регион не Москва
    if (seo && citySlug !== "msk") {
      // Добавляем префикс, если его ещё нет
      const hasPrefix =
        path.startsWith(`/${citySlug}/`) || path === `/${citySlug}`;
      if (!hasPrefix) {
        if (path.startsWith("/")) {
          path = `/${citySlug}${path}`;
        } else {
          path = `/${citySlug}/${path}`;
        }
      }
    }

    return path;
  }, [href, regionUserRedux, seo]);

  return (
    <Link href={regionalHref} {...props}>
      {children}
    </Link>
  );
};
