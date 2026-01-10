'use client';

import React, { useState } from 'react';
import { Truck, Search, Pencil, Save, X } from 'lucide-react';

interface Shipping {
  id: string;
  orderId: string;
  customer: string;
  carrier: string;
  trackingNumber: string;
  status: 'Pending' | 'Shipped' | 'In Transit' | 'Delivered' | 'Canceled';
  shippedDate: string;
}

const dummyShipments: Shipping[] = new Array(40).fill(0).map((_, i) => ({
  id: `SHIP-${3000 + i}`,
  orderId: `#ORD-${2000 + i}`,
  customer: `Customer ${i + 1}`,
  carrier: i % 2 === 0 ? 'FedEx' : 'DHL',
  trackingNumber: `TRK${100000 + i}`,
  status: ['Pending', 'Shipped', 'In Transit', 'Delivered', 'Canceled'][i % 5] as Shipping['status'],
  shippedDate: `2025-06-${(i % 30) + 1}`,
}));

const getStatusStyle = (status: Shipping['status']) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-700';
    case 'Shipped': return 'bg-blue-100 text-blue-700';
    case 'In Transit': return 'bg-indigo-100 text-indigo-700';
    case 'Delivered': return 'bg-green-100 text-green-700';
    case 'Canceled': return 'bg-red-100 text-red-700';
  }
};

const ShippingPage: React.FC = () => {
  const [shipments, setShipments] = useState<Shipping[]>(dummyShipments);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Shipping>>({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortStatus, setSortStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startEdit = (ship: Shipping) => {
    setEditingId(ship.id);
    setEditData({ ...ship });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = () => {
    if (!editingId) return;
    setShipments((prev) =>
      prev.map((ship) => (ship.id === editingId ? { ...ship, ...editData } as Shipping : ship))
    );
    cancelEdit();
  };

  const handleChange = (field: keyof Shipping, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const filtered = shipments.filter((s) => {
    const matchSearch =
      s.customer.toLowerCase().includes(search.toLowerCase()) ||
      s.orderId.toLowerCase().includes(search.toLowerCase()) ||
      s.trackingNumber.toLowerCase().includes(search.toLowerCase());

    const shipDate = new Date(s.shippedDate);
    const matchStart = startDate ? new Date(startDate) <= shipDate : true;
    const matchEnd = endDate ? shipDate <= new Date(endDate) : true;

    const matchStatus = sortStatus ? s.status === sortStatus : true;

    return matchSearch && matchStart && matchEnd && matchStatus;
  });

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Truck className="w-6 h-6" /> Shipping
          </h1>
          <p className="text-sm text-gray-500">Manage shipment statuses & tracking</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded px-2 py-1" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded px-2 py-1" />
          <select value={sortStatus} onChange={(e) => setSortStatus(e.target.value)} className="border rounded px-2 py-1">
            <option value="">All Statuses</option>
            {["Pending", "Shipped", "In Transit", "Delivered", "Canceled"].map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <div className="relative w-full max-w-xs">
            <Search className="absolute top-2.5 left-2.5 w-5 h-5 text-gray-500" />
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3">Shipment ID</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Carrier</th>
              <th className="px-4 py-3">Tracking Number</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Shipped Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((ship) => (
              <tr key={ship.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{ship.id}</td>
                <td className="px-4 py-3 text-blue-600">{ship.orderId}</td>
                <td className="px-4 py-3">{ship.customer}</td>
                <td className="px-4 py-3">
                  {editingId === ship.id ? (
                    <input className="border rounded px-2 py-1 w-full" value={editData.carrier || ''} onChange={(e) => handleChange('carrier', e.target.value)} />
                  ) : (
                    ship.carrier
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === ship.id ? (
                    <input className="border rounded px-2 py-1 w-full" value={editData.trackingNumber || ''} onChange={(e) => handleChange('trackingNumber', e.target.value)} />
                  ) : (
                    ship.trackingNumber
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === ship.id ? (
                    <select className="border rounded px-2 py-1" value={editData.status} onChange={(e) => handleChange('status', e.target.value)}>
                      {["Pending", "Shipped", "In Transit", "Delivered", "Canceled"].map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(ship.status)}`}>{ship.status}</span>
                  )}
                </td>
                <td className="px-4 py-3">{ship.shippedDate}</td>
                <td className="px-4 py-3 text-right">
                  {editingId === ship.id ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={saveEdit} className="text-green-600 hover:underline"><Save size={16} /></button>
                      <button onClick={cancelEdit} className="text-red-600 hover:underline"><X size={16} /></button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(ship)} className="text-blue-600 hover:underline"><Pencil size={16} /></button>
                  )}
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={8} className="text-center py-6 text-gray-500">No shipments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShippingPage;