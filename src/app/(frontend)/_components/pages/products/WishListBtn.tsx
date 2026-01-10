"use client";

import { useWishlist } from "@/app/hooks/useWishlist";

import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { Types } from "mongoose";


interface Product {
  _id: Types.ObjectId;
  wishlistCount?: number; // optional if you pass it from backend
}

interface WishlistButtonProps {
  product: Product;
}

export default function WishlistButton({ product }: WishlistButtonProps) {
  const { isInWishlist, wishlistCount, isLoading, toggleWishlist } = useWishlist({
    productId: String(product._id),
    initialWishlistCount: product.wishlistCount ?? 0,
  });



  return (
    <button
      onClick={toggleWishlist}
      
      disabled={isLoading}
      className={`flex items-center justify-center w-9 h-9 rounded-full font-extrabold  transition-colors ${
        isInWishlist
          ? "  text-red-500 hover:bg-red-100"
          : " text-red-500 hover:bg-gray-100"
      }`}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400"/>
      ) : isInWishlist ? (
        <HeartSolid className="h-7 w-7 font-extrabold" fontSize={20} />
      ) : (
        <HeartOutline className="h-7 w-7 font-extrabold" fontWeight={800} fontSize={30} />
      )}
      {/* Optional: show count */}
      {/* {wishlistCount > 0 && (
        <span className="ml-1 text-sm font-medium">{wishlistCount}</span>
      )} */}
    </button>
  );
}
