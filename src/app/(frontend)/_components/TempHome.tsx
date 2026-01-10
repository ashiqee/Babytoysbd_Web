// pages/index.tsx

import Image from "next/image";
import ProfileBar from "./shared/ProfileBar";
import Link from "next/link";

const categories = [
  { id: 1, name: "Electronics", image: "/categories/electronics.jpg" },
  { id: 2, name: "Fashion", image: "/categories/fashion.jpg" },
  { id: 3, name: "Home & Garden", image: "/categories/home.jpg" },
  { id: 4, name: "Sports", image: "/categories/sports.jpg" },
];

const bestSellers = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 59.99,
    image: "https://media.istockphoto.com/id/1461799071/photo/beautiful-young-woman-looking-at-screen-of-her-mobile-phone-and-listening-through-her.jpg?s=612x612&w=0&k=20&c=K45hjPN8e9r3Xd2HdV6e2nCwVwDGwAuA-SfdE4TKOeM=",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 129.99,
    image: "https://ae01.alicdn.com/kf/S67efa247051a4336a86de037cdee35c78.jpg_960x960.jpg",
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 89.99,
    image: "https://pbs.twimg.com/media/FvnoRt0XgAE5Pjj.jpg:large",
  },
  {
    id: 4,
    name: "Coffee Maker",
    price: 49.99,
    image: "https://www.shutterstock.com/image-photo/young-woman-cup-hot-coffee-600nw-2395325989.jpg",
  },
];

const newArrivals = [
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 39.99,
    image: "https://media.istockphoto.com/id/1316582397/photo/closeup-of-smart-portable-wireless-speaker-on-the-table.jpg?s=612x612&w=0&k=20&c=j9Oh9UdBtfEouWmnWizUVDde8hqjXWa-VrMl1fY3Y08=",
  },
  {
    id: 6,
    name: "Sunglasses",
    price: 19.99,
    image: "https://media.istockphoto.com/id/1134003334/photo/young-woman-walking-on-street.jpg?s=612x612&w=0&k=20&c=5kRJCmzZl3CS1q7cBJrY6pBO1o_FRJnVV66C4GsztDU=",
  },
];

export default function TempHome() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-indigo-600">ShopEasy</h1>
          <nav className="hidden md:flex space-x-8 font-medium text-gray-700">
            <Link href={"#"} className="hover:text-indigo-600">
              Home
            </Link>
            <Link href={"#"} className="hover:text-indigo-600">
              Categories
            </Link>
            <Link href={"#"} className="hover:text-indigo-600">
              Deals
            </Link>
            <Link href={"#"} className="hover:text-indigo-600">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <input
              type="search"
              placeholder="Search products..."
              className="hidden md:block border rounded-md px-3 py-1 focus:outline-indigo-500"
            />
            <button className="text-gray-600 hover:text-indigo-600">🛒</button>
            <ProfileBar/>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-indigo-600 text-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center p-8 md:p-16">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl font-extrabold leading-tight">
              Discover amazing products at unbeatable prices
            </h2>
            <p className="text-lg max-w-md">
              Shop from thousands of items across electronics, fashion,
              home, and more.
            </p>
            <Link
              href="#categories"
              className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <Image
              src="https://images.morecustomersapp.com/uploads/2020/08/banner-and-eCommerce.jpg"
              alt="Shopping illustration"
              width={500}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section id="categories" className="container mx-auto py-12 px-4">
        <h3 className="text-3xl font-semibold mb-8 text-center">
          Featured Categories
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-lg shadow hover:shadow-lg cursor-pointer overflow-hidden"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                width={300}
                height={200}
                className="object-cover w-full h-40"
              />
              <h4 className="text-center py-3 font-medium">{cat.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-white py-12 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-semibold mb-8 text-center">
            Best Sellers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <div
                key={product.id}
                className="bg-gray-50 rounded-lg shadow p-4 flex flex-col"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="rounded-md object-cover"
                />
                <h4 className="mt-4 font-semibold">{product.name}</h4>
                <p className="mt-2 font-bold text-indigo-600">
                  ${product.price.toFixed(2)}
                </p>
                <button className="mt-auto bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto py-12 px-4">
        <h3 className="text-3xl font-semibold mb-8 text-center">New Arrivals</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={200}
                className="rounded-md object-cover"
              />
              <h4 className="mt-4 font-semibold">{product.name}</h4>
              <p className="mt-2 font-bold text-indigo-600">
                ${product.price.toFixed(2)}
              </p>
              <button className="mt-auto bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-indigo-600 text-white py-12 px-4 text-center rounded-lg mx-4 md:mx-auto max-w-4xl my-12">
        <h3 className="text-3xl font-semibold mb-4">Summer Sale is Here!</h3>
        <p className="mb-6 max-w-xl mx-auto">
          Get up to 50% off on selected items. Limited time only!
        </p>
        <Link
          href="#"
          className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
        >
          Shop Deals
        </Link>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto py-12 px-4">
        <h3 className="text-3xl font-semibold mb-8 text-center">What Customers Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <blockquote className="bg-white p-6 rounded-lg shadow">
            <p className="italic mb-4">
              “Great prices and fast delivery. The product quality exceeded my expectations!”
            </p>
            <footer className="font-semibold">- Sarah J.</footer>
          </blockquote>
          <blockquote className="bg-white p-6 rounded-lg shadow">
            <p className="italic mb-4">
              “Customer service was very helpful and responsive. Highly recommend ShopEasy.”
            </p>
            <footer className="font-semibold">- Mike T.</footer>
          </blockquote>
          <blockquote className="bg-white p-6 rounded-lg shadow">
            <p className="italic mb-4">
              “Easy to navigate site with great deals every week. I keep coming back for more!”
            </p>
            <footer className="font-semibold">- Emily R.</footer>
          </blockquote>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-indigo-600 text-white py-12 px-4 rounded-lg mx-4 md:mx-auto max-w-4xl mb-16">
        <h3 className="text-3xl font-semibold mb-4 text-center">
          Join Our Newsletter
        </h3>
        <p className="mb-6 text-center max-w-lg mx-auto">
          Get exclusive offers and updates straight to your inbox.
        </p>
        <form className="flex max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-grow rounded-l-md px-4 py-3 text-gray-900 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-white text-indigo-600 font-semibold px-6 rounded-r-md hover:bg-gray-100 transition"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold mb-4">ShopEasy</h4>
            <p>Your one-stop shop for everything you need.</p>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Company</h5>
            <ul className="space-y-2">
              <li>
                <Link href={"#"} className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={"#"} className="hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href={"#"} className="hover:text-white">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Support</h5>
            <ul className="space-y-2">
              <li>
                <Link href={"#"} className="hover:text-white">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href={"#"} className="hover:text-white">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href={"#"} className="hover:text-white">
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Follow Us</h5>
            <div className="flex space-x-4 text-2xl">
              <Link href={"#"} aria-label="Facebook" className="hover:text-white">
                📘
              </Link>
              <Link href={"#"} aria-label="Twitter" className="hover:text-white">
                🐦
              </Link>
              <Link href={"#"} aria-label="Instagram" className="hover:text-white">
                📸
              </Link>
              <Link href={"#"} aria-label="LinkedIn" className="hover:text-white">
                💼
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          &copy; 2025 ShopEasy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
