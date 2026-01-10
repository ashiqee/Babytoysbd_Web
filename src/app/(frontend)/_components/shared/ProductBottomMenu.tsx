'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
import AddToCartButton from '../pages/products/AddToCartButton';
import { useCarts } from '@/app/hooks/usecarts';
import Link from 'next/link';

export default function ProductBottomMenu({product,inStock}:any) {
  const [isVisible, setIsVisible] = useState(false);
 const {isInCart}=useCarts()

  useEffect(() => {
    const handleScroll = () => {
      // Show menu when scrolled 200px down
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200 p-4 md:hidden">
      <div className="flex gap-3 max-w-md mx-auto">
       <AddToCartButton inStock={inStock} product={product} qShow={false} cardBtn={false}/>

       {
        !isInCart(product._id) ? <button className="flex-1 flex items-center justify-center gap-2 py-1.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          <ShoppingBag size={20} />
          Buy Now
        </button>  : <Link href={'/checkout'} className="flex-1 flex items-center justify-center gap-2 py-1.5 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
        Checkout
        </Link>
       }
        
        
      </div>
    </div>
  );
}