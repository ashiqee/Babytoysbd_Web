"use client";

import { useState } from "react";
import { ShoppingBag, ShoppingCart, X } from "lucide-react";
import CartModal from "../_modals/CartModal"; // adjust path
import { useCarts } from "@/app/hooks/usecarts";
import Link from "next/link";

export default function CartSidebar({position}:any) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items } = useCarts();

  const itemsLength = items.length;
  const barPositon = position || 'right-6 bottom-8'

  return (
    <div>
      {/* Floating Cart Button - Always visible when items exist */}
      {itemsLength > 0 && (
        <div
          className={`
            fixed ${barPositon} z-50 flex flex-col items-center gap-3
             transition-all duration-300
          `}
        >
          {/* Cart button with animated badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`
              relative flex items-center justify-center w-14 h-14 rounded-full
              shadow-lg hover:shadow-xl transition-all duration-300
              bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600
              transform hover:scale-110 active:scale-95
              group
            `}
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-7 h-7 text-amber-900" />

            {/* Animated badge */}
            {itemsLength > 0 && (
              <span
                className={`
                absolute -top-1 -right-1 flex items-center justify-center
                w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold
                animate-pulse transition-all duration-300
                ${itemsLength > 9 ? "w-7 h-7 text-[10px]" : ""}
              `}
              >
                {itemsLength > 99 ? "99+" : itemsLength}
              </span>
            )}

            {/* Tooltip on hover */}
            <span className="absolute -top-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              View Cart
            </span>
          </button>

          {/* Checkout button with animation */}
          <Link
            href="/checkout"
            className={`
              relative flex items-center justify-center px-4 py-2 rounded-full
              text-white font-medium shadow-md hover:shadow-lg
              bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700
              transform hover:scale-105 active:scale-95 transition-all duration-300
              overflow-hidden group
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Checkout
            </span>
            {/* Shimmer effect */}
            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>
        </div>
      )}

      {/* Cart Modal with backdrop blur */}
      {isCartOpen && (
        <button
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
