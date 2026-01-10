'use client';
import { useState, useEffect } from 'react';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import AddToCartButton from '../../_components/pages/products/AddToCartButton';
import { Types } from 'mongoose';

// Define TypeScript interfaces
interface Product {
  _id: Types.ObjectId;
  productName: string;
  salePrice: number;
  regularPrice: number;
  discountPercentage: number;
  inStock: string;
  brandName: string;
  sku: string;
  sortDescription: string;
  image: string;
  category: string;
  [key: string]: any;
}

interface WishlistItem {
  product: Product;
  isLoading: boolean;
  error: string | null;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);



  // Load wishlist items from localStorage and fetch product details
  useEffect(() => {
    const loadWishlist = async () => {
  try {
    setIsLoading(true);
    setError(null);
    
    // Get wishlist IDs from localStorage
    const wishlistIdsJSON = localStorage.getItem('wishlist');
    const wishlistIds: string[] = wishlistIdsJSON ? JSON.parse(wishlistIdsJSON) : [];
    
    if (wishlistIds.length === 0) {
      setWishlistItems([]);
      setIsLoading(false);
      return;
    }
    
    // Fetch all products in a single API call
    const response = await fetch('/api/products/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productIds: wishlistIds }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    const products = await response.json();
    
    // Map products to wishlist items
    const wishlistItems: WishlistItem[] = products.map((product: Product) => ({
      product,
      isLoading: false,
      error: null
    }));
    
    setWishlistItems(wishlistItems);
    
  } catch (err) {
    console.error('Error loading wishlist:', err);
    setError('Failed to load your wishlist. Please try again later.');
  } finally {
    setIsLoading(false);
  }
};
    
    loadWishlist();
  }, []);

  // Remove item from wishlist
  const removeFromWishlist = (productId: any) => {
    try {
      const wishlistJSON = localStorage.getItem('wishlist');
      const wishlist: string[] = wishlistJSON ? JSON.parse(wishlistJSON) : [];
      const updatedWishlist = wishlist.filter(id => id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      
      // Update state
      setWishlistItems(prev => prev.filter(item => item.product._id !== productId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    try {
      localStorage.removeItem('wishlist');
      setWishlistItems([]);
    } catch (err) {
      console.error('Error clearing wishlist:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"/>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center py-16 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-4">Error Loading Wishlist</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <HeartSolid className="h-8 w-8 text-red-500 mr-2" />
          My Wishlist
        </h1>
        {wishlistItems.length > 0 && (
          <button 
            onClick={clearWishlist}
            className="flex items-center text-red-600 hover:text-red-800 transition-colors"
          >
            <TrashIcon className="h-5 w-5 mr-1" />
            Clear All
          </button>
        )}
      </div>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <HeartSolid className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Add items to your wishlist by clicking the heart icon on any product.</p>
          <Link 
            href="/products" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item,i) => (
            <div key={i} className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Link href={`/${item.product.slug}`}>
                  <img 
                    src={item.product.images[0] || 'https://via.placeholder.com/300x300?text=No+Image'} 
                    alt={item.product.productName} 
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <button 
                  onClick={() => removeFromWishlist(item.product._id)}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove from wishlist"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                {item.product.discountPercentage > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                    {item.product.discountPercentage}% OFF
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  <Link href={`/${item.product.slug}`} className="hover:text-blue-600 transition-colors">
                    {item.product.productName}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-2">{item.product.brandName}</p>
                
                <div className="flex items-center mb-3">
                  {item.product.salePrice > 0 ? (
                    <>
                      <span className="text-lg font-bold text-gray-800">${item?.product?.salePrice}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">${item?.product?.regularPrice}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-800">${item?.product?.regularPrice}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    item.product.stockStatus === "In Stock"
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.product.stockStatus === "In Stock" ? 'In Stock' : 'Out of Stock'}
                  </span>
                  
                  <AddToCartButton cardBtn={false} qShow={false} product={item.product} inStock={item.product.stockStatus === "In Stock"}/> 
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}