"use client"
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "./gtm";


export default function GTMPageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return null;
}
