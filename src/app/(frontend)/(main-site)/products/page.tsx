// app/products/page.tsx
import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { Suspense } from 'react';
import CustomerProductsPage from './CustomerProductsPage';

// Generate dynamic metadata based on current path
export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const pathname = (await headersList).get('x-pathname') || '/products';
  const host = (await headersList).get('host') || 'babytoysbd.com';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  const fullUrl = `${baseUrl}${pathname}`;

  // Generate dynamic title based on path
  const pathSegments = pathname.split('/').filter(Boolean);
  let title = 'Shop the Best Toys Collection Online for Kids | BabyToysBD';
  let description = 'Discover amazing toys for all ages at BabyToysBD. We have a wide range of educational, fun and safe toys for kids in Bangladesh.';
  let keywords = 'baby toys, kids toys, educational toys, toys Bangladesh, online toy store';

  // Customize metadata based on path segments
  if (pathSegments.length > 1) {
    const category = pathSegments[1];
    title = `${category.charAt(0).toUpperCase() + category.slice(1)} Toys for Kids | BabyToysBD`;
    description = `Buy ${category} toys online in Bangladesh. Fast delivery and best prices at BabyToysBD.`;
    keywords = `${category} toys, ${category}, kids toys Bangladesh`;
  }

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'BabyToysBD',
      images: [
        {
          url: `${baseUrl}/images/og-toys-collection.jpg`,
          width: 1200,
          height: 630,
          alt: 'Baby Toys Collection in Bangladesh',
        },
      ],
      locale: 'en_BD',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/images/og-toys-collection.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'geo.region': 'BD',
      'geo.placename': 'Bangladesh',
    },
  };
}


// Main page component with Suspense boundary
export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerProductsPage/>
    </Suspense>
  );
}