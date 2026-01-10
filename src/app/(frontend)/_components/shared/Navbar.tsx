'use client';

import { ThemeSwitch } from '@/components/theme-switch';
import Image from 'next/image';
import { FaEnvelope, FaPhoneAlt, FaFacebookF, FaPinterestP, FaInstagram } from 'react-icons/fa';
import { IoSearchOutline, IoHeartOutline, IoBagOutline, IoPersonOutline } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';
import ProfileBar from './ProfileBar';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full border-b shadow-sm dark:border-slate-800 border-gray-200 font-sans">
<div >
        {/* Top Bar */}
      <div className="bg-[#f5f5f5]   text-sm text-gray-700 px-4 lg:px-8 py-2 ">
       <div className='container mx-auto flex justify-between items-center'>
         {/* Left */}
        <div className="flex  items-center gap-6">
          <span className="flex items-center gap-1">
            <FaEnvelope className="text-black" />
            <Link href="mailto:info@example.com" className="hover:underline">info@example.com</Link>
          </span>
          <span className="flex items-center gap-1">
            <FaPhoneAlt className="text-black" />
            +000-123-456789
          </span>
        </div>

        {/* Center Message */}
        <p className="hidden md:block text-center text-xs">
          Join our nesletter to know when we launch! <Link href="#" className="text-blue-600 underline">Join now</Link>
        </p>

        {/* Right Social */}
        <div className="flex items-center gap-4 text-black">
          <MdClose className="cursor-pointer" />
          <FaFacebookF className="cursor-pointer" />
          <FaPinterestP className="cursor-pointer" />
          <FaInstagram className="cursor-pointer" />
        </div>
       </div>
      </div>
      

 <div className='   bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-background to-foreground'>
       {/* Main Navbar */}
      <nav className="flex container mx-auto items-center justify-between  py-3">
        {/* Left Nav Links */}
        <div className="flex items-center gap-6 font-medium  text-md text-gray-800 dark:text-gray-200">
          <Link href="#" className="text-pink-500">Home</Link>
          <Link href="#">Shop <span className="text-lg">+</span></Link>
          <Link href="#">Blog</Link>
          <Link href="#">Contact</Link>
        
        </div>

        {/* Center Logo */}
        <div className="text-2xl font-extrabold tracking-wide flex flex-col items-center gap-1">
          <Image 
          src={"https://i.postimg.cc/bvC7bvn0/babytoysbd-logo.png"}
          alt='babytoysbd'
          className='animate-appearance-in'
          sizes='80'
          width={80}
          height={80}
          />
         <div className='hidden'>
           <span className="text-yellow-400">Baby</span>
          <span className="text-sky-500">T</span>
          <span className="text-yellow-400">o</span>
          <span className="text-pink-400">y</span>
          <span className="text-gray-800">s</span>
          <span className="text-gray-600">BD</span>
         </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-5 text-2xl text-black dark:text-gray-200">
          <IoSearchOutline className="cursor-pointer" />
          <IoHeartOutline className="cursor-pointer" />
          <IoBagOutline className="cursor-pointer" />
          <ProfileBar/>
          
          <select className="ml-2 text-sm border-none focus:outline-none bg-transparent cursor-pointer">
            <option>English</option>
            <option>বাংলা</option>
          </select>
          <ThemeSwitch/>
        </div>
      </nav>
 </div>
</div>
    </header>
  );
}
