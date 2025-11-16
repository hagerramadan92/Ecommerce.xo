"use client";
import Image from "next/image";
import { CgSearch } from "react-icons/cg";
import { FaBars, FaRegUser } from "react-icons/fa";
import { LuPhone } from "react-icons/lu";
import Link from "next/link";
import { categories, link } from "@/Types/data";
import SubIcon from "./subIcon";
import CategoriesDropdown from "./DropdownComponent";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineCloseCircle } from "react-icons/ai";
import SearchComponent from "./SearchComponent";
import CartSidebar from "./CartSideBar";
import DropdownUser from "./DropdownUser";
import { useAuth } from "@/src/context/AuthContext";

export default function SearchNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const categories2 = link;
  const links2 = categories;

  const { fullName } = useAuth(); // حالة تسجيل الدخول

  return (
    <>
      {/* Navbar */}
      <div className="flex items-center px-[5%] xl:px-[10%] py-6 shadow lg:shadow-none justify-between lg:gap-10 border-b border-gray-200">
        <div className="flex items-center gap-2 lg:gap-10 lg:flex-1">
          {/* Bars Icon */}
          <div className="flex1 items-center">
            <div
              onClick={() => setMenuOpen(true)}
              className="bg-[#4a4a4a] rounded-full p-2 text-white cursor-pointer"
            >
              <FaBars size={15} />
            </div>
          </div>

          {/* Logo */}
          <div className="relative w-20 lg:w-[110px] h-11 me-2 lg:me-0">
            <Image
              src="/images/zeejlogo.png"
              alt="logo"
              fill
              loading="eager"
              className="object-contain"
            />
          </div>

          {/* Search Input */}
          <SearchComponent className="hidden1" />
        </div>

        {/* Right Section */}
        <div className="flex items-center lg:gap-5 gap-3 relative">
          {/* Phone */}
          <div className="hidden2 flex-col text-sm">
            <p>أي استفسار؟</p>
            <div className="flex items-center gap-2 cursor-pointer text-pro-hover">
              <LuPhone size={20} strokeWidth={1.3} />
              <p> +966114097500</p>
            </div>
          </div>

          {/* Icons */}
          <div>
            <SubIcon
              className="flex lg:gap-5"
              className2="hidden2"
              className3="hidden1"
            />
          </div>

          <CgSearch
            size={25}
            className="flex1 cursor-pointer text-pro-hover"
            strokeWidth={0.1}
            onClick={() => setSearchOpen((prev) => !prev)}
          />

          <div className="flex gap-1 cursor-pointer">
            <CartSidebar />
          </div>

          <div className="flex1 gap-4 items-center">
            <CategoriesDropdown
              categories={categories2}
              trigger={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26.29"
                  height="23.983"
                  viewBox="0 0 26.29 23.983"
                >
                  <ellipse cx="2.244" cy="2.253" rx="2.244" ry="2.253" />
                  <ellipse cx="12.965" cy="2.253" rx="2.244" ry="2.253" />
                  <ellipse cx="23.885" cy="2.253" rx="2.244" ry="2.253" />
                  <ellipse cx="2.244" cy="11.911" rx="2.244" ry="2.253" />
                  <ellipse
                    cx="12.965"
                    cy="11.911"
                    rx="2.244"
                    ry="2.253"
                    fill="#735cfc"
                  />
                  <ellipse cx="23.885" cy="11.911" rx="2.244" ry="2.253" />
                  <ellipse cx="2.244" cy="21.729" rx="2.244" ry="2.253" />
                  <ellipse cx="13.145" cy="21.729" rx="2.244" ry="2.253" />
                  <ellipse
                    cx="24.046"
                    cy="21.729"
                    rx="2.244"
                    ry="2.253"
                    fill="#735cfc"
                  />
                </svg>
              }
            />
          </div>

          {/* 👇 زر تسجيل الدخول أو DropdownUser */}
          {!fullName ? (
            <Link
              href="/login"
              className="hidden1 flex gap-1 items-center rounded-4xl bg-pro text-white py-3 text-[0.9rem] px-4 cursor-pointer"
            >
              <FaRegUser size={15} />
              تسجيل دخول
            </Link>
          ) : (
            <DropdownUser />
          )}
        </div>
      </div>

      {/* ✅ Search Bar Animation */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="shadow-md border-b border-gray-200 overflow-hidden"
          >
            <div className="px-4 md:px-10 py-4">
              <SearchComponent className="flex1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Sidebar Menu Animation */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-full md:w-96 h-full bg-white z-50 shadow-lg flex flex-col py-2"
            >
              {/* Close Button */}
              <div className="flex justify-between shadow-2xl px-4 pb-3 mb-3">
                <h1 className="text-2xl font-semibold">سوق</h1>
                <button
                  aria-label="close taps"
                  onClick={() => setMenuOpen(false)}
                  className="self-end text-gray-600 hover:text-gray-800"
                >
                  <AiOutlineCloseCircle size={30} />
                </button>
              </div>

              <p className="text-[1.4rem] font-semibold px-4 py-4">
                تسوق حسب الاقسام
              </p>

              {/* Links */}
              <nav className="grid grid-cols-2 gap-2 overflow-y-auto flex-1 px-4">
                {links2.map((item, index) => (
                  <Link
                    key={index}
                    href={`/category/${item.slug}`}
                    className="hover:text-pro transition flex items-center gap-2 mb-2"
                    aria-label={item.title}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Image
                      src={item.src}
                      width={168}
                      height={80}
                      alt={item.title}
                    />
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
