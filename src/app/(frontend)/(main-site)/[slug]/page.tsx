
// app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';


import { StarIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';

import { dbConnect } from '@/lib/db/dbConnect';
import { Product } from '@/lib/models/products/Product';
import ProductGallery from '@/app/(frontend)/_components/pages/products/ProductGallery';
import ProductVariations from '@/app/(frontend)/_components/pages/products/ProductVariations';
import AddToCartButton from '@/app/(frontend)/_components/pages/products/AddToCartButton';
import RelatedProducts from '@/app/(frontend)/_components/pages/products/RelatedProducts';
import WhatsAppButton from '../../_components/pages/products/WhatsAppButton';
import Link from 'next/link';
import ShareButton from '../../_components/shared/ShareBtn';
import WishlistButton from '../../_components/pages/products/WishListBtn';
import ProductBottomMenu from '../../_components/shared/ProductBottomMenu';



import GA4ViewContent from '../../_components/tracking/GA4ViewContent';
import CartSidebar from '../../_components/shared/CartSideBar';
import { trackViewItem } from '@/lib/db/GTM/gtm';

interface ProductPageProps {

   params: Promise<{
    slug: string;
  }>;
 
}

// Generate metadata for SEO
export async function generateMetadata( context: ProductPageProps): Promise<Metadata> {
  await dbConnect();

  
  try {
    const {slug} = await context.params
    const product = await Product.findOne({ slug: slug });
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      };
    }
    
    return {
      title: product.metaTitle || `${product.productName} | BabyToysBD`,
      description: product.metaDescription || `Buy ${product.productName} at the best price in Bangladesh. Fast delivery from BabyToysBD.`,
      keywords: product.keywords?.join(', ') || 'baby toys, kids toys, educational toys, Bangladesh',
      openGraph: {
        title: product.metaTitle || `${product.productName} | BabyToysBD`,
        description: product.metaDescription || `Buy ${product.productName} at the best price in Bangladesh.`,
        images: product.ogImage ? [product.ogImage] : [product.images?.[0] || '/placeholder-product.jpg'],
        url: `https://babytoysbd.com/${product.slug}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.metaTitle || `${product.productName} | BabyToysBD`,
        description: product.metaDescription || `Buy ${product.productName} at the best price in Bangladesh.`,
        images: product.ogImage ? [product.ogImage] : [product.images?.[0] || '/placeholder-product.jpg'],
      },
      alternates: {
        canonical: product.canonicalUrl || `https://babytoysbd.com/${product.slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product Details',
      description: 'View product details at BabyToysBD',
    };
  }
}

// Fetch product data
async function getProduct(slug: string) {
  await dbConnect();
  
  try {
    const product = await Product.findOne({ slug }).lean();
    
    if (!product) {
      return null;
    }
    
    // Convert MongoDB document to plain object and stringify ObjectId
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage(context: ProductPageProps) {
  const {slug} = await context.params
  const product = await getProduct(slug);
  
  if (!product) {
    notFound();
  }

   
  // Calculate discount percentage
  const regularPrice = parseFloat(product.regularPrice) || 0;
  const salePrice = parseFloat(product.salePrice) || 0;
   const finalPrice = salePrice > 0 ? salePrice : regularPrice;
  const discountPercentage = salePrice > 0 && regularPrice > 0 
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;
  
  // Check if product is in stock
  const inStock = product.stockStatus === 'In Stock' && (product.quantity || 0) > 0;
  
 
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50/5 to-white/5">
      <div className="container mx-auto px-4 md:px-0 md:pt-8 md:mt-0 mt-8 py-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="text-blue-600 hover:underline">Home</Link></li>
            <li className="text-gray-500">/</li>
            <li><Link href="/products" className="text-blue-600 hover:underline">Products</Link></li>
            <li className="text-gray-500">/</li>
            <li><Link href={`/categories/${product.category}`} className="text-blue-600 hover:underline">{product.category}</Link></li>
            <li className="text-gray-500">/</li>
            <li className="dark:text-yellow-50 text-gray-700 line-clamp-1">{product.productName}</li>
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Product Gallery */}
          <div className="bg-white rounded-md shadow-lg p-4">
            <ProductGallery images={product.images} productName={product.productName} />
          </div>
          
          {/* Product Details */}
          <div className="bg-white rounded-md shadow-lg p-6">
            <div className="mb-4">
              <h1 className="lg:text-2xl md:text-xl text-md font-bold text-gray-800 mb-2">{product.productName}</h1>
             <div className='flex justify-between'>
               <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    i < 4 ? (
                      <SolidStarIcon key={i} className="h-5 w-5" />
                    ) : (
                      <StarIcon key={i} className="h-5 w-5" />
                    )
                  ))}
                </div>
                <span className="text-gray-600">(4.0) • 24 Reviews</span>
              </div>
           <div className='flex gap-2 items-center'>
               <ShareButton product={product}/>
              <WishlistButton 
  product={product} 
/>
           </div>
             </div>
              
              <div className="flex items-center mb-4">
                {discountPercentage > 0 ? (
                  <>
                    <span className="text-2xl font-bold text-gray-800 mr-3">৳{salePrice.toFixed(2)}</span>
                    <span className="text-lg text-gray-500 line-through">৳{regularPrice.toFixed(2)}</span>
                    <span className="ml-3 bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-semibold">
                      {discountPercentage}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-800">৳{regularPrice.toFixed(2)}</span>
                )}
              </div>
              
              <div className="mb-6">
                <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </p>
                {product.brandName && (
                  <p className="text-gray-600 mt-2">Brand: <span className="font-medium">{product.brandName}</span></p>
                )}
                {product.sku && (
                  <p className="text-gray-600">SKU: <span className="font-medium">{product.sku}</span></p>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Sort Description</h3>
                <h2 className="text-gray-700 leading-relaxed">
                  {product.sortDescription || 'No description available for this product.'}
                </h2>
              </div>
              
              {/* Product Variations */}
              {product.variations && product.variations.length > 0 && (
                <ProductVariations variations={product.variations} />
              )}
              
              {/* Add to Cart Section */}
              <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center gap-4 mt-4">
                <AddToCartButton qShow={true} product={product} inStock={inStock} cardBtn={false} />
                 <WhatsAppButton product={product} inStock={inStock} />
                

              </div>
              
              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">Additional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.dimensions && (
                    <div>
                      <p className="text-gray-600 text-sm">Dimensions</p>
                      <p className="font-medium">{product.dimensions}</p>
                    </div>
                  )}
                  {product.weight && (
                    <div>
                      <p className="text-gray-600 text-sm">Weight</p>
                      <p className="font-medium">{product.weight}</p>
                    </div>
                  )}
                  {product.units && (
                    <div>
                      <p className="text-gray-600 text-sm">Units</p>
                      <p className="font-medium">{product.units}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600 text-sm">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs - Description, Specifications, Reviews */}
        <div className="bg-white rounded-md shadow-lg p-6 mb-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <Link href="#description" className="py-4 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
                Description
              </Link>
              <Link href="#specifications" className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Specifications
              </Link>
              <Link href="#reviews" className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Reviews (24)
              </Link>
            </nav>
          </div>
          
          <div className="py-3">
            <div id="description" className="prose max-w-none">
              <h3 className="text-xl font-semibold mb-4">Product Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'No detailed description available for this product.'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <RelatedProducts 
          category={product.category} 
          currentProductId={product._id} 
        />
      </div>
      <CartSidebar/>

      <ProductBottomMenu inStock={inStock} product={product} />

       <GA4ViewContent
        slug={slug}
        productId={product._id}
        productName={product.productName}
        price={finalPrice}
        category={product.category}
        
      />
    </div>
  );
}