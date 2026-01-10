
import React from "react";
import { landingSite } from "../config/landingSite";
import { Checkbox, Divider } from "@heroui/react";

interface OrderDetailsProps {
  productName: string;
  productQuantity: number;
  subtotal: number;
  shipping: {
    outsideDhaka: number;
    insideDhaka: number;
  };
  total: number;
  discount:number;
  paymentMethod: string;
  paymentInfo: string;
  setLocation: (location: number) => void;
  location: number;
  setTotalPrice: (totalPrice: number) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  productName,
  setLocation,
  productQuantity,
  subtotal,
  shipping,
  discount,
  total,
  paymentMethod,
  paymentInfo,
  location,
  setTotalPrice,
}) => {
  const handleLocationChange = (checked: boolean, newLocation: number) => {
    if (checked) {
      setLocation(newLocation);
      setTotalPrice(landingSite.orderData.subtotal + newLocation);
    } else if (location === newLocation) {
      const defaultLocation = landingSite.orderData.shipping.insideDhaka;

      setLocation(defaultLocation);
      setTotalPrice(landingSite.orderData.subtotal + defaultLocation);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 md:p-6 border text-sm md:text-md border-gray-300 rounded-lg shadow-lg bg-sky-400/5">
      <h2 className="text-2xl font-bold mb-4">Your Order</h2>

      <div className="mb-4">
        <div className="flex justify-between">
          <span>Product</span>
          <span>Subtotal</span>
        </div>
        <div className="flex text-sm md:text-md justify-between border-b border-gray-300 py-2">
          <span>
            {productName} (× {productQuantity}) 
          </span>
          <span>৳ {subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <span>Subtotal</span>
        <span>৳ {subtotal.toFixed(2)}</span>
      </div>

      <div className="mb-4">
        <span>Shipping</span>
        <ul className="space-y-2 ">
        <li  className={`${location === shipping.outsideDhaka ? "bg-sky-400/45": "bg-slate-500/25"}  px-2 pt-2 pb-1 hover:bg-sky-400/45  text-[9px] rounded-md`}>
        <Checkbox
        color="danger"
              isSelected={location === shipping.outsideDhaka}
              onChange={(checked) =>
                handleLocationChange(checked as any, shipping.outsideDhaka)
              }
            >
              Outside Dhaka City (ঢাকার বাহিরে): <br /> ৳ {shipping.outsideDhaka.toFixed(2)}
            </Checkbox>
          </li>
          <li  className={`${location === shipping.insideDhaka ? "bg-sky-400/45": "bg-slate-500/25"} px-2 pt-2 pb-1 hover:bg-sky-400/45  text-[9px]  rounded-md`}>
            <Checkbox
            color="danger"
              isSelected={location === shipping.insideDhaka}
              onChange={(checked) =>
                handleLocationChange(checked as any, shipping.insideDhaka)
              }
            >
              Inside Dhaka City (ঢাকার ভিতর): <br /> ৳ {shipping.insideDhaka.toFixed(2)}
            </Checkbox>
          </li>
        </ul>
      </div>

      <div className="flex text-sm justify-between font-bold ">
        <span className="text-sm" >Total</span>
        <span>৳{total+discount}</span>
      </div>
      <div className="flex text-sm justify-between font-bold ">
        <span className="text-sm" >Extra Discount</span>
        <span>- ৳{discount}</span>
      </div>
      <Divider/>
      <div className="flex text-2xl justify-between font-bold my-3">
        <span> Subtotal</span>
        <span>৳{total}</span>
      </div>

      <div className="bg-yellow-100/25 border border-yellow-400/25 p-4 rounded-lg mb-4">
        <p >{paymentMethod}</p>
        <p>{paymentInfo}</p>
      </div>

      <button className="w-full bg-pink-400 hover:bg-pink-500 text-white p-2 rounded">
        অর্ডার করুন ৳ {total}
      </button>
    </div>
  );
};

export default OrderDetails;
