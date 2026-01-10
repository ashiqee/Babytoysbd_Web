"use client"
import { Types } from 'mongoose';
// components/CartSummary.tsx
import React, { useState } from 'react';
interface CartItem {
  _id: Types.ObjectId;
  productName: string;
  salePrice: number;
  regularPrice: number;
  quantity: number;
  imageUrl?: string;
}

interface CartSummaryProps {
  items: CartItem[];
  currentLanguage: string;
  onApplyPromoCode: (code: string) => void;
  onProceedToCheckout: () => void;
  shippingCost?: number;
  promoDiscount?: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  currentLanguage,
  onApplyPromoCode,
  onProceedToCheckout,
  shippingCost = 0,
  promoDiscount = 0,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState('');
  
  const formatPrice = (price:  number ) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const calculateSubtotal = () => {
    return items?.reduce((total: number, item: { salePrice: any; regularPrice: any; quantity: number; }) => {
      const price = item?.salePrice || item?.regularPrice;
      return total + (price * item?.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + shippingCost - promoDiscount;
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode?.trim()) return;
    
    setIsApplyingPromo(true);
    setPromoError('');
    
    try {
      await onApplyPromoCode(promoCode);
    } catch (error) {
      setPromoError(
        currentLanguage === 'en' ?'Invalid promo code' :'অবৈধ প্রোমো কোড'
      );
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const getTotalItems = () => {
    return items?.reduce((total: any, item: { quantity: any; }) => total + item?.quantity, 0);
  };

  const getEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 days from now
    
    return deliveryDate.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-semibold text-lg ">
          {currentLanguage === 'en' ? 'Order Summary' : 'অর্ডার সারসংক্ষেপ'}
        </h2>
        <span className="font-caption text-sm ">
          {getTotalItems()} {currentLanguage === 'en' ? 'items' : 'আইটেম'}
        </span>
      </div>
      
      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-body ">
            {currentLanguage === 'en' ? 'Subtotal' : 'উপমোট'}
          </span>
          <span className="font-data ">
            {formatPrice(calculateSubtotal())}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-body ">
            {currentLanguage === 'en' ? 'Shipping' : 'শিপিং'}
          </span>
          <span className="font-data ">
            {shippingCost === 0 
              ? (currentLanguage === 'en' ? 'FREE' : 'বিনামূল্যে')
              : formatPrice(shippingCost)
            }
          </span>
        </div>
        
        {promoDiscount > 0 && (
          <div className="flex justify-between items-center ">
            <span className="font-body">
              {currentLanguage === 'en' ? 'Promo Discount' : 'প্রোমো ছাড়'}
            </span>
            <span className="font-data">
              -{formatPrice(promoDiscount)}
            </span>
          </div>
        )}
        
        <div className="border-t border-border pt-3">
          <div className="flex justify-between items-center">
            <span className="font-heading font-semibold text-lg ">
              {currentLanguage === 'en' ? 'Total' : 'মোট'}
            </span>
            <span className="font-data font-bold text-xl ">
              {formatPrice(calculateTotal())}
            </span>
          </div>
        </div>
      </div>
      
      {/* Promo Code Section */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={currentLanguage === 'en' ? 'Enter promo code' : 'প্রোমো কোড লিখুন'}
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50"
            onClick={handleApplyPromoCode}
            disabled={!promoCode?.trim() || isApplyingPromo}
          >
            {isApplyingPromo ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            ) : (
              currentLanguage === 'en' ? 'Apply' : 'প্রয়োগ'
            )}
          </button>
        </div>
        {promoError && (
          <p className="text-xs text-destructive mt-1">{promoError}</p>
        )}
      </div>
      
      {/* Delivery Information */}
      <div className="bg-muted/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5  flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-body font-medium text-sm  mb-1">
              {currentLanguage === 'en' ? 'Estimated Delivery' : 'আনুমানিক ডেলিভারি'}
            </h3>
            <p className="font-caption text-xs ">
              {getEstimatedDelivery()}
            </p>
            <p className="font-caption text-xs  mt-1">
              {currentLanguage === 'en' ?'Free delivery on orders over ৳500' :'৳৫০০+ অর্ডারে বিনামূল্যে ডেলিভারি'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Trust Signals */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-2 text-xs ">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="font-caption">
            {currentLanguage === 'en' ? 'Secure Payment' : 'নিরাপদ পেমেন্ট'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs ">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="font-caption">
            {currentLanguage === 'en' ? '7-Day Returns' : '৭ দিন রিটার্ন'}
          </span>
        </div>
      </div>
      
      {/* Checkout Button */}
      <button
        className="w-full bg-yellow-500  bg-gradient-to-tr  font-medium py-3 rounded-lg hover:bg-yellow-900/90 transition-colors flex items-center justify-center gap-2 mb-4"
        onClick={onProceedToCheckout}
      >
        {currentLanguage === 'en' ? 'Proceed to Checkout' : 'চেকআউটে যান'}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
      
      {/* Continue Shopping Link */}
      <button
        className="w-full flex items-center justify-center gap-2 text-sm  hover:"
        onClick={() => window.location.href = '/products'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {currentLanguage === 'en' ? 'Continue Shopping' : 'কেনাকাটা চালিয়ে যান'}
      </button>
    </div>
  );
};

export default CartSummary;