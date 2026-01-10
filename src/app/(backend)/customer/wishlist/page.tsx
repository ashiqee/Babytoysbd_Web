"use client";

import { useState } from "react";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function WishlistPage() {
  // Sample wishlist items (replace with API call in real app)
  const [wishlist, setWishlist] = useState<WishlistItem[]>([
    {
      id: "1",
      name: "Wireless Headphones",
      price: 99.99,
      image: "/products/headphones.jpg",
    },
    {
      id: "2",
      name: "Smart Watch",
      price: 149.99,
      image: "/products/smartwatch.jpg",
    },
    {
      id: "3",
      name: "Gaming Mouse",
      price: 49.99,
      image: "/products/mouse.jpg",
    },
  ]);

  // Handler to remove item from wishlist
  function removeFromWishlist(id: string) {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  }

  // Handler to add to cart (mock)
  function addToCart(item: WishlistItem) {
    alert(`Added "${item.name}" to cart!`);
    // You can implement actual cart logic here
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <li
              key={item.id}
              className="border rounded-lg p-4 flex flex-col items-center bg-white shadow"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-32 h-32 object-contain mb-4"
              />
              <h2 className="text-lg font-medium mb-2">{item.name}</h2>
              <p className="text-gray-700 font-semibold mb-4">${item.price.toFixed(2)}</p>

              <div className="flex space-x-3">
                <button
                  onClick={() => addToCart(item)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
