// app/track/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  CreditCard,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Mail
} from "lucide-react";
import { FcProcess } from "react-icons/fc";
import { useSearchParams } from "next/navigation";
import { Types } from "mongoose";

interface TrackingHistory {
  note: string;
  status: string;
  timestamp: string;
  description?: string;
  location?: string;
}

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  category?: string;
}

interface Customer {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  externalId?: string;
}

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface Order {
  shippingCost: any;
  _id: Types.ObjectId;
  orderId: string;
  createdAt: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  orderStatus: string;
  paymentStatus: string;
  priority?: string;
  address?: Address;
  mobileNumber?: string;
  deliveryCompany?: string;
  deliveryTrackingNo?: string;
  trackingHistory: TrackingHistory[];
}

export default function PublicOrderTrackingPage() {
const searchParams = useSearchParams();
    const orderIdFromUrl = searchParams.get("orderId");
    const phoneFromUrl = searchParams.get("phone");
const [phone, setPhone] = useState(
  phoneFromUrl
    ? (phoneFromUrl.startsWith("+") ? phoneFromUrl : `+${phoneFromUrl}`)
        .replace(/\s+/g, "") // remove any spaces
        .trim()
    : ""
);
  const [orderId, setOrderId] = useState(orderIdFromUrl||"");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/orders/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          contact: email || phone
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Order not found");
      }
      
      setOrder(data.data);
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to track order. Please check your order ID and contact information.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async () => {
    if (!order) return;
    
    try {
      setRefreshing(true);
      const response = await fetch(`/api/orders/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.orderId,
          contact: email || phone
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to refresh order details");
      }
      
      setOrder(data.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to refresh order details");
    } finally {
      setRefreshing(false);
    }
  };

  const resetForm = () => {
    setOrderId("");
    setEmail("");
    setPhone("");
    setOrder(null);
    setSubmitted(false);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-BD', options);
  };

  const formatAddress = (address?: Address) => {
    if (!address) return "No address provided";
    
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zip,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'packaging': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'shipped': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'confirmed': return <CheckCircle className="h-5 w-5" />;
      case 'packaging': return <Package className="h-5 w-5" />;
      case 'processing': return <FcProcess className="h-5 w-5" />;
      case 'shipped': return <Truck className="h-5 w-5" />;
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      case 'cancelled': return <AlertCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div>
   
      <div className="container mx-auto  px-4 py-8 md:py-12">
        <div >
          {/* Header */}
          <div className="text-center mb-12 ">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Track Your Order</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Enter your order ID and email or phone number to track your order status and delivery progress.
            </p>
          </div>

          {!submitted ? (
            /* Tracking Form */
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-8 max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order ID
                  </label>
                  <input
                    type="text"
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g., BTB-0014"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Information
                  </label>
                  <div className="grid grid-cols-1  gap-4">
                    {/* <div >
                      <label htmlFor="email" className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div> */}
                    <div>
                      <label htmlFor="phone" className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+8801XXXXXXXXX"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Please provide phone number associated with your order.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                      <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    type="submit"
                    disabled={loading || (!email && !phone)}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Tracking...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        Track Order
                      </>
                    )}
                  </button>
                  <Link
                    href="/"
                    className="px-6 py-3 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg border border-gray-300 dark:border-gray-600 transition duration-300 text-center"
                  >
                    Back to Home
                  </Link>
                </div>
              </form>
            </div>
          ) : (
            /* Order Tracking Results */
            <>
              {error ? (
                /* Error State */
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center mb-8">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300"
                    >
                      Try Again
                    </button>
                    <Link
                      href="/"
                      className="px-6 py-3 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg border border-gray-300 dark:border-gray-600 transition duration-300"
                    >
                      Back to Home
                    </Link>
                  </div>
                </div>
              ) : order ? (
                /* Order Details */
                <>
                  {/* Header */}
                  <div className="mb-8">
                    <button
                      onClick={resetForm}
                      className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mb-4"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Track Another Order
                    </button>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Tracking</h1>
                        <p className="text-gray-600 dark:text-gray-300">
                          Order ID: <span className="font-semibold">{order.orderId}</span>
                        </p>
                      </div>
                      <button
                        onClick={fetchOrderDetails}
                        disabled={refreshing}
                        className="mt-4 md:mt-0 px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg border border-gray-300 dark:border-gray-600 transition duration-300 flex items-center"
                      >
                        <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                      </button>
                    </div>
                  </div>

                  {/* Order Status Summary */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Order Status</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          <span className="ml-2">{order.orderStatus}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Status</p>
                        <p className={`font-medium ${
                          order.paymentStatus === 'Paid' ? 'text-green-600 dark:text-green-400' : 
                          order.paymentStatus === 'unpaid' ? 'text-yellow-600 dark:text-yellow-400' : 
                          'text-gray-900 dark:text-white'
                        }`}>
                          {order.paymentStatus}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {order.currency} {order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Delivery Method</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {order.deliveryCompany || "Standard Delivery"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Tracking Timeline */}
                    <div className="lg:col-span-2">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tracking History</h2>
                        
                        <div className="space-y-6">
                          {order.trackingHistory.map((history, index) => (
                            <div key={index} className="flex">
                              <div className="flex flex-col items-center mr-4">
                                <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
                                  history.status === 'Delivered' ? 'bg-green-500' : 
                                  history.status === 'Cancelled' ? 'bg-red-500' :
                                  index === order.trackingHistory.length - 1 ? 'bg-blue-500' : 'bg-gray-300'
                                }`}>
                                  {getStatusIcon(history.status)}
                                </div>
                                {index < order.trackingHistory.length - 1 && (
                                  <div className="h-full w-0.5 bg-gray-300 dark:bg-gray-600 my-1"/>
                                )}
                              </div>
                              <div className="pb-6 flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{history.status}</h3>
                                    <p className="text-sm">{history?.note}</p>
                                  </div>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(history.timestamp)}
                                  </span>
                                </div>
                                {history.description && (
                                  <p className="text-gray-600 dark:text-gray-300 mt-1">{history.description}</p>
                                )}
                                {history.location && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {history.location}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {order.deliveryTrackingNo && (
                          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tracking Number</h3>
                            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                              <span className="font-mono text-gray-900 dark:text-white">{order.deliveryTrackingNo}</span>
                              <button
                                onClick={() => navigator.clipboard.writeText(order.deliveryTrackingNo!)}
                                className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Details Sidebar */}
                    <div className="space-y-8">
                      {/* Customer Information */}
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Customer Information</h2>
                        
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 mr-4">
                              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">Name</h3>
                              <p className="text-gray-600 dark:text-gray-300">
                                {order.customer.firstName} {order.customer.lastName}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 mr-4">
                              <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">Phone</h3>
                              <p className="text-gray-600 dark:text-gray-300">
                                {order.customer.phone || order.mobileNumber}
                              </p>
                            </div>
                          </div>
                          
                          {order.customer.email && (
                            <div className="flex items-start">
                              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 mr-4">
                                <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">Email</h3>
                                <p className="text-gray-600 dark:text-gray-300">{order.customer.email}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Shipping Address</h2>
                        
                        <div className="flex items-start">
                          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 mr-4">
                            <MapPin className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Delivery Address</h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                              {formatAddress(order.address)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Items</h2>
                        
                        <div className="space-y-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg w-12 h-12 flex items-center justify-center mr-3">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900 dark:text-white">{item.name.slice(0,30)}</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {order.currency} {item.price.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-900 dark:text-white">Delivery Charge</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {order.currency} {order.shippingCost.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                            <span className="font-bold text-lg text-green-600 dark:text-green-400">
                              {order.currency} {order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 ">
                        <Link
                          href="/"
                          className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300 text-center"
                        >
                          Continue Shopping
                        </Link>
                        <Link
                          href="/contact"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg border border-gray-300 dark:border-gray-600 transition duration-300 text-center"
                        >
                          Contact Support
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Loading State */
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"/>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      
    </div>
  );
}