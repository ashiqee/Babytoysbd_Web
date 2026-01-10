import AddProductForm from "@/app/(backend)/_components/forms/AddProductForm";
import MobileAddProduct from "@/app/(backend)/_components/forms/MobileAddProduct";


export default function AddProductPage() {
  return (
    <main className=" dark:bg-[#0D1117] ">
      <AddProductForm />
      {/* <MobileAddProduct/> */}
    </main>
  );
}
