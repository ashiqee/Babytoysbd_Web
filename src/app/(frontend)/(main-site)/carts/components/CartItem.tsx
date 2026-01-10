// components/CartItem.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';


const CartItem = ({ item, onUpdateQuantity, onRemove, onMoveToWishlist, currentLanguage }:any) => {
  const [quantity, setQuantity] = useState(item?.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const formatPrice = (price:any) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const handleQuantityChange = async (newQuantity:any) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    setQuantity(newQuantity);
    
    try {
      await onUpdateQuantity(item._id, newQuantity);
    } catch (error) {
      setQuantity(item?.quantity); // Revert on error
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateSubtotal = () => {
    const basePrice = item?.salePrice || item?.regularPrice;
    return basePrice * quantity;
  };

  const getAgeText = () => {
    if (currentLanguage === 'bn') {
      return `${item?.ageRange?.min}-${item?.ageRange?.max} বছর`;
    }
    return `${item?.ageRange?.min}-${item?.ageRange?.max} years`;
  };

  return (
    <div className="flex dark:bg-black/15 bg-black/5 flex-col sm:flex-row gap-4 p-4 bg-card border dark:border-border border-gray-300/5  rounded-lg hover:shadow-gentle transition-shadow duration-200">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <Link href={`/${item.slug}`} className="block">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-lg overflow-hidden">
            <Image
              src={item?.image || '/placeholder-product.png'}
              alt={item?.productName}
              width={428}
              height={428}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        </Link>
      </div>
      
      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-3">
          <div className="flex-1">
            <Link 
              href={`/${item.slug}`}
              className="font-heading font-medium  transition-colors duration-200 line-clamp-2"
            >
              {item?.productName}
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm ">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332-.477 4.5-1.247m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.247v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.247" />
                </svg>
                {item?.category}
              </span>
              {item?.brand && (
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {item?.brand}
                </span>
              )}
            </div>
          </div>
          
          {/* Price Section */}
          <div className="text-right">
            <div className="flex flex-col items-end">
              {item?.salePrice && (
                <span className="text-sm  line-through">
                  {formatPrice(item?.regularPrice)}
                </span>
              )}
              <span className="font-data font-semibold text-lg ">
                {formatPrice(item?.salePrice || item?.regularPrice)}
              </span>
              {item?.salePrice && (
                <span className="text-xs bg-accent  px-2 py-1 rounded-full">
                  {Math.round((1 - parseFloat(item.salePrice) / parseFloat(item.regularPrice)) * 100)}% {currentLanguage === 'en' ? 'OFF' : 'ছাড়'}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Quantity and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <span className="font-body text-sm ">
              {currentLanguage === 'en' ? 'Quantity:' : 'পরিমাণ:'}
            </span>
            <div className="flex items-center border border-border rounded-lg">
              <button
                className="h-8 w-8 flex items-center justify-center  hover:bg-muted disabled:opacity-50"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isUpdating}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="px-3 py-1 font-data text-sm min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                className="h-8 w-8 flex items-center justify-center  hover:bg-muted disabled:opacity-50"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={isUpdating}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            
            {item?.quantity <= 5 && (
              <span className="text-xs ">
                {currentLanguage === 'en' 
                  ? `Only ${item?.quantity} left!` 
                  : `মাত্র ${item?.quantity}টি বাকি!`}
              </span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1 text-sm  hover:text-primary"
              onClick={() => onMoveToWishlist(item._id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="ml-1 text-xs">
                {currentLanguage === 'en' ? 'Save' : 'সেভ'}
              </span>
            </button>
            
            <button
              className="flex items-center gap-1 text-sm  hover:text-destructive"
              onClick={() => onRemove(item._id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="ml-1 text-xs">
                {currentLanguage === 'en' ? 'Remove' : 'মুছুন'}
              </span>
            </button>
          </div>
        </div>
        
        {/* Subtotal */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
          <span className="font-body text-sm ">
            {currentLanguage === 'en' ? 'Subtotal:' : 'উপমোট:'}
          </span>
          <span className="font-data font-semibold ">
            {formatPrice(calculateSubtotal())}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;