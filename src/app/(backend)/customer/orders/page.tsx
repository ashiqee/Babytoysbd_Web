'use client'
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";

interface Order {
  id: string;
  date: string;
  status: "Delivered" | "Pending" | "Cancelled";
  total: number;
  trackingUrl: string;
  items: { name: string; qty: number; price: number }[];
}

const allOrdersMock: Order[] = Array.from({ length: 52 }).map((_, i) => ({
  id: `ORD-${1000 + i}`,
  date: format(new Date(2025, 5, Math.max(1, 30 - (i % 30))), "yyyy-MM-dd"),
  status: i % 3 === 0 ? "Delivered" : i % 3 === 1 ? "Pending" : "Cancelled",
  total: Math.floor(Math.random() * 200 + 50),
  trackingUrl: `/customer/orders/${1000 + i}`,
  items: [
    { name: "Product A", qty: 1, price: 40 },
    { name: "Product B", qty: 2, price: 30 },
  ],
}));

const PAGE_SIZE = 10;

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "status">("date");
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    let filtered = allOrdersMock;

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(order => new Date(order.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(order => new Date(order.date) <= new Date(endDate));
    }

    // Search
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortAsc ? diff : -diff;
      } else {
        return sortAsc
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
    });

    setOrders(filtered);
    setCurrentPage(1);
  }, [startDate, endDate, searchQuery, sortBy, sortAsc]);

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const paginatedOrders = orders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">All Orders ({orders.length})</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label htmlFor="date" className="block text-sm text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            className="border rounded px-3 py-2 text-sm"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            className="border rounded px-3 py-2 text-sm"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="search" className="block text-sm text-gray-600 mb-1">Search Order ID</label>
          <input
            type="text"
            className="border rounded px-3 py-2 text-sm w-44"
            placeholder="e.g. ORD-1005"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="sort" className="block text-sm text-gray-600 mb-1">Sort</label>
          <select
            className="border rounded px-3 py-2 text-sm"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
          >
            <option value="date">Date</option>
            <option value="status">Status</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortAsc" className="block text-sm text-gray-600 mb-1 invisible">Order</label>
          <button
            className="px-3 py-2 text-sm border rounded bg-white hover:bg-gray-100"
            onClick={() => setSortAsc(prev => !prev)}
          >
            {sortAsc ? "Asc ↑" : "Desc ↓"}
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left border-t">
          <thead className="text-gray-600 bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Total</th>
              <th className="py-2 px-4 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              paginatedOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b font-medium">{order.id}</td>
                  <td className="py-2 px-4 border-b">{order.date}</td>
                  <td className="py-2 px-4 border-b">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-2 px-4 border-b">${order.total}</td>
                  <td className="py-2 px-4 border-b text-right space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Details
                    </button>
                    <Link
                      href={order.trackingUrl}
                      className="text-indigo-600 hover:underline text-xs"
                      target="_blank"
                    >
                      Track
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2 text-sm">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Order Detail Modal */}
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
            <Link
              href={`/customer/orders/${selectedOrder.trackingUrl}`}
              className="mt-4 inline-block text-blue-600 hover:underline text-sm"
              target="_blank"
            >
              View Tracking Page →
            </Link>
          </div>
        </div>
      )}
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
