'use client';

import React, { useState, useMemo } from 'react';
import { Search, Package, FileDown, FileText, BarChartBig } from 'lucide-react';
import { jsPDF } from 'jspdf';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ProductReport {
  id: string;
  name: string;
  category: string;
  sold: number;
  revenue: number;
  stock: number;
}

const dummyProducts: ProductReport[] = new Array(50).fill(0).map((_, i) => ({
  id: `PRD-${1000 + i}`,
  name: `Product ${i + 1}`,
  category: ['Electronics', 'Apparel', 'Home'][i % 3],
  sold: 10 + i * 2,
  revenue: 100 + i * 30,
  stock: 20 - (i % 20),
}));

const ProductReportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'revenue' | 'sold'>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return dummyProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [searchTerm, sortBy, sortOrder]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const top20 = [...dummyProducts]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 20);

  const exportCSV = () => {
    const headers = ['Product ID', 'Name', 'Category', 'Sold', 'Revenue', 'Stock'];
    const rows = filtered.map((p) => [p.id, p.name, p.category, p.sold, p.revenue, p.stock]);
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'product_report.csv');
    link.click();
  };

const exportPDF = () => {
  const doc = new jsPDF('p', 'mm', 'a4');

  let y = 15;

  doc.setFontSize(18);
  doc.text('Product Report', 14, y);

  y += 8;
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, y);

  y += 10;

  // Table Header
  doc.setFontSize(11);
  doc.text('ID', 14, y);
  doc.text('Name', 35, y);
  doc.text('Category', 85, y);
  doc.text('Sold', 120, y);
  doc.text('Revenue', 140, y);
  doc.text('Stock', 170, y);

  y += 2;
  doc.line(14, y, 195, y);
  y += 6;

  doc.setFontSize(9);

  filtered.forEach((p) => {
    doc.text(p.id, 14, y);
    doc.text(p.name.slice(0, 20), 35, y);
    doc.text(p.category, 85, y);
    doc.text(String(p.sold), 120, y);
    doc.text(`$${p.revenue}`, 140, y);
    doc.text(String(p.stock), 170, y);

    y += 6;

    // Page break
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save('product_report.pdf');
};


  return (
    <div className="p-6 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            <Package className="w-6 h-6" /> Product Reports
          </h1>
          <p className="text-sm text-gray-500">Monitor product performance and inventory</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute top-2.5 left-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search product or category"
              className="pl-8 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={exportCSV} className="flex items-center gap-1 px-3 py-2 border rounded hover:bg-gray-100">
            <FileDown size={16} /> Export CSV
          </button>
          <button onClick={exportPDF} className="flex items-center gap-1 px-3 py-2 border rounded hover:bg-gray-100">
            <FileText size={16} /> Export PDF
          </button>
          <select
            className="border px-2 py-2 rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'revenue' | 'sold')}
          >
            <option value="revenue">Sort by Revenue</option>
            <option value="sold">Sort by Units Sold</option>
          </select>
          <select
            className="border px-2 py-2 rounded"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Top 20 Products by Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={top20} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
            <Bar dataKey="sold" fill="#10b981" name="Units Sold" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3">Product ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Units Sold</th>
              <th className="px-4 py-3">Revenue</th>
              <th className="px-4 py-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">{p.sold}</td>
                <td className="px-4 py-3">${p.revenue.toFixed(2)}</td>
                <td className="px-4 py-3">{p.stock}</td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing {paginated.length} of {filtered.length} results
        </p>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductReportPage;