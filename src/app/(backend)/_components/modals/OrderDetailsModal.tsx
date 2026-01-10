import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { OrderProduct } from "../../_lib/type";
import { Eye, Download, Printer, Copy } from "lucide-react";

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
}) => {
  const [viewInvoice, setViewInvoice] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Invoice", 14, 22);
    doc.setFontSize(11);
    doc.text(`Order ID: ${order?.orderId}`, 14, 32);
    doc.text(`Date: ${new Date(order?.createdAt).toLocaleString()}`, 14, 38);
    doc.text(`Customer: ${order?.customer}`, 14, 44);
    doc.text(`Payment Status: ${order?.paymentStatus}`, 14, 50);
    doc.text(`Delivery Number: ${order?.deliveryNumber}`, 14, 56);
    doc.text(`Order Status: ${order?.orderStatus}`, 14, 62);

    autoTable(doc, {
      startY: 70,
      head: [["Product", "Size", "Qty", "Status"]],
      body: order?.products.map((p: any) => [
        p.name,
        p.size,
        p.quantity.toString(),
        p.status,
      ]),
    });

    const finalY = doc.lastAutoTable?.finalY ?? 70;
    doc.text(`Total: $${order?.total}`, 14, finalY + 10);
    doc.save(`Invoice_${order?.orderId}.pdf`);
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "", "width=900,height=700");
    if (win) {
      win.document.write(
        `<html><head><title>Invoice</title></head><body>${printContents}</body></html>`
      );
      win.document.close();
      win.focus();
      setTimeout(() => {
        win.print();
        win.close();
      }, 500);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
        <div className="bg-[#0F172A] text-white p-8 rounded-md w-full max-w-5xl shadow-lg space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Order Details</h2>
              <p className="text-sm text-gray-400">
                Order #{order?.id} •{" "}
                {order?.createdAt}


              </p>
            </div>
            <button onClick={onClose} className="text-red-500 hover:underline">
              Close
            </button>
          </div>

          {/* Action Buttons with Icons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setViewInvoice(true)}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              <Eye size={16} /> View
            </button>
            <button
              onClick={handleDownloadInvoice}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
            >
              <Download size={16} /> Download
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-black"
            >
              <Printer size={16} /> Print
            </button>
          </div>

          {/* Progress bar */}
          <div>
            <h3 className="font-semibold mb-2">Progress</h3>
            <div className="w-full bg-gray-700 rounded h-2 overflow-hidden">
              <div className="bg-green-500 h-2 w-1/3" />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Status: {order?.orderStatus}
            </p>
          </div>

          {/* Product list */}
          <div>
            <h3 className="font-semibold mb-2">Products</h3>
            <div className="space-y-2">
              {order?.products?.map((product: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-800 p-4 rounded flex justify-between items-center"
                >
                  <div className="flex gap-2">
                    <img
                      className="w-20 h-20 rounded-md object-cover"
                      src={product?.image}
                      alt={product?.name}
                    />
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{product.name}</p>
                      {product?.color && (
                        <p className="text-sm text-gray-400">
                          color: {product?.color}
                        </p>
                      )}
                      {product?.size && (
                        <p className="text-sm text-gray-400">
                          Size: {product?.size}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p>Qty: {product?.quantity}</p>
                    <p className="text-xs text-green-400">{product?.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Customer Info</h3>
              {/* <p><strong>Name:</strong> {order?.customer?.fullName}</p> */}
              <div>
                <div className="border border-slate-600/5 shadow-sm">
                  <div
                    className="block rounded-lg px-3 py-2 transition hover:bg-white/5"
                    
                  >
                    {/* Full Name with Copy */}
                    <p className="font-semibold text-white flex items-center justify-between gap-2">
                      {order?.customer?.fullName}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            order?.customer?.fullName || ""
                          );
                        }}
                        
                        className="rounded-md bg-white/10 p-1 text-white hover:bg-white/20 transition"
                        title="Copy name"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </p>

                    {/* Mobile Number with Copy */}
                    <p className="text-white/80 flex items-center justify-between gap-2 mt-1">
                      {order?.customer?.mobileNumber}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            order?.customer?.mobileNumber || ""
                          );
                        }}
                        className="rounded-md bg-white/10 p-1 text-white hover:bg-white/20 transition"
                        title="Copy mobile"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </p>

                    {/* Address with Copy */}
                    <p className="text-white/70 flex items-center justify-between gap-2 mt-1">
                      {order?.customer?.address}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            order?.customer?.address || ""
                          );
                        }}
                        className="rounded-md bg-white/10 p-1 text-white hover:bg-white/20 transition"
                        title="Copy address"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Tracking Info</h3>
              <p>
                <strong>Delivery with:</strong> {order?.deliveryCompany}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Payment Info</h3>
              <p>
                <strong>Status:</strong> {order?.paymentStatus}
              </p>
              <p>
                <strong>Total:</strong> {order?.total}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* View Invoice Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <div className="bg-white text-black w-full max-w-2xl rounded-md p-6 shadow-xl overflow-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Invoice Preview</h3>
              <button
                onClick={() => setViewInvoice(false)}
                className="text-red-500 hover:underline"
              >
                Close
              </button>
            </div>
            <div ref={printRef}>
              <p>
                <strong>Order ID:</strong> {order?.orderId}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order?.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Customer:</strong> {order?.customer}
              </p>
              <p>
                <strong>Payment Status:</strong> {order?.paymentStatus}
              </p>
              <p>
                <strong>Delivery Number:</strong> {order?.deliveryNumber}
              </p>
              <p>
                <strong>Order Status:</strong> {order?.orderStatus}
              </p>

              <h4 className="mt-4 font-semibold">Products</h4>
              <table className="w-full mt-2 border text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Size</th>
                    <th className="border p-2">Qty</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.products.map((product: any, index: number) => (
                    <tr key={index}>
                      <td className="border p-2">{product?.name}</td>
                      <td className="border p-2">{product?.size}</td>
                      <td className="border p-2">{product?.quantity}</td>
                      <td className="border p-2">{product?.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4">
                <strong>Total:</strong> ${order?.total}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetailsModal;
