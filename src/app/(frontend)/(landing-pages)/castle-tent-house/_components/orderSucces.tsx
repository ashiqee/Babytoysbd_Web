// components/order-success/OrderSuccessPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Truck, Package, CreditCard, MapPin, Phone, User } from "lucide-react";
import NavbarLanding from "./shared/Navbar";
import Navbar from "@/app/(frontend)/_components/shared/Navbar";
import Header from "@/app/(frontend)/_components/shared/HeaderNavbar";


export default function OrderSuccessPage() {
 
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
   const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get("orderId");

  useEffect(() => {
    // Get order details from localStorage (set during checkout)
    const savedOrderDetails = localStorage.getItem("orderDetails");
    
    if (savedOrderDetails) {
      const parsedData = JSON.parse(savedOrderDetails);
      
      // Set order details with all the data from your API response
      setOrderDetails(parsedData);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"/>
      </div>
    );
  }

  if (orderDetails.orderId !== orderIdFromUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">We couldn&#39;t find your order details.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Format date for display
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

  // Format address for display
  const formatAddress = (address: any) => {
    const parts = [
      address?.street,
      address?.city,
      address?.state,
      address?.zip,
      address?.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
     <Header/>
      
      <div className="container mx-auto  px-4  md:py-12">
        <div className="max-w-4xl pt-40 mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4">
                <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Thank you for your purchase! We&#39;ve received your order and will begin processing it right away.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Order Summary</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Order ID: <span className="font-semibold">{orderDetails?.orderId}</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Placed on: <span className="font-semibold">{formatDate(orderDetails?.createdAt)}</span>
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    orderDetails?.paymentStatus === 'Paid' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {orderDetails?.paymentStatus === 'Paid' ? 'Payment Confirmed' : 'Payment Pending'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 mr-4">
                    <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Estimated Delivery</h3>
                    <p className="text-gray-600 dark:text-gray-300">{orderDetails?.estimatedDelivery || "12-48 hour"}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      via {orderDetails?.deliveryCompany}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 mr-4">
                    <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Payment Method</h3>
                    <p className="text-gray-600 dark:text-gray-300">{orderDetails?.paymentMethod}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Status: {orderDetails?.paymentStatus}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 mr-4">
                 
                    <Package className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Items Ordered</h3>
                    <p className="text-gray-600 dark:text-gray-300">{orderDetails?.items?.length} items</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Status: {orderDetails?.orderStatus}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Your Items</h3>
                <div className="space-y-4">
                  {orderDetails?.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg w-16 h-16 flex items-center justify-center mr-4">
                         {
                          item.image ?  <Image src={item.image} alt={item.name} 
                          className="w-16 h-16 object-cover rounded-md"
                          width={400} 
                          height={400}  />
                          :
                           <Package className="h-8 w-8 text-gray-400" />
                         }
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                          <p className="text-gray-600 dark:text-gray-300">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                        </div>
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {orderDetails?.currency} {item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {orderDetails?.currency} {orderDetails?.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Customer Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 mr-4">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Name</h3>
                    <p className="text-gray-600 dark:text-gray-300">{orderDetails?.customer?.firstName}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 mr-4">
                    <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-300">{orderDetails?.customer?.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delivery Information</h2>
              <div className="flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 mr-4">
                  <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Shipping Address</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {formatAddress(orderDetails?.address)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Status</h2>
            <div className="space-y-4">
              {orderDetails?.trackingHistory?.map((history: any, index: number) => (
                <div key={index} className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                      history.status === 'Completed' ? 'bg-green-500' : 
                      history.status === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}>
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    {index < orderDetails.trackingHistory.length - 1 && (
                      <div className="h-full w-0.5 bg-gray-300 dark:bg-gray-600 my-1"/>
                    )}
                  </div>
                  <div className="pb-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{history.status}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(history.timestamp)}</p>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{history.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300 text-center"
            >
              Continue Shopping
            </Link>
            <Link
              href={`/track?orderId=${orderIdFromUrl}&phone=${orderDetails?.customer?.phone}`}
              className="px-6 py-3  bg-yellow-100 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg border border-gray-300 dark:border-gray-600 transition duration-300 text-center"
            >
              Order Tracking
            </Link>
          </div>

          {/* Support Section */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Need Help?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our customer support team is available to assist you with any questions about your order.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
            >
              Contact Support
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Baby Toys BD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}