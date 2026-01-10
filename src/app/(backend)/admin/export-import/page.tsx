'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { Download, UploadCloud, Trash2 } from 'lucide-react';

import ExampleCSVDownload from '../../_components/pages/ExampleCSVDownload';
import toast from 'react-hot-toast';
import { TProduct } from '@/app/hooks/useProducts';

export default function ImportExportProducts() {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsed = results.data.map((item: any) => ({
            productName: item.productName,
            brandName: item.brandName,
            category: item.category,
            subCategory: item.subCategory,
            regularPrice: item.regularPrice,
            salePrice: item.salePrice,
            discount: item.discount,
            sku: item.sku,
            stockStatus: item.stockStatus,
            quantity: parseInt(item.quantity),
            stockAlert: parseInt(item.stockAlert),
            units: item.units,
            attributes: [], // optional
            dimensions: item.dimensions,
            weight: item.weight,
            description: item.description,
            status: item.status || 'published',
            images: item.images ? item.images.split('|') : [],
          })) as any[];

          setProducts(parsed);
          setUploadError(null);
        } catch (error) {
          console.error(error);
          setUploadError('Invalid CSV format.');
        }
      },
      error: (error) => {
        console.error(error);
        setUploadError('CSV parsing failed.');
      },
    });
  };

  const exportToCSV = () => {
    const headers = [
      'productName',
      'brandName',
      'category',
      'subCategory',
      'regularPrice',
      'salePrice',
      'discount',
      'sku',
      'stockStatus',
      'quantity',
      'stockAlert',
      'units',
      'dimensions',
      'weight',
      'description',
      'status',
      'images',
    ];

    const csv = [
      headers.join(','),
      ...products.map((p) =>
        headers
          .map((h) =>
            h === 'images'
              ? `"${p.images?.join('|') || ''}"`
              : `"${(p as any)[h] ?? ''}"`
          )
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'products.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const submitToAPI = async () => {
    const toastId = toast.loading('Uploading products...');
    try {
      const res = await fetch('/api/products/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(products),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Import failed');

      toast.success(`✅ ${data.importedCount} products imported successfully!`, {
        id: toastId,
      });
      setProducts([]);
    } catch (err: any) {
      toast.error(err.message || 'Failed to import products.', {
        id: toastId,
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Import & Export Products</h1>

      <div className="flex gap-4 items-center flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:underline">
          <UploadCloud size={18} />
          Import CSV
          <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
        </label>

        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 text-green-600 hover:underline"
        >
          <Download size={18} /> Export CSV
        </button>

        {products.length > 0 && (
          <>
            <button
              onClick={submitToAPI}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit to API
            </button>

            <button
              onClick={() => setProducts([])}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
            >
              <Trash2 size={16} />
              Clear
            </button>
          </>
        )}

        <ExampleCSVDownload />
      </div>

      {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}

      {products.length > 0 && (
        <div className="overflow-x-auto border rounded mt-4">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{p.productName}</td>
                  <td className="p-2">${p.regularPrice}</td>
                  <td className="p-2">{p.quantity}</td>
                  <td className="p-2">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
