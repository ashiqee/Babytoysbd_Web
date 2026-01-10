"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

interface TrackingOrder {
  id: string;
  status: "Processing" | "Shipped" | "Out for Delivery" | "Delivered";
  date: string;
  customerName: string;
  address: string;
  items: { name: string; qty: number; price: number }[];
}

const mockTrackOrders: Record<string, TrackingOrder> = {
  "1001": {
    id: "ORD-1001",
    status: "Shipped",
    date: "2025-06-21",
    customerName: "John Doe",
    address: "123 Main St, Dhaka, Bangladesh",
    items: [
      { name: "Sneakers", qty: 1, price: 80 },
      { name: "Socks", qty: 2, price: 10 },
    ],
  },
  "1031": {
    id: "ORD-1031",
    status: "Delivered",
    date: "2025-06-18",
    customerName: "Jane Smith",
    address: "456 Elm St, Chittagong, Bangladesh",
    items: [{ name: "Backpack", qty: 1, price: 120 }],
  },
};

const statusSteps: TrackingOrder["status"][] = [
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export default function TrackOrderPage() {
    const {id} = useParams()
 

  const [order, setOrder] = useState<TrackingOrder | null>(null);
 
  

  useEffect(() => {
    if (id) {
      setOrder(mockTrackOrders[id as string] || null);
    }
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Tracking info not found.</p>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen p-6 sm:p-10 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Track Order</h1>

      {/* Order Info */}
      <div className="bg-white p-5 rounded shadow mb-8">
        <p className="text-sm text-gray-500 mb-1">Order ID: {order.id}</p>
        <p className="text-sm text-gray-500 mb-1">Placed On: {order.date}</p>
        <p className="text-sm text-gray-500 mb-1">Customer: {order.customerName}</p>
        <p className="text-sm text-gray-500">Address: {order.address}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          {statusSteps.map((step, i) => (
            <div key={step} className="w-1/4 text-center">
              {step}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          {statusSteps.map((step, i) => (
            <div
              key={step}
              className={`h-3 w-1/4 relative ${
                i <= currentStepIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              {i < statusSteps.length - 1 && (
                <div className="absolute right-0 top-0 h-3 w-1 border-r-2 border-white" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white p-5 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <ul className="space-y-2">
          {order.items.map((item, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex justify-between">
              <span>
                {item.qty} × {item.name}
              </span>
              <span>${item.qty * item.price}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-700 mt-4 font-medium">
          Total: $
          {order.items.reduce((sum, i) => sum + i.qty * i.price, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
