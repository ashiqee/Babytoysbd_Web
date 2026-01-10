// pages/index.tsx
"use client";
import Head from "next/head";
import ProductCard from "../cards/ProductCards";
import ShopByAge from "./ShopByAge";
import Image from "next/image";
import EnhancedCategories from "./CategoriesSection";
import { TProduct } from "@/app/hooks/useProducts";
import React, { Suspense, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import components that are not critical for initial load
const Banner = dynamic(() => import("./Banner"), {
  loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />,
  ssr: false
});

const ProductShowcasenAnimation = dynamic(() => import("../showcase/ProductShowcasenAnimation"), {
  loading: () => (
    <div className="py-16">
      <div className="text-center mb-12">
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2"/>
        <div className="h-4 bg-gray-200 rounded w-96 mx-auto"/>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg"/>
        ))}
      </div>
    </div>
  ),
  ssr: false
});

interface HomePageProps {
  featuredProducts: TProduct[];
}

// Skeleton loading component
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-md shadow-md overflow-hidden">
    <div className="bg-gray-200 h-48 w-full"/>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"/>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"/>
      <div className="flex justify-between">
        <div className="h-6 bg-gray-200 rounded w-16"/>
        <div className="h-8 bg-gray-200 rounded w-20"/>
      </div>
    </div>
  </div>
);

// Optimized ProductCard component with React.memo
const MemoizedProductCard = React.memo(ProductCard);

export default function HomePage({ featuredProducts }: HomePageProps) {

  ;
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  return (
    <div className="min-h-screen">
 
      
      {/* Hero Section with Banner - Suspense for progressive loading */}
      <section className="container mx-auto py-8">
        <Suspense fallback={<div className="h-96 bg-gray-200 animate-pulse rounded-lg" />}>
          <Banner />
        </Suspense>
      </section>
      
      {/* ShopByAge - Suspense for progressive loading */}
      <Suspense fallback={<div className="h-64  bg-gray-200 animate-pulse rounded-lg my-8" />}>
        <ShopByAge />
      </Suspense>
      
      {/* Categories Section - Suspense for progressive loading */}
      <Suspense fallback={<div className="h-64 bg-gray-200 animate-pulse rounded-lg my-8" />}>
        <EnhancedCategories />
      </Suspense>
      
      {/* Featured Products Section */}
      <section className="container mx-auto md:py-8 py-4 px-4 md:px-0">
        <div className="text-center mb-10">
          <h2 className="md:text-3xl text-xl uppercase  font-bold dark:text-yellow-50 text-gray-800">
            Featured Products
          </h2>
          <p className="text-gray-600 text-sm dark:text-yellow-100 mt-2">
            Check out our most popular toys for babies and kids
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3 md:gap-6">
          {featuredProducts
            ?.slice(0, 6)
            .map((product,i) => (
              <MemoizedProductCard key={i} product={product} />
            ))}
        </div>
      </section>
      
      {/* Product Showcase with Animation - Suspense for progressive loading */}
      <Suspense 
        fallback={
          <div className="py-16">
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2"/>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"/>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        }
      >
        <ProductShowcasenAnimation products={featuredProducts}    title="Our Products"
        subtitle="Discover our amazing collection of products"
       
      
        onSearch={handleSearch}
        searchQuery={searchQuery}
        searchPlaceholder="Search by name or description..."
      /> 
      </Suspense>
      
      {/* Newsletter Section - Optimized */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-600 mb-6">
              Get the latest updates on new products and special offers
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}