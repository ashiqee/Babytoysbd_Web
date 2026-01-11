import { Textarea } from "@heroui/react";


export default function OrderEditModal({
  editOrder,
  setEditOrder,
  handleEditSubmit,
}: {
  handleEditSubmit: any;
  setEditOrder: any;
  editOrder: any;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#161B22] p-6 rounded-lg w-full max-w-lg space-y-4">
        <h2 className="text-xl font-bold text-white">Edit Order</h2>
        <p className="text-md font-bold text-white">{editOrder.id}</p>

        {/* Customer (read-only) */}
        <input
          readOnly
          className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
          value={editOrder.customer.fullName}
          placeholder="Customer"
        />

        {/* Order Status */}
        <select
          className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
          value={editOrder.orderStatus}
          onChange={(e) =>
            setEditOrder({ ...editOrder, orderStatus: e.target.value })
          }
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Packaging">Packaging</option>
          <option value="Shipping">Shipping</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* 🚚 Tracking Number (only for Shipping status) */}
        {editOrder.orderStatus === "Shipping" && (
          <input
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
            placeholder="Enter Delivery Tracking Number"
            value={editOrder.deliveryTrackingNo || ""}
            onChange={(e) =>
              setEditOrder({
                ...editOrder,
                deliveryTrackingNo: e.target.value,
              })
            }
          />
        )}

        {/* Tracking Note Input */}
        <Textarea
          className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
          placeholder="Add tracking note..."
          value={editOrder.newTrackingNote || ""}
          onChange={(e) =>
            setEditOrder({ ...editOrder, newTrackingNote: e.target.value })
          }
        />

        {/* Tracking History */}
        {editOrder.trackingHistory?.length > 0 && (
          <div className="bg-gray-900 p-3 rounded border border-gray-700 max-h-40 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">
              Tracking History
            </h3>
            <ul className="space-y-1 text-sm text-gray-400">
              {editOrder.trackingHistory.map((item: any, index: number) => (
                <li key={index}>
                  <span className="text-green-400">•</span> {item.note}{" "}
                  <span className="text-gray-500 text-xs">
                    ({new Date(item.time).toLocaleString()})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-right">
          <button
            onClick={() => setEditOrder(null)}
            className="px-4 py-2 rounded bg-gray-600 text-white mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleEditSubmit}
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
