// components/RecommendedProducts.tsx
import React from 'react';
import Image from 'next/image';
import { useCarts } from '@/app/hooks/usecarts';
import Link from 'next/link';
import ProductCard from '@/app/(frontend)/_components/cards/ProductCards';
import { useProducts } from '@/app/hooks/useProducts';

type Language = "en" | "bn";

const RecommendedProducts = ({ currentLanguage }:{currentLanguage:Language}) => {
  const { addToCart } = useCarts();
  const {products}=useProducts()
  
  const recommendedProducts = products.slice(0,4)

  const formatPrice = (price: number ) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const getAgeText = (ageRange: { min: number; max: number; } | { min: number; max: number; }) => {
    if (currentLanguage === 'bn') {
      return ageRange?.max === 60 
        ? `${ageRange?.min}+ বছর` 
        : `${ageRange?.min}-${ageRange?.max} বছর`;
    }
    return ageRange?.max === 60 
      ? `${ageRange?.min}+ years` 
      : `${ageRange?.min}-${ageRange?.max} years`;
  };

  const handleAddToCart = async (productId: any) => {
    const product = recommendedProducts?.find(p => p?._id === productId);
    
    if (product) {
      try {
        await addToCart({
          _id: product._id,
          productName: product.productName,
          regularPrice: product.regularPrice,
          salePrice: product.salePrice,
          images: product.images,
          category: product.category,
          quantity: 1
        });
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    }
  };

  return (
    <div className="border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-semibold text-lg ">
          {currentLanguage === 'en' ?'You might also like' :'আপনার পছন্দ হতে পারে'}
        </h2>
        <Link
          href="/products"
          className="font-body text-sm  transition-colors duration-200"
        >
          {currentLanguage === 'en' ? 'View all' : 'সব দেখুন'}
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendedProducts?.map((product,i) => (
          <div
            key={i}
            className=" border border-border rounded-lg p-4 hover:shadow-gentle transition-shadow duration-200 group"
          >
          <ProductCard product={product}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;