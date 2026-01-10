"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User,
  Spinner,
} from "@heroui/react";
import { IoPersonOutline } from "react-icons/io5";

export default function ProfileBar() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Spinner color="warning" size="sm" labelColor="warning" />;
  if (!session)
    return (
      <button onClick={() => signIn()} className="btn text-xl">
        <IoPersonOutline className="cursor-pointer" />
      </button>
    );

  return (
    <div className="flex flex-col items-center gap-2 z-30">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform z-30"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p>Welcome, {session.user?.name}</p>
            <p className="font-semibold">{session.user?.role}</p>
          </DropdownItem>
          <DropdownItem key="settings">
            <Link href={`/${session.user?.role}/dashboard`}>Dashboard</Link>
          </DropdownItem>
          <DropdownItem key="analytics">
            <Link href={`/${session.user?.role}/settings/profile`}>
              Profile Settings
            </Link>
          </DropdownItem>
          <DropdownItem key="logout" color="danger">
            <button
              onClick={() => signOut()}
              className="text-red-500 underline"
            >
              Sign Out
            </button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
     
    </div>
  );
}
