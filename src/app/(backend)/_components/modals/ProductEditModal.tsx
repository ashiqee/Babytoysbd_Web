"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { IProduct } from "@/lib/models/products/Product";
import ProductEditForm from "../forms/ProductEditForm";
import ProductEditTabs from "../tabs/ProductEditTab";
import { Pencil } from "lucide-react";
import { useProducts } from "@/app/hooks/useProducts";
import { useProductsBk } from "@/app/hooks/useProductsBk";
import { Types } from "mongoose";

export default function ProductEditModal({ product }: { product: IProduct }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [initialProduct, setInitialProduct] = useState<IProduct | null>(null);
  const {refresh,updateProduct}=useProductsBk()

  useEffect(() => {
    if (product) {
      setInitialProduct(product);
    }
  }, [product]);

const handleSave = async (updatedProduct: IProduct) => {
  const toastId = toast.loading("Updating product...");
  const id = product._id 
  const success = await updateProduct(id , updatedProduct);

  if (success) {
    toast.success("Product updated!", { id: toastId });
    onOpenChange(); // close modal
  } else {
    toast.error("Update failed", { id: toastId });
  }
};
  return (
    <>
      <button
        onClick={onOpen}
        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        <Pencil className="h-5 w-5" />
      </button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Product</ModalHeader>
              <ModalBody className="max-h-[98vh] overflow-y-auto">
                {initialProduct && (
                  <ProductEditTabs
                    defaultValues={initialProduct}
                    onSubmitHandler={handleSave}
                    onCancel={onClose}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
