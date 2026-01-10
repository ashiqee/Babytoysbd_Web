'use client';
import Link from 'next/link';
import { Home, Grid, ShoppingCart, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function BottomMenu() {
  const [activeItem, setActiveItem] = useState('home');

  const menuItems = [
    { id: 'home', href: '/', icon: Home, label: 'Home' },
    { id: 'shop', href: '/products', icon: Grid, label: 'Shop' },
    { id: 'cart', href: '/carts', icon: ShoppingCart, label: 'Cart' },
    { id: 'whatsapp', href: 'https://wa.me/8801623023940', icon: MessageCircle, label: 'WhatsApp' }
  ];

  return (
    <nav className="fixed z-40 md:hidden bottom-0 w-full bg-white shadow-lg border-t border-gray-200">
      <div className="flex justify-around items-center py-3 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            target={item.id === 'whatsapp' ? '_blank' : undefined}
            rel={item.id === 'whatsapp' ? 'noopener noreferrer' : undefined}
            className={`flex flex-col items-center justify-center w-16 py-1 rounded-lg transition-all duration-200 ${
              activeItem === item.id 
                ? 'text-blue-500 bg-blue-50' 
                : 'text-gray-500 hover:text-blue-400'
            }`}
            onClick={() => setActiveItem(item.id)}
          >
            <item.icon size={22} strokeWidth={activeItem === item.id ? 2.5 : 2} />
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}