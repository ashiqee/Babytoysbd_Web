"use client"
import { ThemeSwitch } from "@/components/theme-switch";
import Image from "next/image";
import Link from "next/link";

export default function NavbarLanding() {
  return (
    <div className="container  mx-auto">
      <div className="flex md:min-w-[870px] min-w-[395px] items-center md:mb-4 bg-slate-200/15  md:rounded-b-lg justify-between p-4">
        <div className="flex items-center md:w-[64%] md:justify-between">
          <Link href={"/"}>
            <Image
              src="https://i.postimg.cc/bvC7bvn0/babytoysbd-logo.png"
              alt="babytoysbd-logo"
              width={80}
              height={80}
            />
          </Link>

          <Link href={"/"}>
            <h1 className="md:text-4xl  text-2xl ml-10 md:ml-0 font-extrabold">
              Baby Toys BD
            </h1>
          </Link>
        </div>

        <div className="">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
}
