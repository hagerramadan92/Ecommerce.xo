"use client";

import React, { useState, useEffect } from "react";
import { CgSearch } from "react-icons/cg";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface classProps {
  className?: string;
}

export default function SearchComponent({ className }: classProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // جلب النتايج أثناء الكتابة (للـ autocomplete)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim().length > 0) {
        fetchProducts();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [query]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?search=${query}`
      );
      const data = await res.json();
      setResults(data?.data || []);
    } catch (error) {
      console.log("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // لما يضغط Enter → يروح لصفحة /search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery(""); // اختياري: إفراغ الحقل بعد البحث
      setResults([]); // إخفاء الـ dropdown
    }
  };

  return (
    <div className={`relative w-full xl:w-[60%] ${className}`}>
      <input
        type="text"
        placeholder="ابحث عن منتج..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown} // ← هنا اللي بيخلي Enter ينقلك
        className="w-full border border-gray-300 rounded-md py-2 pe-10 ps-2 text-[1rem]
        focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 transition-all duration-200"
      />

      <CgSearch
        size={20}
        className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none z-50"
      />

      {/* Dropdown للنتايج أثناء الكتابة */}
      {query.length > 0 && (
        <div className="absolute bg-white w-full border rounded-md shadow top-full mt-2 max-h-96 overflow-y-auto z-50">
          {loading && <p className="text-center py-4">جارٍ البحث...</p>}

          {!loading && results.length === 0 && (
            <p className="text-center py-4 text-gray-500">لا توجد نتايج</p>
          )}

          {!loading &&
            results.map((item: any) => (
              <Link
                href={`/product/${item.id}`}
                key={item.id}
                onClick={() => {
                  setQuery("");
                  setResults([]);
                }}
              >
                <div className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0">
                  <p className="font-medium">{item.name}</p>
                  {item.price && (
                    <p className="text-sm text-gray-600">{item.price} جنيه</p>
                  )}
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}