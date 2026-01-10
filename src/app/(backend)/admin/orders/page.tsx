// pages/orders/index.tsx
"use client";

import { useEffect, useState } from "react";
import OrderDetailsModal from "../../_components/modals/OrderDetailsModal";
import { OrderProduct } from "../../_lib/type";
import toast from "react-hot-toast";
import OrderEditModal from "../../_components/modals/OrderEditModal";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Copy, Search, Filter, Calendar, Download } from "lucide-react";
import Link from "next/link";

// Types remain the same as in your original code

export default function InventoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hit, setHit] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [editOrder, setEditOrder] = useState<any | null>(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const itemsPerPage = 10;
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");

        const result = await res.json();

        // Map API response to frontend Order type
        const ordersFromApi: any[] = result.data.map((order: any) => ({
          id: order.orderId,
          _id: order._id,
          createdAt: new Date(order.createdAt).toLocaleString("en-BD", {
            timeZone: "Asia/Dhaka",
          }),
          customer: {
            fullName:
              `${order.customer?.firstName || ""} ${order?.customer?.lastName || ""}`.trim() ||
              "N/A",
            mobileNumber: order.customer.phone || order.mobileNumber || "N/A",
            address: order.address
              ? `${order.address.street || ""}, ${order.address.city || ""}, ${order.address.state || ""} ${order.address.zip || ""}, ${order.address.country || ""}`.trim()
              : "N/A",
          },
          priority: order.priority || "Normal",
          total: `${order.currency} ${order.totalAmount.toFixed(2)}`,
          paymentStatus: order.paymentStatus,
          itemsQty: order.items.length,
          deliveryCompany: order.deliveryCompany || "-",
          orderStatus: order.orderStatus,
          products: order.items,
          trackingHistory:
            order.trackingHistory?.map(
              (th: {
                status: any;
                timestamp: string | number | Date;
                description: any;
              }) => ({
                status: th.status,
                timestamp: new Date(th.timestamp).toLocaleString("en-BD", {
                  timeZone: "Asia/Dhaka",
                }),
                note: th.description,
              })
            ) || [],
        }));

        setOrders(ordersFromApi);
      } catch (err) {
        console.error(err);
        setError("Could not load orders.");
      } finally {
        setLoading(false);
        setHit(false);
      }
    };

    fetchOrders();
  }, [hit]);

  // Filtering logic
  const filteredOrders = orders.filter((order) => {
    const searchLower = debouncedSearch.toLowerCase();
    const id = order?.id?.toString().toLowerCase() ?? "";
    const mobile =
      order?.customer?.mobileNumber?.toString().toLowerCase() ?? "";
    const name = order?.customer?.fullName?.toLowerCase() ?? "";

    // Date filtering
    const orderDate = new Date(order.createdAt);
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;
    const dateMatch =
      (!startDate || orderDate >= startDate) &&
      (!endDate || orderDate <= endDate);

    // Status filtering
    const statusMatch = !statusFilter || order.orderStatus === statusFilter;

    return (
      dateMatch &&
      statusMatch &&
      (id.includes(searchLower) ||
        mobile.includes(searchLower) ||
        name.includes(searchLower))
    );
  });

  // Paginate filtered orders
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this order?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete order");

      setOrders((prev) => prev.filter((order) => order?._id !== id));
      setHit(true);
      toast.success("Order deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete order");
    }
  };

  const handleEditSubmit = async () => {
    if (!editOrder) return;

    const originalOrder = orders.find((o) => o._id === editOrder._id);
    if (!originalOrder) return;

    const updatedOrder = { ...editOrder };

    const hasStatusChanged =
      editOrder.orderStatus !== originalOrder.orderStatus;
    const hasNote = editOrder.newTrackingNote?.trim();

    if (hasStatusChanged || hasNote) {
      const newTracking = {
        status: editOrder.orderStatus,
        timestamp: new Date().toISOString(),
        note: hasNote || `Status changed to ${editOrder.orderStatus}`,
      };

      // Append to original tracking history
      updatedOrder.trackingHistory = [
        ...(originalOrder.trackingHistory || []),
        newTracking,
      ];
    } else {
      // Preserve tracking history
      updatedOrder.trackingHistory = originalOrder.trackingHistory || [];
    }

    delete updatedOrder.newTrackingNote;

    try {
      const res = await fetch(`/api/orders/${editOrder._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Failed to update order");

      setOrders((prev) =>
        prev.map((order) => (order._id === editOrder._id ? result.data : order))
      );

      setEditOrder(null);
      toast.success("Order updated successfully!");
      setHit(true);
    } catch (error: any) {
      toast.error(`Update failed: ${error.message}`);
    }
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-600";
      case "Refunded":
        return "bg-gray-600";
      case "Failed":
        return "bg-red-600";
      case "Pending":
        return "bg-yellow-600";
      case "unpaid":
        return "bg-red-600";
      case "Completed":
        return "bg-green-600";
      case "Confirmed":
        return "bg-blue-600";
      case "Cancelled":
        return "bg-red-600";
      case "Processing":
        return "bg-purple-600";
      case "Shipped":
        return "bg-orange-600";
      case "Delivered":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  // Analytics data
  const analytics = [
    { title: "Total Orders", value: orders.length, change: "+12%" },
    {
      title: "Pending Orders",
      value: orders.filter((o) => o.orderStatus === "Pending").length,
      change: "+5%",
    },
    {
      title: "Completed Orders",
      value: orders.filter((o) => o.orderStatus === "Completed").length,
      change: "+18%",
    },
    {
      title: "Revenue",
      value: `$${orders.reduce((sum, order) => sum + parseFloat(order.total.replace(/[^0-9.-]+/g, "")), 0).toFixed(2)}`,
      change: "+24%",
    },
  ];

  return (
    <div className=" p-4 ">
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold ">Order Management</h1>
            <p className="dark:text-gray-400 text-gray-700 mt-2">
              Manage and track customer orders
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700  px-4 py-2 rounded-lg transition">
              <Download size={16} />
              Export Orders
            </button>
            <Link
              href="/orders/new"
              className="bg-emerald-600 hover:bg-emerald-700  px-4 py-2 rounded-lg transition"
            >
              New Order
            </Link>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analytics.map((item, index) => (
            <div
              key={index}
              className="dark:bg-gray-800/50 bg-green-500/5 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg"
            >
              <p className="dark:text-gray-400 text-gray-700">{item.title}</p>
              <div className="flex items-baseline mt-2">
                <h3 className="text-2xl font-bold ">{item.value}</h3>
                <span className="ml-2 text-emerald-400 font-medium">
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="dark:bg-gray-800/50 bg-green-500/5 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search
                  className="dark:text-gray-400 text-gray-700"
                  size={18}
                />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-3 dark:bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar
                    className="dark:text-gray-400 text-gray-700"
                    size={18}
                  />
                </div>
                <input
                  type="date"
                  className="pl-10 pr-4 py-3 dark:bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar
                    className="dark:text-gray-400 text-gray-700"
                    size={18}
                  />
                </div>
                <input
                  type="date"
                  className="pl-10 pr-4 py-3 dark:bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Filter
                    className="dark:text-gray-400 text-gray-700"
                    size={18}
                  />
                </div>
                <select
                  className="pl-10 pr-8 py-3 dark:bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="dark:bg-gray-800/50 bg-green-500/5 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="dark:bg-gray-700/50 bg-gray-500/25 text-black dark:text-white text-left">
                  <th className="p-4 font-medium ">Order ID</th>
                  <th className="p-4 font-medium ">Date</th>
                  <th className="p-4 font-medium ">Customer</th>
                  <th className="p-4 font-medium ">Status</th>
                  <th className="p-4 font-medium ">Total</th>
                  <th className="p-4 font-medium  text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-700/50 animate-pulse"
                    >
                      <td className="p-4">
                        <div className="h-4 bg-gray-700 rounded w-20"/>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-700 rounded w-32"/>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-700 rounded w-24"/>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-700 rounded w-16"/>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-700 rounded w-20"/>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-700 rounded w-24 ml-auto"/>
                      </td>
                    </tr>
                  ))
                ) : paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-700/50 hover:bg-gray-700/30 transition"
                    >
                      <td className="p-4 font-medium">{order?.id}</td>
                      <td className="p-4 dark:text-gray-400 text-gray-700">
                        {order?.createdAt}
                      </td>
                      <td className="p-4">
                        <Popover>
                          <PopoverButton className="text-left">
                            <div className="font-medium">
                              {order?.customer?.fullName}
                            </div>
                            <div className="text-sm dark:text-gray-400 text-gray-700">
                              {order?.customer?.mobileNumber}
                            </div>
                          </PopoverButton>

                          <PopoverPanel
                            transition
                            anchor="bottom"
                            className="absolute z-10 mt-2 w-80 rounded-xl bg-white dark:bg-gray-800 border border-gray-700 shadow-lg p-4 transition duration-200 ease-in-out data-closed:opacity-0 data-closed:scale-95"
                          >
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs dark:text-gray-400 text-gray-700">
                                  Full Name
                                </p>
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">
                                    {order?.customer?.fullName}
                                  </p>
                                  <button
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        order?.customer?.fullName || ""
                                      )
                                    }
                                    className="p-1 rounded hover:bg-gray-700"
                                  >
                                    <Copy className="w-4 h-4 dark:text-gray-400 text-gray-700" />
                                  </button>
                                </div>
                              </div>

                              <div>
                                <p className="text-xs dark:text-gray-400 text-gray-700">
                                  Mobile Number
                                </p>
                                <div className="flex items-center justify-between">
                                  <p>{order?.customer?.mobileNumber}</p>
                                  <button
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        order?.customer?.mobileNumber || ""
                                      )
                                    }
                                    className="p-1 rounded hover:bg-gray-700"
                                  >
                                    <Copy className="w-4 h-4 dark:text-gray-400 text-gray-700" />
                                  </button>
                                </div>
                              </div>

                              <div>
                                <p className="text-xs dark:text-gray-400 text-gray-700">
                                  Address
                                </p>
                                <div className="flex items-start justify-between">
                                  <p className="text-sm">
                                    {order?.customer?.address}
                                  </p>
                                  <button
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        order?.customer?.address || ""
                                      )
                                    }
                                    className="p-1 rounded hover:bg-gray-700 mt-1"
                                  >
                                    <Copy className="w-4 h-4 dark:text-gray-400 text-gray-700" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </PopoverPanel>
                        </Popover>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order?.orderStatus)}`}
                        >
                          {order?.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{order?.total}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end space-x-2">
                          {/* <Link
                            href={`/orders/${order._id}`}
                            className="p-2 rounded-lg hover:bg-gray-700 transition"
                            title="View Details"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </Link> */}
                          <button
                            className="p-2 rounded-lg hover:bg-gray-700 transition"
                            onClick={() => setSelectedOrder(order)}
                             title="View Details"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            className="p-2 rounded-lg hover:bg-gray-700 transition"
                            onClick={() => setEditOrder(order!)}
                            title="Edit Order"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-amber-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            className="p-2 rounded-lg hover:bg-gray-700 transition"
                            onClick={() => handleDelete(order?._id!)}
                            title="Delete Order"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-red-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center dark:text-gray-400 text-gray-700"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-700/50">
              <div className="text-sm dark:text-gray-400 text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
                </span>{" "}
                of <span className="font-medium">{filteredOrders.length}</span>{" "}
                results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`}
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page =
                    Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg ${currentPage === page ? "bg-indigo-600" : "hover:bg-gray-700"}`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}

        {editOrder && (
          <OrderEditModal
            editOrder={editOrder}
            handleEditSubmit={handleEditSubmit}
            setEditOrder={setEditOrder}
          />
        )}
      </div>
    </div>
  );
}
