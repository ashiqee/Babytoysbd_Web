"use client";
import { useEffect, useState } from "react";

function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("wishlist");
  try {
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useLocalWishlist() {
  const [wishlist, setWishlist] = useState<string[]>(getWishlist());

  // ✅ Load + listen for changes across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setWishlist(getWishlist());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Update wishlist (same tab + storage)
  const updateWishlist = (newList: string[]) => {
    localStorage.setItem("wishlist", JSON.stringify(newList));
    setWishlist(newList);
  };

  // ✅ Toggle add/remove
  const toggleWishlistItem = (id: string) => {
    const newList = wishlist.includes(id)
      ? wishlist.filter((item) => item !== id)
      : [...wishlist, id];
    updateWishlist(newList);
  };

  return {
    wishlist,
    wishlistCount: wishlist.length,
    updateWishlist,
    toggleWishlistItem,
  };
}
