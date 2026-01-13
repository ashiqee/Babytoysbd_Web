import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";


import AddToCartButton from '../pages/products/AddToCartButton';
import { useState } from "react";
import { Button } from "@heroui/react";

export interface TProduct {
  images: any;
  productName: string | undefined;
  regularPrice: any;
  salePrice: any;
  stockStatus: string;
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

interface ProductCardProps {
  product: TProduct;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
 
  const [isLiked, setIsLiked] = useState(false);
   const regularPrice = parseFloat(product.regularPrice as string) || 0;
  const salePrice = product.salePrice ? parseFloat(product.salePrice as string) : 0;
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-card mb-4">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-3 py-1 bg-foreground text-background text-xs font-medium rounded-full">
              New
            </span>
          )}
          {product.isSale && (
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              Sale
            </span>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:bg-background"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isLiked ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
        </button>

        {/* Image */}
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.productName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Quick Add */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <AddToCartButton cardBtn={true} product={product} qShow={false} inStock={product.stockStatus === "In Stock"} />
          {/* <Button
            onPress={() =>
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              })
            }
            className="w-full h-12 bg-background/90 backdrop-blur-sm text-foreground hover:bg-background font-medium"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button> */}
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{product.category}</p>
        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
          {product.productName}
        </h3>
        <div className="flex items-center gap-2">
            {salePrice && <span className="font-semibold text-foreground">${salePrice.toFixed(2)}</span>}
          
          {regularPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${regularPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;