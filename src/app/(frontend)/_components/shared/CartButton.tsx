"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import CartModal from "../_modals/CartModal"; // adjust path
import { useCarts } from "@/app/hooks/usecarts";

export default function CartButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const {items}= useCarts();

  const itemsLength = items.length;
  // show button after scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Floating Cart Button */}
      {
        itemsLength > 0 && <><button
        onClick={() => setIsCartOpen(true)}
        className={`
           fixed right-6 z-50 p-3 rounded-full
          bg-gradient-to-r from-yellow-400/25 to-yellow-500 text-slate-900
          shadow-lg hover:scale-110 transition-transform duration-300
          ${!isVisible ? "bottom-20" : "bottom-32"}
        `}
        aria-label="Open Cart"
      >
        {
            itemsLength > 0 && <span className="relative text-xl h-fit text-gray-700 font-bold">
                {itemsLength}
            </span>
        }
        <ShoppingCart className={`w-6 h-6  ${itemsLength > 0 ? "text-gray-700 " : "text-white"}`} />
        
      </button> </>
      }

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
