'use client'
// components/CartPage.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCarts } from '@/app/hooks/usecarts';

import CartSummary from './components/CartSummary';
import EmptyCart from './components/EmptyCart';
import RecommendedProducts from './components/RecommendedProducts';
import CartItem from './components/CartItem';
import TrustSignalBanner from './components/TrustSignalBanner';
type Language = "en" | "bn";



const CartPage = () => {
  const router = useRouter();
  const { 
    items: cartItems, 
    updateQuantity, 
    removeItem, 
    clearCart,
    saveForLater,
    applyCoupon,
    isCartOpen,
    openCartModal,
    closeCartModal
  } = useCarts();
  
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [shippingCost, setShippingCost] = useState(0);
  const [promoDiscount, setPromoDiscount] = useState(0);

 
  

  // Calculate shipping cost based on subtotal
  React.useEffect(() => {
    const subtotal = cartItems?.reduce((total, item) => {
      const price = item.salePrice || item.regularPrice;
      return total + (price * item.quantity);
    }, 0);
    
    // Free shipping for orders over ৳5000
    setShippingCost(subtotal >= 5000 ? 0 : 120);
  }, [cartItems]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
  
    try {
      removeItem(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleMoveToWishlist = async (itemId: any) => {
    try {
      saveForLater(itemId);
    } catch (error) {
      console.error('Failed to move to wishlist:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      clearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const handleApplyPromoCode = async (promoCode: any) => {
    try {
      const result = applyCoupon(promoCode);
      if (result.success) {
        setPromoDiscount(result.discount);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to apply promo code:', error);
      throw error;
    }
  };

  const handleProceedToCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen md:pt-20">
      {/* Header would go here */}
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Breadcrumb */}
        {/* <Breadcrumb className="mb-6" /> */}
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl  mb-2">
              {currentLanguage === 'en' ? 'Shopping Cart' : 'শপিং কার্ট'}
            </h1>
            {cartItems?.length > 0 && (
              <p className="font-body ">
                {cartItems?.length} {currentLanguage === 'en' ? 'items in your cart' : 'আইটেম আপনার কার্টে'}
              </p>
            )}
          </div>
          
          {cartItems?.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                onClick={() => router.push('/products')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {currentLanguage === 'en' ? 'Continue Shopping' : 'কেনাকাটা চালিয়ে যান'}
              </button>
              
              <button
                className="flex items-center gap-2 px-4 py-2 border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                onClick={handleClearCart}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {currentLanguage === 'en' ? 'Clear Cart' : 'কার্ট খালি করুন'}
              </button>
            </div>
          )}
        </div>
        
        {/* Trust Signal Banner */}
        <TrustSignalBanner context="cart" className="mb-8" />
        
        {cartItems?.length === 0 ? (
          <EmptyCart currentLanguage={currentLanguage} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems?.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  currentLanguage={currentLanguage}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={removeItem}
                  onMoveToWishlist={handleMoveToWishlist}
                />
              ))}
            </div>
            
            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary
                items={cartItems}
                currentLanguage={currentLanguage}
                shippingCost={shippingCost}
                promoDiscount={promoDiscount}
                onApplyPromoCode={handleApplyPromoCode}
                onProceedToCheckout={handleProceedToCheckout}
              />
            </div>
          </div>
        )}
        
        {/* Recommended Products */}
        <div className="mt-16 hidden">
          <RecommendedProducts currentLanguage={currentLanguage} />
        </div>
        
        {/* Additional Trust Signals */}
        <div className="mt-12 bg-muted/30 rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-body font-medium text-sm mb-1">
                {currentLanguage === 'en' ? 'Safe & Secure' : 'নিরাপদ ও সুরক্ষিত'}
              </h3>
              <p className="font-caption text-xs ">
                {currentLanguage === 'en' ?'All toys are safety certified' :'সকল খেলনা নিরাপত্তা প্রত্যয়িত'}
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-body font-medium text-sm mb-1">
                {currentLanguage === 'en' ? 'Fast Delivery' : 'দ্রুত ডেলিভারি'}
              </h3>
              <p className="font-caption text-xs ">
                {currentLanguage === 'en' ?'Free delivery on orders over ৳500' :'৳৫০০+ অর্ডারে বিনামূল্যে ডেলিভারি'}
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-body font-medium text-sm  mb-1">
                {currentLanguage === 'en' ? 'Easy Returns' : 'সহজ রিটার্ন'}
              </h3>
              <p className="font-caption text-xs ">
                {currentLanguage === 'en' ?'7-day hassle-free returns' :'৭ দিনের ঝামেলামুক্ত রিটার্ন'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;