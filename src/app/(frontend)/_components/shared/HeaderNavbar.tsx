"use client"; // Required for client-side hooks

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, Search, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import { ThemeSwitch } from "@/components/theme-switch";
import ProfileBar from "./ProfileBar";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { name: "Activity", icon: "/icons/activity.png", href: "/products?tags=Activity" },
  { name: "Clothing", icon: "/icons/clothing.png", href: "/products?tags=Clothing"},
  { name: "Toys", icon: "/icons/toys.png", href: "/products?tags=Toys"},
  { name: "Feeding", icon: "/icons/feeding.png", href: "/products?tags=Feeding"},
  { name: "For Babies", icon: "/icons/baby.png", href: "/products?tags=For Babie"},
  { name: "Gifts", icon: "/icons/gift.png", href: "/products?tags=Gifts"},
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Sticky effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full  transition-all duration-300 ${
        isSticky
          ? "bg-black/25 z-30 backdrop-blur-sm shadow-md py-2"
          : "bg-transparent z-30 py-4"
      }`}
    >
      <div className="container relative z-10 mx-auto px-4 md:px-0 flex items-start justify-between">
        {/* Logo */}
        {isSticky ? (
          <Link href="/">
            <Image
              width={800}
              height={800}
              src="/babytoysbd-logo.png"
              alt="Baby Toys bd logo"
              className="md:w-14 z-40 md:h-14 w-14 h-14 mb-1 rounded-full animate-pendulum"
            />
          </Link>
        ) : (
          <Link
            href="/"
            className="text-3xl pt-4 hidden md:flex font-bold text-green-500"
          >
            <span className="text-secondary-light dark:text-purple-50">
              Baby Toys BD
            </span>
          </Link>
        )}
        {/* menu  */}
        <div className=" flex flex-col items-center justify-center">
          {!isSticky && (
            <Link
            href="/">

   <Image
              width={800}
              height={800}
              src="/babytoysbd-logo.png"
              alt="Baby Toys bd logo"
              className="md:w-20 z-30 md:h-20 w-14 h-14 mb-1 rounded-full animate-pendulum"
            />
            </Link>
         
          )}
          {/* Desktop Menu */}
          {pathname === "/" && (
            <nav className="hidden md:flex z-30 items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex flex-col uppercase items-center text-xs dark:text-yellow-50 hover:text-yellow-200"
                >
                  <Image
                    width={40}
                    height={40}
                    src={item.icon}
                    alt={item.name}
                    className="w-8 hover:animate-bounce z-30 duration-700 h-8 mb-1 rounded-full"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
        {/* Icons */}

        <div className="hidden md:flex pt-4 items-center space-x-5 dark:text-yellow-50 text-gray-700">
          <div className="relative">
            <Link href={"/wishlists"}>
              <Heart className="w-6 h-6 cursor-pointer hover:text-green-600" />
            </Link>
            {/* Wishlist count badge would go here if implemented */}
          </div>
          <Search className="w-5 h-5 cursor-pointer hover:text-green-600" />
          <button onClick={() => router.push("/carts")}>
            <ShoppingBasket className="w-5 h-5 cursor-pointer hover:text-green-600" />
          </button>
          <ThemeSwitch />
          <ProfileBar />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden pt-2 z-[999] relative dark:text-white text-gray-700"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0 }}
            animate={{ height: "100vh" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed z-30 top-0  left-0 w-full shadow-lg overflow-hidden bg-white/90 backdrop-blur-xl border border-white/20 dark:bg-black/65  dark:border-black/20"
          >
            <div className=" px-4   flex  flex-col-reverse space-y-6">
            
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-3 text-lg font-medium dark:text-white text-gray-700 hover:text-green-600"
                >
                  <img src={item.icon} alt={item.name} className="w-7 h-7" />
                  <span>{item.name}</span>
                </Link>
              ))}
              {/* Mobile icons */}
              <div className="flex items-center space-x-6 pt-4 border-t">
                <Heart className="w-6 h-6 cursor-pointer hover:text-green-600" />
                <Search className="w-6 h-6 cursor-pointer hover:text-green-600" />
                <ShoppingBasket className="w-6 h-6 cursor-pointer hover:text-green-600" />
              
              
              </div>
              {/* header mobile */}
                <div className="flex gap-2  justify-between items-center">
                 <Link href="/">
            <Image
              width={800}
              height={800}
              src="/babytoysbd-logo.png"
              alt="Baby Toys bd logo"
              className="z-40  w-14 h-14 mb-1 rounded-full animate-pendulum"
            />
          </Link>

          <div className="flex gap-3 items-center">
              <ThemeSwitch />
              <ProfileBar />
                   <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden  relative dark:text-white text-gray-700"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
              </div>
          </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
