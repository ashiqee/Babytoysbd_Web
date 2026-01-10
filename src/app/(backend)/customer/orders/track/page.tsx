"use client"
import { useState } from "react";

interface TrackingOrder {
  id: string;
  trackingId: string;
  status: "Processing" | "Shipped" | "Out for Delivery" | "Delivered";
  customerName: string;
  address: string;
  items: { name: string; qty: number; price: number }[];
  date: string;
  estimatedDelivery: string;
}

const mockOrders: TrackingOrder[] = [
  {
    id: "ORD-1001",
    trackingId: "TRK-001",
    status: "Shipped",
    customerName: "John Doe",
    address: "123 Main St, Dhaka",
    items: [
      { name: "Shoes", qty: 1, price: 80 },
      { name: "Hat", qty: 1, price: 20 },
    ],
    date: "2025-06-20",
    estimatedDelivery: "2025-06-26",
  },
  {
    id: "ORD-1002",
    trackingId: "TRK-002",
    status: "Delivered",
    customerName: "Jane Smith",
    address: "456 Market Rd, Chittagong",
    items: [{ name: "Bag", qty: 1, price: 150 }],
    date: "2025-06-15",
    estimatedDelivery: "2025-06-20",
  },
];

const statusSteps = [
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
] as const;

export default function TrackPage() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    const result = mockOrders.find(
      o => o.id.toLowerCase() === query.toLowerCase() || o.trackingId.toLowerCase() === query.toLowerCase()
    );
    if (result) {
      setOrder(result);
      setError("");
    } else {
      setOrder(null);
      setError("No tracking result found for that ID.");
    }
  };

  const currentStep = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <h1 className="text-2xl font-bold mb-4">Track Your Order</h1>

      {/* Search */}
      <div className="max-w-md mb-6">
        <label htmlFor="trk" className="block text-sm mb-1 text-gray-600">Enter Order ID or Tracking ID</label>
        <div className="flex">
          <input
            type="text"
            placeholder="e.g. ORD-1001 or TRK-001"
            className="flex-1 border rounded-l px-4 py-2 text-sm"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-r text-sm hover:bg-blue-700"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Tracking Info */}
      {order && (
        <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Order ID: {order.id}</p>
            <p className="text-sm text-gray-500">Tracking ID: {order.trackingId}</p>
            <p className="text-sm text-gray-500">Estimated Delivery: {order.estimatedDelivery}</p>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              {statusSteps.map(step => (
                <span key={step} className="w-1/4 text-center">
                  {step}
                </span>
              ))}
            </div>
            <div className="flex h-3 rounded overflow-hidden bg-gray-300">
              {statusSteps.map((_, i) => (
                <div
                  key={i}
                  className={`w-1/4 transition-all ${
                    i <= currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <h2 className="text-sm font-semibold mb-2">Order Summary</h2>
            <ul className="space-y-1 text-sm text-gray-700">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.qty} × {item.name} — ${item.qty * item.price}
                </li>
              ))}
            </ul>
            <p className="mt-3 font-medium text-sm">
              Total: $
              {order.items.reduce((sum, item) => sum + item.qty * item.price, 0).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
