"use client";

import { useState, useEffect } from "react";
import { BackendNavbar } from "./_components/shared/BackendNavbar";
import Sidebar from "./_components/shared/Sidebar";
import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

// 🏷 Helper: map pathname to page title
const getPageTitle = (pathname: string) => {
  const map: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/dashboard": "Dashboard",
    "/admin/products": "Products",
    "/admin/products/new": "Add Product",
    "/admin/categories": "Categories",
    "/admin/orders": "Orders",
    "/admin/customers": "Customers",
    "/admin/reviews": "Reviews",
    "/admin/coupons": "Coupons",
    "/admin/shipping": "Shipping",
    "/admin/returns": "Returns",
    "/admin/pages": "Pages",
    "/admin/settings": "Settings",
    "/admin/profile": "My Profile",
    "/admin/reports": "Reports",
    "/admin/analytics": "Analytics",
    "/admin/support": "Support",
    "/admin/notifications": "Notifications",
  };

  if (pathname.startsWith("/admin/products/")) return "Edit Product";
  if (pathname.startsWith("/admin/orders/")) return "Order Details";

  return map[pathname] || "Admin";
};

export default function BackendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // 🪄 Update title on route change
  useEffect(() => {
    const pageTitle = getPageTitle(pathname);
    document.title = `BabyToysBD | ${pageTitle}`;
  }, [pathname]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session)
    return (
      <button onClick={() => signIn()} className="btn">
        Sign In
      </button>
    );

  const handleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <main className="min-h-screen dark:bg-[#0D1117] dark:text-white">
      <div className="flex">
        {session?.user?.role && (
          <Sidebar
            role={session.user.role}
            collapsed={collapsed}
            toggleCollapse={handleCollapsed}
          />
        )}

        <div className="w-full">
          <main
            className={`${
              collapsed ? "ml-0" : "md:ml-[256px] ml-0"
            } transition-all duration-1000 flex-1 flex flex-col`}
          >
            <BackendNavbar handleCollapsed={handleCollapsed} />
            <div className="p-4">{children}</div>
          </main>
        </div>
      </div>
    </main>
  );
}
