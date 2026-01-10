// components/AddToCartButton.tsx
"use client";
import { useState, useEffect } from "react";
import {
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { TProduct } from "@/app/hooks/useProducts";
import { useCarts } from "@/app/hooks/usecarts";
import CartModal from "../../_modals/CartModal";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Popover, Tooltip } from "@heroui/react";


import { trackAddToCart } from "@/lib/db/GTM/gtm";

interface AddToCartButtonProps {
  product: TProduct | any;
  inStock: boolean;
  qShow: boolean;
  cardBtn: boolean;
}

export default function AddToCartButton({
  product,
  inStock,
  qShow,
  cardBtn,
}: AddToCartButtonProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const {
    addToCart,
    items,
    updateQuantity,
    removeItem,
    openCartModal,
    closeCartModal,
    isCartOpen,
  } = useCarts();

  // Check if item is in cart and get its details
  const cartItem = items.find((item) => item._id === product._id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  // Sync local quantity with cart quantity when component mounts or cart changes
  useEffect(() => {
    if (isInCart) {
      setQuantity(cartQuantity);
    } else {
      setQuantity(1);
    }
  }, [isInCart, cartQuantity]);

   useEffect(() => {
    setMounted(true); // now it's safe to render client-only content
  }, []);

  const handleAddToCart = async () => {
    if (!inStock) return;
    setIsAdding(true);

    try {
      const cartItem = {
        _id: product._id,
        productName: product.productName,
        image: product.images?.[0] || "",
        regularPrice: Number(product.regularPrice),
        salePrice: product.salePrice ? Number(product.salePrice) : undefined,
        category: product.category,
        slug: product.slug,
        quantity, // ✅ take from state
      };

      await addToCart(cartItem);

        
  // Track with GTM
  trackAddToCart(product);

     
      
      // Get the price to use for tracking (salePrice if available, otherwise regularPrice)
      const price = product.salePrice ? Number(product.salePrice) : Number(product.regularPrice);
      
 

      toast.success(
        <div className="flex items-center">
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          <span>
            Added {quantity} {quantity === 1 ? "item" : "items"} to cart
          </span>
        </div>
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddOneMore = async () => {
    if (!inStock) return;

    setIsAdding(true);
    try {
      await updateQuantity(product._id, cartQuantity + 1);
      
     
      
      // Get the price to use for tracking
      const price = product.salePrice ? Number(product.salePrice) : Number(product.regularPrice);
      
 
      
      toast.success("Added one more item to cart");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFromCart = async () => {
    setIsAdding(true);
    try {
      await removeItem(product._id);
      
           
      // Get the price to use for tracking
      const price = product.salePrice ? Number(product.salePrice) : Number(product.regularPrice);
      
 
      
      toast.success("Item removed from cart");
      // Reset quantity to 1 after removing from cart
      setQuantity(1);
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item");
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);

    // If item is in cart, update the cart quantity as well
    if (isInCart && newQuantity !== cartQuantity) {
      setIsAdding(true);
      Promise.resolve()
        .then(() => {
          updateQuantity(product._id, newQuantity);
          
                
       
        })
        .then(() => {
          toast.success("Quantity updated");
        })
        .catch((error: any) => {
          console.error("Error updating quantity:", error);
          toast.error("Failed to update quantity");
          // Revert local quantity if update failed
          setQuantity(cartQuantity);
        })
        .finally(() => {
          setIsAdding(false);
        });
    }
  };

  return (
    <div>
      <div className="flex items-center relative z-20">
        {qShow && !isInCart && (
          <div className="flex items-center border border-gray-300 rounded-md mr-4">
            <button
              className="px-3 py-1.5 dark:text-black text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isAdding}
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="px-3 dark:text-black py-2 w-12 text-center">
              {quantity}
            </span>
            <button
              className="px-3 py-1.5 dark:text-black text-gray-600 hover:bg-gray-100"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={isAdding}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {!cardBtn ? (
          <div className="flex items-center gap-2">
            {isInCart ? (
              <>
                <button
                  onClick={openCartModal}
                  disabled={!inStock || isAdding}
                  className=" relative flex items-center justify-center px-4 py-2 rounded-full
              text-white font-medium shadow-md hover:shadow-lg
              bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700
              transform hover:scale-105 active:scale-95 transition-all duration-300
              overflow-hidden group"
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  In Cart
                  {cartQuantity > 0 && (
                    <span className="ml-1 bg-green-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartQuantity}
                    </span>
                  )}
                        {/* Shimmer effect */}
            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"/>
          
                </button>

                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    className="px-2 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={isAdding}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="px-2 py-1.5 w-10 text-center">
                    {cartQuantity}
                  </span>
                  <button
                    className="px-2 py-1.5 text-gray-600 hover:bg-gray-100"
                    onClick={handleAddOneMore}
                    disabled={isAdding}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="px-2 py-1.5 text-gray-600 hover:bg-gray-100"
                    onClick={handleRemoveFromCart}
                    disabled={isAdding}
                  >
                    <Trash className="h-4 text-red-500 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!inStock || isAdding}
                className={`flex relative items-center justify-center px-4 py-2 rounded-full font-medium transition-colors ${
                  inStock && !isAdding
                    ? `bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:from-yellow-500 hover:to-yellow-600 
                    transform hover:scale-105 active:scale-95 transition-all duration-300
              overflow-hidden group
                    
                    `
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isAdding ? (
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
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
                              {/* Shimmer effect */}
            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"/>
          
              </button>
            )}
          </div>
        ) : (
          <motion.button
            onClick={isInCart ? () => removeItem(product._id) : handleAddToCart}
            disabled={!inStock || isAdding}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`w-10 h-9  text-xs flex items-center justify-center rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 relative ${
              isInCart
                ? "bg-green-500 text-white"
                : inStock
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900"
                  : "bg-gray-300 text-gray-500"
            }`}
          >
            {isAdding ? (
              <svg
                className="animate-spin h-5 w-5 text-current"
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
            ) : (
              <>
                <Tooltip
                  content={`${isInCart ? "Remove from cart" : inStock ? "Add to cart" : "Out of stock"}`}
                >
                  <ShoppingCartIcon className="h-5 w-5 " />
                </Tooltip>
                { mounted && isInCart && (
                  <p className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartQuantity}
                  </p>
                )}
              </>
            )}
          </motion.button>
        )}
      </div>

      
      {/* Cart Modal */}
      {isCartOpen && <CartModal isOpen={isCartOpen} onClose={closeCartModal} />}
    </div>
  );
}