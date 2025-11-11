"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  FaAngleDown,
  FaHeart,
  FaQuestionCircle,
  FaRegUser,
} from "react-icons/fa";
import {
  FaArrowRightFromBracket,
  FaClipboardCheck,
  FaMapLocationDot,
  FaUser,
} from "react-icons/fa6";

import { useAuth } from "@/src/context/AuthContext";
import Image from "next/image";

export default function DropdownUser() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { fullName, userImage, logout } = useAuth();
  const { data: session } = useSession();

  const displayName = fullName || session?.user?.name || "مستخدم";

  const displayImage =
    userImage || session?.user?.image || "/images/default-user.png";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!displayName) return null;

  const handleLinkClick = () => setOpen(false);

  const handleLogout = () => {
    logout();
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="relative hidden1" ref={menuRef}>
      {/* user button */}
      <div
        className="flex items-center gap-3 bg-gray-100 text-gray-700 cursor-pointer p-2 rounded"
        onClick={() => setOpen(!open)}
      >
        <FaRegUser size={20} />

        <div className="flex flex-col">
          <p>
            أهلاً ,<span className=" capitalize "> {displayName}</span>
          </p>
        </div>
        <FaAngleDown />
      </div>

      {/* dropdown menu */}
      <div
        className={`absolute top-[4.1rem] end-0 bg-white shadow-2xl rounded-xl p-2 z-50 w-47 flex flex-col transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <Link href="/myAccount" onClick={handleLinkClick}>
          <div className="flex items-center gap-3 hover:bg-blue-100 cursor-pointer p-2 rounded">
            <FaUser size={18} />
            <p>حسابي</p>
          </div>
        </Link>

        <Link href="/myAccount/orders" onClick={handleLinkClick}>
          <div className="flex items-center gap-3 hover:bg-blue-100 cursor-pointer p-2 rounded">
            <FaClipboardCheck size={18} />
            <p>طلباتي</p>
          </div>
        </Link>

        <Link href="/myAccount/favorites" onClick={handleLinkClick}>
          <div className="flex items-center gap-3 hover:bg-blue-100 cursor-pointer p-2 rounded">
            <FaHeart size={18} />
            <p>منتجاتي المفضلة</p>
          </div>
        </Link>

        <Link href="/myAccount/addresses" onClick={handleLinkClick}>
          <div className="flex items-center gap-3 hover:bg-blue-100 cursor-pointer p-2 rounded">
            <FaMapLocationDot size={18} />
            <p>إدارة العناوين</p>
          </div>
        </Link>

        <Link href="/myAccount/help" onClick={handleLinkClick}>
          <div className="flex items-center gap-3 hover:bg-blue-100 cursor-pointer p-2 rounded">
            <FaQuestionCircle size={18} />
            <p>مركز المساعدة</p>
          </div>
        </Link>

        <div
          onClick={handleLogout}
          className="flex items-center gap-3 hover:bg-blue-100 cursor-pointer text-gray-400 p-2 rounded"
        >
          <FaArrowRightFromBracket size={18} />
          <p>تسجيل الخروج</p>
        </div>
      </div>
    </div>
  );
}
