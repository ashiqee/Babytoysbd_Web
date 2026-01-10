"use client";
// redux/features/cart/cart.slice.ts
import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Types } from "mongoose";

export interface CartItem {
  image: string;
  _id: Types.ObjectId;
  productName: string;
  regularPrice: number;
  salePrice: number;
  quantity: number;
  images: string;
  category: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addProductCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity = Math.max(
          1,
          existingItem.quantity + action.payload.quantity
        );
      } else {
        state.items.push({ ...action.payload, quantity: Math.max(1, action.payload.quantity) });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
  console.log("Before:", state.items.map(i => i._id));
  console.log("Removing ID:", action.payload);

  state.items = state.items.filter((item:any) => item._id !== action.payload);

  console.log("After:", state.items.map(i => i._id));
},

    updateCartQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item:any) => item._id === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setCart, addProductCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

export const useCurrentCart = (state: RootState) => state.carts;
