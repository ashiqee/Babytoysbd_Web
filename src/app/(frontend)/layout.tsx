
import type { Metadata } from "next";
import { GoogleTagManager } from '@next/third-parties/google'
import { Tiro_Bangla } from "next/font/google";
import { montserrat } from '@/lib/fonts';
import BottomMenu from "@/components/BottomMenu";
import ClientLayout from "./ClientLayout";
import GTMPageTracker from "@/lib/db/GTM/GTMPageTracker";
import GTMScript from "@/components/GTM";



const tiroBangla = Tiro_Bangla({
  weight: ["400"], // Tiro Bangla only supports 400
  style: ["normal", "italic"],
  subsets: ["bengali"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Castle Tent House",
    description: "Baby toys bd",
  };
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return   <main className={montserrat.variable}>
    <div className={montserrat.className}>
    <ClientLayout>
      {/* <GTMScript
  gtmId={process.env.NEXT_PUBLIC_GTM_WEB_ID} // browser container ID
  ga4Id={process.env.NEXT_PUBLIC_GA4_ID} // GA4 Measurement ID
  gtmServerUrl={process.env.NEXT_PUBLIC_GTM_SERVER_URL} // server container URL
/> */}

<GoogleTagManager  gtmId={process.env.NEXT_PUBLIC_GTM_WEB_ID || ""} />

      <GTMPageTracker/>

          {children}
        </ClientLayout>
  
    </div>
  </main>
}
