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
import MobileAddProduct from "../forms/MobileAddProduct";
import { Plus } from "lucide-react";

export default function ProductAddModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();


 
  

  return (
    <>
       <button onClick={onOpen} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add Product
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
              <ModalHeader>Add Product</ModalHeader>
              <ModalBody className="max-h-[100vh] overflow-y-auto">
              <MobileAddProduct isShow={isOpen}/>
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
