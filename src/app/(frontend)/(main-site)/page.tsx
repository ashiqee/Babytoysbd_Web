import { TProduct } from "@/app/hooks/useProducts";
import HomePage from "../_components/pages/Homepage";
import BackToTopButton from "../_components/shared/BackToTopButton";
import WhatsApp from "../_components/shared/WhatsApp";
import CartButton from "../_components/shared/CartButton";
import BottomMenu from "@/components/BottomMenu";
import CartSidebar from "../_components/shared/CartSideBar";

// ✅ Static page with revalidation (ISR)
export const revalidate = 60; // revalidate every 60s (tune as needed)

export default async function Home() {
let products: TProduct[] = [];

try {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?limit=8`,
    { next: { revalidate: 60 } }
  );

  if (res.ok) {
    products = await res.json();
  }
} catch (error) {
  console.error("Home fetch failed:", error);
}


  if (!products) {
    return <div>Failed to load products</div>;
  }

 

  return (
    <section className="w-full">
      <HomePage featuredProducts={products} />
      <BackToTopButton/>
      <WhatsApp phoneNumber="8801623023940"/>
      {/* <CartButton/> */}
      <CartSidebar position={`bottom-32 right-2`}/>
       <BottomMenu/>
    </section>
  );
}
