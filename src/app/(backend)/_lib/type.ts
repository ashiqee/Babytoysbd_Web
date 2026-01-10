// lib/types.ts

import { IProduct } from "@/lib/models/products/Product";



export interface OrderProduct {
  name: string;
  size?: string;
  img?:string;
  quantity: number;
  price: number;
  tax?: number;
  status: string;
}