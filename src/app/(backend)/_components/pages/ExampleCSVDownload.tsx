'use client';

export default function ExampleCSVDownload() {
  const handleDownload = () => {
    const csvContent = [
      [
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
      ].join(','),

      [
        'Baby Toy Car',
        'ToyBrand',
        'Kid Toys',
        'Vehicle Toys',
        '100',
        '80',
        '20',
        'SKU001',
        'In Stock',
        '50',
        '5',
        'pcs',
        '10x5x3',
        '200g',
        'High quality baby car',
        'published',
        'https://example.com/img1.jpg',
      ].join(','),

      [
        'Soft Teddy Bear',
        'CuteStuff',
        'Kid Toys',
        'Stuffed Toys',
        '150',
        '120',
        '20',
        'SKU002',
        'In Stock',
        '30',
        '5',
        'pcs',
        '8x8x8',
        '300g',
        'Soft and cuddly teddy bear',
        'draft',
        'https://example.com/img2.jpg',
      ].join(','),

      [
        'Wooden Puzzle',
        'SmartPlay',
        'Kid Toys',
        'Educational Toys',
        '90',
        '70',
        '22',
        'SKU003',
        'In Stock',
        '20',
        '3',
        'pcs',
        '12x12x1',
        '500g',
        'Colorful wooden puzzle for learning',
        'published',
        'https://example.com/img3.jpg',
      ].join(','),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'example-products.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Download Example CSV
      </button>
    </div>
  );
}
