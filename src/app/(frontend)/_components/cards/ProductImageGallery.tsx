"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductImageGalleryProps {
  product: any
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasImages = product?.images?.length > 0;

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const selectImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (!hasImages) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50 rounded-lg border border-dashed border-gray-300 p-8">
        <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-500 font-medium">No Images Available</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Main Image Container */}
      <Link href={`/${product.slug}`}>
        <div className="relative overflow-hidden rounded-t-md bg-gray-100 border border-gray-200 aspect-square">
          {/* Main Image with zoom effect */}
          <Image
            src={product.images[currentIndex]}
            alt={product.productName}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Navigation Arrows */}
          <button
            onClick={(e) => { e.preventDefault(); prevImage(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white text-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={(e) => { e.preventDefault(); nextImage(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white text-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          {/* Image Counter */}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-1 py-0.5 rounded">
            {currentIndex + 1} / {product.images.length}
          </div>
        </div>
      </Link>
      
      {/* Thumbnail Gallery */}
      <div className="flex  space-x-2 overflow-x-auto px-2 py-2">
        {product.images.map((image:string, index:number) => (
          <button
            key={index}
            onClick={() => selectImage(index)}
            className={`flex-shrink-0 relative rounded-md overflow-hidden border-2 transition-all duration-200 ${
              index === currentIndex 
                ? 'border-yellow-500 scale-105' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <div className="w-8 h-8 bg-gray-100">
              <Image
                src={image}
                alt={`${product.productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            {index === currentIndex && (
              <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"/>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}