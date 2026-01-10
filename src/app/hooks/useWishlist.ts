"use client";

import { useState, useEffect } from "react";

interface UseWishlistProps {
  productId?: string; // optional if you just want global count
  initialWishlistCount?: number;
}

export const useWishlist = ({ productId, initialWishlistCount = 0 }: UseWishlistProps) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistCount, setWishlistCount] = useState<number>(initialWishlistCount);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Load global wishlist count + check product on mount
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      try {
        const parsed: string[] = JSON.parse(stored);
        setWishlistCount(Array.isArray(parsed) ? parsed.length : 0);
        if (productId) {
          setIsInWishlist(parsed.includes(productId));
        }
      } catch {
        setWishlistCount(0);
        setIsInWishlist(false);
      }
    }
  }, [productId]);

  // ✅ Listen for wishlist updates across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        try {
          const parsed: string[] = JSON.parse(stored);
          setWishlistCount(Array.isArray(parsed) ? parsed.length : 0);
          if (productId) {
            setIsInWishlist(parsed.includes(productId));
          }
        } catch {
          setWishlistCount(0);
          setIsInWishlist(false);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [productId]);

    const updateWishlist = (newList: string[]) => {
    localStorage.setItem("wishlist", JSON.stringify(newList));
    setWishlistCount(newList.length); // update immediately in same tab
  };

  // ✅ Toggle wishlist for specific product
  const toggleWishlist = async () => {
    if (!productId) return; // no-op if used only for global count
    setIsLoading(true);

    try {
      const stored = localStorage.getItem("wishlist");
      let wishlist: string[] = stored ? JSON.parse(stored) : [];

      let action: "add" | "remove";
      if (isInWishlist) {
        action = "remove";
        wishlist = wishlist.filter((id) => id !== productId);
      } else {
        action = "add";
        if (!wishlist.includes(productId)) {
          wishlist.push(productId);
            
        }
      }

      // ✅ Save locally
      localStorage.setItem("wishlist", JSON.stringify(wishlist));

      // ✅ Update local states immediately
      setIsInWishlist(!isInWishlist);
      setWishlistCount(wishlist.length);

      // ✅ Update in database
      const response = await fetch(`/api/products/wishlist/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.wishlistCount !== undefined) {
          setWishlistCount(data.wishlistCount);
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isInWishlist,
    wishlistCount, // ✅ global count
    isLoading,
    updateWishlist,
    toggleWishlist,
  };
};
