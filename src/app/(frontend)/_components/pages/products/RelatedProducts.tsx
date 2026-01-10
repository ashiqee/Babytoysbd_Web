// components/RelatedProducts.tsx

import { dbConnect } from "@/lib/db/dbConnect";
import { Product } from "@/lib/models/products/Product";
import ProductCard from "../../cards/ProductCards";
import { TProduct } from "@/app/hooks/useProducts";
import ProductShowcaseHorizontal from "../../showcase/ProductShowcaseHorizontal";



interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

async function getRelatedProducts(category: string, currentProductId: string) {
  await dbConnect();
  
  try {
    const products = await Product.find({
      category,
      _id: { $ne: currentProductId },
      status: 'published'
    })
    .limit(5)
    .lean();
    
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export default async function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const relatedProducts = await getRelatedProducts(category, currentProductId);
  
  if (relatedProducts.length === 0) {
    return null;
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 ">Related Products</h2>
       <ProductShowcaseHorizontal title="" products={relatedProducts}/>
      {/* <div className="grid grid-cols-2  lg:grid-cols-4 2xl:grid-cols-5 gap-6">
       
        {relatedProducts.map((product: TProduct) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div> */}
    </div>
  );
}