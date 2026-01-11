'use client'
// components/CartModal.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Image from "next/image";
import { useCarts } from "@/app/hooks/usecarts";
import { toast } from "react-hot-toast";
import { LockIcon, Minus, Plus, ShoppingBag, Trash } from "lucide-react";
import ShimmerButton from "../_ui/ShimmerButton";
import { ScrollShadow } from "@heroui/react";
import { FaMarker } from "react-icons/fa";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const { items, updateQuantity, removeItem, clearCart } = useCarts();
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);


  // Calculate cart totals
  const subtotal = items.reduce(
    (total, item) =>
      total + (item.salePrice || item.regularPrice) * item.quantity,
    0
  );
  const shipping = subtotal >= 5000 ? 0 : 120; // Free shipping over ৳5000
  const total = subtotal + shipping - promoDiscount;

  // Handle promo code application
  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    setIsApplyingPromo(true);

    // Simulate API call
    setTimeout(() => {
      const validCoupons: Record<
        string,
        { discount: number; message: string }
      > = {
        SAVE10: { discount: 100, message: "10% discount applied!" },
        WELCOME20: { discount: 200, message: "Welcome discount applied!" },
        FIRSTORDER: { discount: 300, message: "First order discount applied!" },
      };

      const coupon = validCoupons[promoCode.toUpperCase()];

      if (coupon) {
        setPromoDiscount(coupon.discount);
        toast.success(coupon.message);
      } else {
        toast.error("Invalid promo code");
      }

      setIsApplyingPromo(false);
    }, 800);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsCheckingOut(true);

    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      onClose();
      // Navigate to checkout page
      window.location.href = "/checkout";
    }, 1000);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Reset promo code when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPromoCode("");
      setPromoDiscount(0);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute  inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            className="relative bg-white dark:bg-gray-900 rounded-md shadow-lg w-full max-w-3xl p-6 z-10"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()} // prevent backdrop close
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 md:p-6 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingBag className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h2 className="md:text-2xl  font-bold text-gray-900 dark:text-white">
                      Your Shopping Cart
                    </h2>
                    <p className="text-gray-600 text-xs dark:text-gray-300">
                      {items.length} {items.length === 1 ? "item" : "items"} in
                      your cart
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full z-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaMarker className="h-6 w-6  text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Cart Content */}
            <div className="pt-3">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <ShoppingBag className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Add some products to your cart
                  </p>
                  <button
                    onClick={onClose}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <ScrollShadow hideScrollBar className="space-y-4 max-h-96 mt-4 md:mt-0">

                    {items.map((item,i) => (
                      <motion.div
                        key={i}
                        className="flex items-center space-x-4 rounded-md bg-gray-50/75 p-2  "
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Product Image */}
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={item.image}
                            alt={`${i+1}`}
                            fill
                            className="w-full h-full object-cover"
                          />
                          {item.salePrice && (
                            <div className="absolute -top-1 -left-1 bg-red-500/75 text-white text-[9px] font-bold p-1.5 rounded-br-full">
                              -
                              {Math.round(
                                (1 - item.salePrice / item.regularPrice) * 100
                              )}
                              %
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-xs  md:text-sm text-gray-900 dark:text-white line-clamp-2">
                            {item.productName}
                          </h3>
                          <p className="text-xs hidden text-gray-500 dark:text-gray-400 mt-1">
                            {item.category}
                          </p>

                          <div className="flex items-center mt-2">
                            {item.salePrice ? (
                              <>
                                <span className="text-md font-bold text-gray-900 dark:text-white">
                                  ৳{item?.salePrice?.toLocaleString()}
                                </span>
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                                  ৳{item?.regularPrice?.toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-gray-900 dark:text-white">
                                ৳{item?.regularPrice?.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex  relative flex-col-reverse justify-between h-full   items-end space-x-2">
                          <div className="flex  items-center border border-gray-300 dark:border-gray-600 rounded-md">
                            <button
                              className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-2 py-1 text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item._id)}
                            className="p-1.5 absolute bottom-8 -right-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  
                  </ScrollShadow>
                  

                  {/* Promo Code Section */}
                  <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h3 className="font-medium text-xs md:text-sm text-gray-900 dark:text-white mb-2">
                      Promo Code
                    </h3>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-1 text-xs md:text-sm px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={handleApplyPromoCode}
                        disabled={isApplyingPromo}
                        className="px-4 py-2 text-xs md:text-sm bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 transition-colors"
                      >
                        {isApplyingPromo ? "Applying..." : "Apply"}
                      </button>
                    </div>
                    {promoDiscount > 0 && (
                      <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                        Promo discount: ৳{promoDiscount.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Subtotal</span>
                      <span>৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Shipping</span>
                      <div className="flex items-center">
                        {shipping === 0 ? (
                          <span className="text-green-600 dark:text-green-400">
                            Free
                          </span>
                        ) : (
                          <span>৳{shipping.toLocaleString()}</span>
                        )}
                        {subtotal < 5000 && (
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            (Free shipping over ৳5000)
                          </span>
                        )}
                      </div>
                    </div>
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Discount</span>
                        <span>-৳{promoDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t dark:border-gray-700 pt-3 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>৳{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="mt-3 flex flex-col sm:flex-row gap-3">
                    <ShimmerButton
  onClick={handleCheckout}
  disabled={isCheckingOut}
  className="flex-1 px-6 py-2  rounded-md font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-75 transition-colors"
>
  {isCheckingOut ? (
    <>
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      Processing...
    </>
  ) : (
    <>
      <LockIcon className="h-5 w-5 mr-2" />
      Secure Checkout
    </>
  )}
</ShimmerButton>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 border  border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>

                  {/* Security & Shipping Info */}
                  <div className="mt-6 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center mr-4">
                      <Trash className="h-4 w-4 mr-1" />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center">
                      <LockIcon className="h-4 w-4 mr-1" />
                      <span>Secure Payment</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
