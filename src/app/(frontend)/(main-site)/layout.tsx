// app/FrontendLayout.tsx

import { motion } from "framer-motion";
import Header from "../_components/shared/HeaderNavbar";
import { fetchStoreSeo } from "@/app/(backend)/_lib/services/seo/fetchStoreSeo";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

/* ─── 1. Enhanced server-side metadata ─────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchStoreSeo();

  return {
    metadataBase: new URL(seo.canonicalUrl || "https://babytoysbd.com"),
    // Core metadata
    title: {
      default: seo.title || siteConfig.name,
      template: `%s | ${seo.title || siteConfig.name}`,
    },
    description: seo.description || siteConfig.description,
    keywords:
      seo.keywords ||
      "baby toys, educational toys, kids toys, online toy store",
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,

    // SEO verification
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },

    // Robots management
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Canonical URL
    alternates: {
      canonical: seo.canonicalUrl || "https://babytoysbd.com",
    },

    // Icons
    icons: {
      icon: [
        { url: seo.logo || "/favicon.ico", sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      other: [
        { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#00aba9" },
      ],
    },

    // Open Graph
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonicalUrl,
      siteName: seo.title,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: seo.ogImage || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage || "/og-image.jpg"],
    },

    // App metadata
    appleWebApp: {
      capable: true,
      title: seo.title || siteConfig.name,
      statusBarStyle: "default",
    },

    // Additional meta tags
    other: {
      "twitter:label1": "Price range",
      "twitter:data1": "$10 - $50",
      "twitter:label2": "Availability",
      "twitter:data2": "In stock",
    },
  };
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col justify-between min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Main Content */}
      <main className="relative flex-1">
        {/* Foreground content */}
        <div className="relative z-10 md:pt-20 pt-6 font-montserrat leading-relaxed text-orange-950 dark:text-yellow-50">
          <Header />

          {/* SEO Headings go here in page components passed as {children} */}
          <div className="md:px-0 px-4">
            {children}
          </div>
        </div>
      </main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-3 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} Baby Toys BD. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}