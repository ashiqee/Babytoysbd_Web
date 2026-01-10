// components/EmptyCart.tsx
import React from 'react';
import { useCarts } from '@/app/hooks/usecarts';
type Language = "en" | "bn";

const EmptyCart = ({ currentLanguage }:{currentLanguage:Language}) => {
  const { items } = useCarts();
  
  const popularCategories = [
    {
      name: { en: 'Educational Toys', bn: 'শিক্ষামূলক খেলনা' },
      icon: 'BookOpen',
      href: '/products?category=educational'
    },
    {
      name: { en: 'Soft Toys', bn: 'নরম খেলনা' },
      icon: 'Heart',
      href: '/products?category=soft-toys'
    },
    {
      name: { en: 'Building Blocks', bn: 'বিল্ডিং ব্লক' },
      icon: 'Box',
      href: '/products?category=building-blocks'
    },
    {
      name: { en: 'Musical Toys', bn: 'সঙ্গীত খেলনা' },
      icon: 'Music',
      href: '/products?category=musical'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Empty Cart Illustration */}
      <div className="w-32 h-32 bg-muted/30 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      
      {/* Empty State Content */}
      <div className="text-center mb-8 max-w-md">
        <h2 className="font-heading font-semibold text-2xl  mb-3">
          {currentLanguage === 'en' ?'Your cart is empty' :'আপনার কার্ট খালি'}
        </h2>
        <p className="font-body text-muted-foreground leading-relaxed">
          {currentLanguage === 'en' 
            ? 'Looks like you haven\'t added any toys to your cart yet. Start exploring our collection of safe and fun toys for your little ones!'
            : 'মনে হচ্ছে আপনি এখনও আপনার কার্টে কোনো খেলনা যোগ করেননি। আপনার ছোট্ট সোনাদের জন্য নিরাপদ এবং মজার খেলনার আমাদের সংগ্রহ দেখুন!'
          }
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <button
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          onClick={() => window.location.href = '/products'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {currentLanguage === 'en' ? 'Start Shopping' : 'কেনাকাটা শুরু করুন'}
        </button>
        
        <button
          className="flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
          onClick={() => window.location.href = '/wishlist'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {currentLanguage === 'en' ? 'View Wishlist' : 'পছন্দের তালিকা দেখুন'}
        </button>
      </div>
      
      {/* Popular Categories */}
      <div className="w-full max-w-2xl">
        <h3 className="font-heading font-medium text-lg  text-center mb-6">
          {currentLanguage === 'en' ?'Popular Categories' :'জনপ্রিয় বিভাগ'}
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {popularCategories?.map((category, index) => (
            <a
              key={index}
              href={category?.href}
              className="flex flex-col items-center p-4 bg-card border border-border rounded-lg hover:shadow-gentle hover:border-primary/20 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors duration-200">
                {category.icon === 'BookOpen' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332-.477 4.5-1.247m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.247v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.247" />
                  </svg>
                )}
                {category.icon === 'Heart' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
                {category.icon === 'Box' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )}
                {category.icon === 'Music' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                )}
              </div>
              <span className="font-body text-sm text-center  group-hover:text-primary transition-colors duration-200">
                {category?.name?.[currentLanguage] }
              </span>
            </a>
          ))}
        </div>
      </div>
      
      {/* Trust Signals */}
      <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="font-caption">
            {currentLanguage === 'en' ? 'Safe & Certified' : 'নিরাপদ ও প্রত্যয়িত'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="font-caption">
            {currentLanguage === 'en' ? 'Free Delivery' : 'বিনামূল্যে ডেলিভারি'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="font-caption">
            {currentLanguage === 'en' ? 'Easy Returns' : 'সহজ রিটার্ন'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;