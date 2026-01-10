// app/(frontend)/_components/pages/products/WhatsAppButton.tsx
"use client";

import { TProduct } from "@/app/hooks/useProducts";



interface WhatsAppButtonProps {
  product: TProduct;
  inStock: boolean;
}

export default function WhatsAppButton({ product, inStock }: WhatsAppButtonProps) {
  const handleWhatsAppOrder = () => {
    if (!inStock) return;
    
    // Get WhatsApp number from environment variables
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801614654397';
    
    // Create message with product details
    const message = `Hello! I'm interested in ordering this product:\n\n*${product.productName}*\n\n`;
    const priceInfo = product.salePrice 
      ? `Price: ৳${product.salePrice} (Discounted from ৳${product.regularPrice})` 
      : `Price: ৳${product.regularPrice}`;
    
    const fullMessage = `${message}${priceInfo}\n\nProduct Link: ${process.env.NEXT_PUBLIC_BASE_URL}/${product.slug}\n\nPlease let me know how to proceed with the order.`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(fullMessage);
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };
  
  return (
    <button
      onClick={handleWhatsAppOrder}
      disabled={!inStock}
      className={`relative flex items-center justify-center px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg${
        inStock
          ? `
              text-white 
              bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700
              transform hover:scale-105 active:scale-95 transition-all duration-300
              overflow-hidden group`
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.99.533 3.856 1.464 5.464L2 22l4.653-1.37A10.003 10.003 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-2.395 0-4.575-.842-6.283-2.243l-.328-.269-3.502 1.03 1.03-3.4-.268-.325A7.968 7.968 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8zm3.679-8.807c-.16-.08-.947-.467-1.094-.521-.147-.054-.254-.08-.361.08-.107.16-.414.521-.507.628-.093.107-.187.12-.347.04-.16-.08-.676-.249-1.287-.795-.475-.423-.796-.945-.889-1.105-.093-.16-.009-.247.07-.327.072-.072.16-.187.24-.28.08-.093.107-.16.16-.267.054-.107.027-.2-.013-.28-.04-.08-.361-.87-.495-1.192-.13-.312-.26-.267-.361-.273-.093-.005-.2-.006-.307-.006-.107 0-.28.04-.427.2-.147.16-.561.548-.561 1.336 0 .788.574 1.548.654 1.655.08.107 1.128 1.724 2.733 2.42.382.165.68.264.913.338.383.121.732.104 1.008.063.307-.045.947-.387 1.08-.761.133-.374.133-.694.093-.761-.04-.067-.147-.107-.307-.187z" clipRule="evenodd" />
      </svg>
      Order via WhatsApp
           {/* Shimmer effect */}
            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"/>
          
    </button>
  );
}