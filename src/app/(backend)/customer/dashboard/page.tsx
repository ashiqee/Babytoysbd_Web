'use client'
import { useEffect, useState } from "react";

interface CustomerStats {
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

interface Order {
  id: string;
  date: string;
  status: "Delivered" | "Pending" | "Cancelled";
  total: number;
  trackingUrl: string;
  invoiceUrl: string;
  items: { name: string; qty: number; price: number }[];
}

const dummyCustomerStats: CustomerStats = {
  totalOrders: 34,
  deliveredOrders: 28,
  pendingOrders: 4,
  cancelledOrders: 2,
  totalSpent: 12500,
  lastOrderDate: "2025-06-15",
};

const dummyRecentOrders: Order[] = [
  {
    id: "ORD1234",
    date: "2025-06-20",
    status: "Delivered",
    total: 120,
    trackingUrl: "#",
    invoiceUrl: "#",
    items: [
      { name: "Sneakers", qty: 1, price: 80 },
      { name: "Socks", qty: 2, price: 20 },
    ],
  },
  {
    id: "ORD1235",
    date: "2025-06-18",
    status: "Pending",
    total: 89,
    trackingUrl: "#",
    invoiceUrl: "#",
    items: [{ name: "T-Shirt", qty: 1, price: 89 }],
  },
];

export default function CustomerDashboard() {
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setStats(dummyCustomerStats);
      setRecentOrders(dummyRecentOrders);
    }, 1000);
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back!</h1>
      <p className="text-gray-600 mb-6">Here’s a snapshot of your shopping activity.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard title="Total Orders" value={stats.totalOrders} icon="🛒" />
        <StatCard title="Delivered" value={stats.deliveredOrders} icon="📦" />
        <StatCard title="Pending" value={stats.pendingOrders} icon="⏳" />
        <StatCard title="Cancelled" value={stats.cancelledOrders} icon="❌" />
        <StatCard title="Total Spent" value={`$${stats.totalSpent.toLocaleString()}`} icon="💰" />
        <StatCard title="Last Order" value={stats.lastOrderDate} icon="📅" />
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base text-left border-t border-gray-200">
            <thead>
              <tr className="text-gray-500">
                <th className="py-2 px-3 border-b">Order ID</th>
                <th className="py-2 px-3 border-b">Date</th>
                <th className="py-2 px-3 border-b">Status</th>
                <th className="py-2 px-3 border-b">Total</th>
                <th className="py-2 px-3 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-2 px-3 border-b font-medium">{order.id}</td>
                  <td className="py-2 px-3 border-b">{order.date}</td>
                  <td className="py-2 px-3 border-b">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-2 px-3 border-b">${order.total.toFixed(2)}</td>
                  <td className="py-2 px-3 border-b text-right space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Details
                    </button>
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline text-xs"
                    >
                      Track
                    </a>
                    <a
                      href={order.invoiceUrl}
                      className="text-green-600 hover:underline text-xs"
                      download
                    >
                      Invoice
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md shadow-xl relative">
            <button
              className="absolute top-2 right-3 text-gray-600 text-xl"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-2">Order Details</h3>
            <p className="text-sm text-gray-500 mb-4">Order ID: {selectedOrder.id}</p>
            <ul className="space-y-2">
              {selectedOrder.items.map((item, i) => (
                <li key={i} className="text-sm text-gray-700">
                  {item.qty}x <span className="font-medium">{item.name}</span> — ${item.price}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Total:</strong> ${selectedOrder.total}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3 sm:space-x-4 hover:shadow-lg transition-shadow">
      <div className="text-2xl sm:text-3xl">{icon}</div>
      <div>
        <p className="text-gray-500 text-xs sm:text-sm font-semibold">{title}</p>
        <p className="text-lg sm:text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  const base = "px-2 py-1 text-xs rounded font-medium";
  const color =
    status === "Delivered"
      ? "bg-green-100 text-green-700"
      : status === "Pending"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return <span className={`${base} ${color}`}>{status}</span>;
}
