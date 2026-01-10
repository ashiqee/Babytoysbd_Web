import { dbConnect } from "@/lib/db/dbConnect";
import { StoreSettings } from "@/lib/models/sites/StoreSettings";

export async function fetchStoreSeo() {
  await dbConnect();
  const settings = await StoreSettings.findOne();
  const  googlegaid = process.env.NEXT_PUBLIC_GA_ID;
 

  // Default values specific to babytoysbd.com
  const siteDefaults = {
    title: "Baby Toys BD - Premium Educational Toys for Children",
    description: "Discover high-quality educational toys for babies and children at Baby Toys BD. Safe, durable, and development-focused toys with nationwide delivery in Bangladesh.",
    keywords: "baby toys, educational toys, kids toys, online toy store Bangladesh, children toys, learning toys, safe toys, toy shop bd",
    logo: "/logo.png",
    canonicalUrl: "https://babytoysbd.com",
    ogImage: "/og-babytoysbd.jpg",
    twitterHandle: "@babytoysbd",
    storeName: "Baby Toys BD",
    storeEmail: "info@babytoysbd.com",
    storePhone: "+8801234567890",
    storeAddress: "123 Shopping Complex, Gulshan, Dhaka, Bangladesh",
    currency: "BDT",
    timezone: "Asia/Dhaka",
    customDomain: "babytoysbd.com",
    
    // Verification codes (set these in your environment variables)
    googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || "",
    bingSiteVerification: process.env.BING_SITE_VERIFICATION || "",
    yandexSiteVerification: process.env.YANDEX_SITE_VERIFICATION || "",
    
    
    // Social media links
    facebook: "https://facebook.com/babytoysbd",
    instagram: "https://instagram.com/babytoysbd",
    youtube: "https://youtube.com/@babytoysbd",
    pinterest: "https://pinterest.com/babytoysbd",
    whatsapp: "+8801623023940",
    
    // Structured data (JSON-LD)
    structuredData: {
      "@context": "https://schema.org",
      "@type": "OnlineStore",
      name: "Baby Toys BD",
      description: "Premium educational toys for children in Bangladesh",
      url: "https://babytoysbd.com",
      logo: "https://babytoysbd.com/logo.png",
      image: "https://babytoysbd.com/og-babytoysbd.jpg",
      address: {
        "@type": "PostalAddress",
        streetAddress: "37 Shop,3rd floor, Bismillah Tower, Chawkbazar",
        addressLocality: "Dhaka",
        addressRegion: "Dhaka Division",
        postalCode: "1212",
        addressCountry: "BD"
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+8801623023940",
        contactType: "customer service",
        email: "info@babytoysbd.com"
      },
      sameAs: [
        "https://facebook.com/babytoysbd",
        "https://instagram.com/babytoysbd",
        "https://youtube.com/@babytoysbd",
        "https://pinterest.com/babytoysbd"
      ],
      priceRange: "৳500 - ৳10000",
      openingHours: "Mo-Sa 09:00-20:00",
      paymentAccepted: "Cash on Delivery, Bkash, Nagad, Credit Card"
    }
  };

  return {
    // Basic SEO
    title: settings?.metaTitle || siteDefaults.title,
    description: settings?.metaDescription || siteDefaults.description,
    keywords: settings?.metaKeywords || siteDefaults.keywords,
    logo: settings?.logo || siteDefaults.logo,
    canonicalUrl: settings?.canonicalUrl || siteDefaults.canonicalUrl,
    
    // Social media images
    ogImage: settings?.ogImage || siteDefaults.ogImage,
    twitterHandle: settings?.twitterHandle || siteDefaults.twitterHandle,
    
    // Tracking
    googleAnalytics: settings?.googleAnalytics || googlegaid ||"",
    facebookPixel: settings?.facebookPixel || "",
    
    // Social media links
    facebook: settings?.facebook || siteDefaults.facebook,
    instagram: settings?.instagram || siteDefaults.instagram,
    youtube: settings?.youtube || siteDefaults.youtube,
    pinterest: settings?.pinterest || siteDefaults.pinterest,
    whatsapp: settings?.whatsapp || siteDefaults.whatsapp,
    
    // Site data
    storeName: settings?.storeName || siteDefaults.storeName,
    storeEmail: settings?.storeEmail || siteDefaults.storeEmail,
    storePhone: settings?.storePhone || siteDefaults.storePhone,
    storeAddress: settings?.storeAddress || siteDefaults.storeAddress,
    currency: settings?.currency || siteDefaults.currency,
    timezone: settings?.timezone || siteDefaults.timezone,
    customDomain: settings?.customDomain || siteDefaults.customDomain,
    
    // Verification codes
    googleSiteVerification: settings?.googleSiteVerification || siteDefaults.googleSiteVerification,
    bingSiteVerification: settings?.bingSiteVerification || siteDefaults.bingSiteVerification,
    yandexSiteVerification: settings?.yandexSiteVerification || siteDefaults.yandexSiteVerification,
    
    // Structured data
    structuredData: settings?.structuredData || siteDefaults.structuredData,
    
    // Additional SEO fields
    robots: settings?.robots || "index, follow",
    author: settings?.author || "Baby Toys BD Team",
    language: settings?.language || "en",
    country: settings?.country || "Bangladesh",
    region: settings?.region || "Dhaka"
  };
}