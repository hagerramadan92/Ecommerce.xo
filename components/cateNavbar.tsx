"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CategoryI } from "@/Types/CategoriesI";
import { fetchApi } from "@/lib/api";

export default function CateNavbar() {
  const [categories, setCategories] = useState<CategoryI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCats = async () => {
      try {
        const data = await fetchApi("categories?type=parent");
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    getCats();
  }, []);

  if (loading) return <div>Loading…</div>;

  return (
    <div className="hidden1 justify-between py-2.5 px-[5%] xl:px-[15%] shadow">
      <Link href={"/product"}>كل المنتاجات</Link>
      {categories.map((cat) => (
        <div key={cat.id} className="group relative px-3 cursor-pointer">
          <Link
            href={`/category/${cat.id}`}
            className="text-[1rem] text-pro-hover"
          >
            {cat.name}
          </Link>

    
          {Array.isArray(cat.children) && cat.children.length > 0 && (
            <div className="absolute start-0 top-full hidden group-hover:block bg-white shadow-lg rounded-lg min-w-[200px] py-2 z-50">
              {cat.children.map((child: CategoryI) => (
                <Link
                  key={child.id}
                  href={`/category/${child.id}`}
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700 whitespace-nowrap"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
