/* ──────────────────────────────────────────────────────────────────────────────
   app/layout.tsx  – Next.js 15 Root layout with enhanced SEO
   ─────────────────────────────────────────────────────────────────────────── */
import "./globals.css";
import type { Metadata, Viewport } from "next";
import clsx from "clsx";
import Script from "next/script";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { fetchStoreSeo } from "./(backend)/_lib/services/seo/fetchStoreSeo";




/* ─── 2. Viewport configuration ─────────────────────────────────────────────── */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

/* ─── 3. Enhanced Root layout component ─────────────────────────────────────── */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { googleAnalytics, facebookPixel, structuredData } = await fetchStoreSeo();



 
  return (
    <html suppressHydrationWarning lang="en" dir="ltr">
      <head>
        {/* Structured Data (JSON-LD) */}
        {structuredData && (
          <Script
            id="structured-data"
            type="application/ld+json"
            strategy="beforeInteractive"
          >
            {JSON.stringify(structuredData)}
          </Script>
        )}
        
        {/* DNS Prefetching for Performance */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//connect.facebook.net" />
        <link rel="dns-prefetch" href="//www.facebook.com" />

       
      </head>
      
      <body
        className={clsx(
       
          fontSans.variable
        )}
      >

     

        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          {/* Skip to main content for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            Skip to main content
          </a>
          
          <main id="main-content">{children}</main>
          
          {/* ─────────────── Google Analytics (GA4) ─────────────── */}
          {/* {googleAnalytics && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalytics}`}
                strategy="afterInteractive"
              />
              <Script id="ga-init" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${googleAnalytics}', {
                    page_title: document.title,
                    page_location: window.location.href,
                    page_path: window.location.pathname,
                  });
                `}
              </Script>
            </>
          )} */}
          
          {/* ─────────────── Facebook Pixel ─────────────── */}
          {/* {facebookPixel && (
            <>
              <Script id="fb-pixel" strategy="afterInteractive">
                {`
                  !function(f,b,e,v,n,t,s){
                    if(f.fbq)return;n=f.fbq=function(){
                    n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;
                    n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)
                  }(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${facebookPixel}');
                  fbq('track', 'PageView');
                `}
              </Script>
              <noscript>
                <Image
                  alt="facebook-pixel"
                  height="1"
                  width="1"
                  style={{ display: "none" }}
                  src={`https://www.facebook.com/tr?id=${facebookPixel}&ev=PageView&noscript=1`}
                />
              </noscript>
            </>
          )} */}
        </Providers>
      </body>
    </html>
  );
}