"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Image } from "@heroui/react";
import toast from "react-hot-toast";

import LNInput from "./form/LNInput";
import LNTextArea from "./form/LNTextArea";
import OrderDetails from "./OrderDetails";

import { landingSite } from "../config/landingSite";

function getOfferFromCookie(): number {
  const match = document.cookie.match(/(?:^|;\s*)offer=(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

const OrderForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Loading state
  const [location, setLocation] = useState<number>(
    landingSite.orderData.shipping.insideDhaka
  );
  const [offer, setOffer] = useState<number>(0);
  const [selectedColor, setColor] = useState<string>(
    landingSite.productDetails.colorOption[0].color
  );
  const [totalPrice, setTotalPrice] = useState<number>(
    landingSite.orderData.subtotal + location
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const discount = Math.round((landingSite.orderData.subtotal * offer) / 100);

useEffect(() => {
  const updateOfferAndPrice = () => {
    const offerValue = getOfferFromCookie();
    setOffer(offerValue);

    const subtotal = landingSite.orderData.subtotal;
    const discount = Math.round((subtotal * offerValue) / 100);
    const total = subtotal + location - discount;

    setTotalPrice(total);
  };

  // Run immediately
  updateOfferAndPrice();

  // Set interval to run every 3 minutes (180000ms)
  const interval = setInterval(updateOfferAndPrice, 3 * 60 * 1000);

  return () => clearInterval(interval);
}, [location]);


  const onSubmit = async (data: any) => {
    setLoading(true); // Start loading

    const orderPayload = {
      customer: {
        fullName: data.name,
        mobileNumber: data.phone,
        address: data.address,
      },
      products: {
        productId: "685ac8253b556f1a4956cd9c",
        name: "Caste Tent House",
        price: 2350,
        color: selectedColor,
        quantity: 1,
        image:
          selectedColor === "blue"
            ? landingSite.productDetails.colorOption[1].img
            : landingSite.productDetails.colorOption[0].img,
      },
      productPrice: totalPrice,
      getDiscount: offer,
      shippingCost: location,
      itemsQty: 1,
      customerNote: data.customerNote,
      color: selectedColor,
    };

    try {
      const response = await fetch(`/api/orders/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const result = await response.json();
      const { order } = result.data;

      const orderData = {
        itemsQty: order.itemsQty,
        orderId: order.orderId,
        fullName: order.customer.fullName,
        mobile: order.customer.mobileNumber, // Now in +88 E.164 format
        totalAmount: order.totalAmount,
      };

      // ✅ Fire Facebook Purchase event
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Purchase", {
          content_name: "Castle Tent House",
          value: totalPrice, // Includes shipping
          currency: "BDT",
        });
      }
      

      localStorage.setItem("orderDetails", JSON.stringify(orderData));
      router.push(`/order-success/${orderData.orderId}`);
      toast.success("Order created successfully");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Order failed. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div
      className="my-10 container border border-sky-500/45 shadow-sky-500/10 mx-auto bg-sky-500/5 shadow-xl p-8 rounded-lg"
      id="order-form"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-sky-500">
        অর্ডার করতে নিচের ফর্মটি পূরণ করুন
      </h2>

      <div className="relative">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-sky-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              <span className="text-sky-600 font-semibold">
                অর্ডার প্রসেস হচ্ছে...
              </span>
            </div>
          </div>
        )}

        {/* Order form */}
        <form
          className={`text-left md:flex gap-4 text-md w-full transition-all duration-300 ${
            loading ? "blur-sm pointer-events-none" : ""
          }`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full">
            <div className="mb-4">
              <LNInput
                error={errors.name}
                label="আপনার নাম"
                placeholder="আপনার নাম লিখুন"
                register={register("name", { required: "Name is required" })}
                type={"text"}
              />
            </div>

            <div className="mb-4">
              <LNInput
                error={errors.phone}
                label="আপনার মোবাইল নাম্বার"
                placeholder="আপনার মোবাইল নাম্বার লিখুন"
                register={register("phone", {
                  required: "Mobile no. is required",
                })}
                type={"phone"}
              />
            </div>

            <div className="mb-4">
              <LNTextArea
                error={errors.address}
                label={"আপনার ঠিকানা"}
                placeholder="আপনার ঠিকানা লিখুন"
                register={register("address", {
                  required: "Delivery address is required",
                })}
              />
            </div>

            <div className="mb-4">
              <label className="text-sm flex gap-1 font-bold" htmlFor="color">
                প্রোডাক্ট কালার সিলেক্ট করুন
                <StarIcon className="fill-red-600" color="red" size={10} />
              </label>
              <ul className="flex gap-4 my-2">
                {landingSite.productDetails.colorOption.map((item, i) => (
                  <li key={i}>
                    <Image
                      className={`${
                        selectedColor === item.color &&
                        `border-4 ${
                          item.color === "blue"
                            ? "border-sky-500"
                            : "border-pink-300"
                        } shadow shadow-red-500`
                      } w-20 cursor-pointer`}
                      src={item.img}
                      onClick={() => setColor(item.color)}
                    />
                    {selectedColor === item.color && (
                      <p className="text-center uppercase">{item.color}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <LNTextArea
                error={errors.customerNote}
                label={"নোট"}
                placeholder="আপনার নোট লিখুন"
                register={register("customerNote")}
              />
            </div>
          </div>

          <div className="w-full">
            <OrderDetails
              location={location}
              paymentInfo={landingSite.orderData.paymentInfo}
              paymentMethod={landingSite.orderData.paymentMethod}
              productName={landingSite.orderData.productName}
              productQuantity={landingSite.orderData.productQuantity}
              setLocation={setLocation}
              setTotalPrice={setTotalPrice}
              discount={discount}
              shipping={landingSite.orderData.shipping}
              subtotal={landingSite.orderData.subtotal}
              total={totalPrice}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
