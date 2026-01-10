// components/ProductVariations.tsx
"use client";

import { useState } from 'react';


interface ProductVariationsProps {
  variations: any[];
}

export default function ProductVariations({ variations }: ProductVariationsProps) {
  const [selectedVariation, setSelectedVariation] = useState<any | null>(null);
  
  const handleVariationSelect = (variation: any) => {
    setSelectedVariation(variation);
  };
  
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-lg text-gray-800 mb-3">Options</h3>
      
      {variations.map((variation, index) => (
        <div key={index} className="mb-4">
          <h4 className="text-gray-700 mb-2">
            {variation.attributes.map((attr:any) => attr.name).join(' / ')}
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {variation.attributes.map((attr:any, attrIndex:string) => (
              <button
                key={attrIndex}
                className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                  selectedVariation?._id === variation._id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleVariationSelect(variation)}
              >
                {attr.value}
              </button>
            ))}
          </div>
        </div>
      ))}
      
      {selectedVariation && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-800">
                Selected: {selectedVariation.attributes.map((attr:any) => `${attr.name}: ${attr.value}`).join(', ')}
              </p>
              <p className="font-medium text-blue-900">
                ৳{selectedVariation.salePrice || selectedVariation.regularPrice}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              (selectedVariation.quantity || 0) > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {(selectedVariation.quantity || 0) > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}