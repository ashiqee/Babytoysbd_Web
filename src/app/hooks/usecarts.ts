// hooks/usecarts.ts
"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { 
  addProductCart, 
  removeFromCart, 
  updateCartQuantity, 
  clearCart as clearCartAction, 
  setCart, 
  CartItem,
  useCurrentCart
} from "@/redux/features/cart/cart.slice";
import { useAppSelector } from "@/redux/hook";




export const useCarts = () => {
  const dispatch = useDispatch();
 const { items } = useAppSelector(useCurrentCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
//   useEffect(() => {
//     const savedCart = localStorage.getItem('cart');
//     if (savedCart) {
//       try {
//         const parsedCart = JSON.parse(savedCart);
//         dispatch(setCart(parsedCart));
//       } catch (error) {
//         console.error('Failed to parse cart from localStorage', error);
//         localStorage.removeItem('cart');
//       }
//     }
//   }, [dispatch]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Add product to cart
  const addToCart = (product: any) => {
    dispatch(addProductCart(product));
  };

  // Remove item from cart
  const removeItem = (id: any) => {
  dispatch(removeFromCart(id));
};

  // Update item quantity - FIXED: removed duplicate parameters
  const updateQuantity = (productId: any, quantity: number) => {
    dispatch(updateCartQuantity({ productId, quantity }));
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch(clearCartAction());
    localStorage.removeItem('cart');
  };

  // Save item for later
  const saveForLater = (productId: any) => {
    // Remove from cart first
    const itemToSave = items.find(item => item._id === productId);
    if (itemToSave) {
      removeItem(productId);
      
      // Save to localStorage for later
      const savedForLater = JSON.parse(localStorage.getItem('savedForLater') || '[]');
      savedForLater.push(itemToSave);
      localStorage.setItem('savedForLater', JSON.stringify(savedForLater));
    }
  };

  // Apply coupon code
  const applyCoupon = (couponCode: string) => {
    // In a real implementation, this would validate the coupon with your backend
    const validCoupons: Record<string, { discount: number; message: string }> = {
      'SAVE10': { discount: 100, message: '10% discount applied!' },
      'WELCOME20': { discount: 200, message: 'Welcome discount applied!' },
      'FIRSTORDER': { discount: 300, message: 'First order discount applied!' },
    };
    
    const coupon = validCoupons[couponCode.toUpperCase()];
    
    if (coupon) {
      return { 
        success: true, 
        discount: coupon.discount, 
        message: coupon.message 
      };
    } else {
      return { 
        success: false, 
        discount: 0, 
        message: 'Invalid coupon code' 
      };
    }
  };



  // Cart modal controls
  const openCartModal = () => setIsCartOpen(true);
  const closeCartModal = () => setIsCartOpen(false);

  const isInCart= (id:any)=>{
    const cartItem = items.find((item) => item._id === id);
     return  !!cartItem;
  }

  return {
    items,
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
    saveForLater,
    applyCoupon,
    isCartOpen,
    openCartModal,
    closeCartModal,
    isInCart
  };
};