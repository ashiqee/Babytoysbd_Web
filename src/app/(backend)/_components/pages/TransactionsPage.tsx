'use client';

import React, { useState } from "react";
import { Download, Pencil, Save, X, Search } from "lucide-react";

interface Transaction {
  id: string;
  orderId: string;
  customer: string;
  date: string;
  amount: number;
  method: string;
  status: "Paid" | "Pending" | "Failed" | "Refunded";
}

const dummyTransactions: Transaction[] = new Array(30).fill(0).map((_, i) => ({
  id: `TXN-${2000 + i}`,
  orderId: `#ORD-${1000 + i}`,
  customer: `Customer ${i + 1}`,
  date: `2025-06-${(i % 30) + 1}`,
  amount: 100 + i * 15,
  method: i % 2 === 0 ? "Stripe" : "PayPal",
  status: ["Paid", "Pending", "Failed", "Refunded"][i % 4] as Transaction["status"],
}));

const getStatusStyle = (status: Transaction["status"]) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Failed":
      return "bg-red-100 text-red-700";
    case "Refunded":
      return "bg-blue-100 text-blue-700";
  }
};

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState(dummyTransactions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Transaction>>({});
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | Transaction["status"]>("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tabs: ("All" | Transaction["status"])[] = ["All", "Paid", "Pending", "Failed", "Refunded"];

  const startEdit = (txn: Transaction) => {
    setEditingId(txn.id);
    setEditData({ ...txn });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = () => {
    if (!editingId) return;
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === editingId ? { ...txn, ...editData } as Transaction : txn))
    );
    cancelEdit();
  };

  const handleChange = (field: keyof Transaction, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const filtered = transactions.filter((txn) => {
    const matchSearch =
      txn.customer.toLowerCase().includes(search.toLowerCase()) ||
      txn.id.toLowerCase().includes(search.toLowerCase()) ||
      txn.orderId.toLowerCase().includes(search.toLowerCase());

    const matchTab = activeTab === "All" || txn.status === activeTab;

    const txnDate = new Date(txn.date);
    const matchStart = startDate ? new Date(startDate) <= txnDate : true;
    const matchEnd = endDate ? txnDate <= new Date(endDate) : true;

    return matchSearch && matchTab && matchStart && matchEnd;
  });

  const totalAmount = filtered.reduce((sum, txn) => sum + txn.amount, 0);

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Transactions</h1>
          <p className="text-sm text-gray-500">Manage payments & updates</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 mt-4 md:mt-0">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded px-2 py-1" />
          <span>-</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded px-2 py-1" />
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-sm rounded-full ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100/15 border-b">
            <tr>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((txn) => (
              <tr key={txn.id} className="border-b hover:bg-gray-50/15">
                <td className="px-4 py-3">{txn.id}</td>
                <td className="px-4 py-3 text-blue-600">{txn.orderId}</td>
                <td className="px-4 py-3">{txn.customer}</td>
                <td className="px-4 py-3">{txn.date}</td>
                <td className="px-4 py-3">
                  {editingId === txn.id ? (
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editData.method || ""}
                      onChange={(e) => handleChange("method", e.target.value)}
                    />
                  ) : (
                    txn.method
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === txn.id ? (
                    <input
                      type="number"
                      className="border rounded px-2 py-1 w-20"
                      value={editData.amount || ""}
                      onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
                    />
                  ) : (
                    `$${txn.amount.toFixed(2)}`
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === txn.id ? (
                    <select
                      className="border rounded px-2 py-1"
                      value={editData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                    >
                      {["Paid", "Pending", "Failed", "Refunded"].map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(txn.status)}`}>{txn.status}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {editingId === txn.id ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={saveEdit} className="text-green-600 hover:underline">
                        <Save size={16} />
                      </button>
                      <button onClick={cancelEdit} className="text-red-600 hover:underline">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(txn)} className="text-blue-600 hover:underline">
                      <Pencil size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm font-semibold">Total Amount: ${totalAmount.toFixed(2)}</p>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
