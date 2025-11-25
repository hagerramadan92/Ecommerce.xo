"use client";
import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import SelectBoxComponent from "./SelectBoxComponent";

// تعريف نوع الفلاتر
type Filters = {
  available: boolean;
  categories: number[];
  brands: string[];
  materials: string[];
  colors: string[];
};

type Category = { id: number; name: string };

type ProductFilterProps = {
  brands?: string[];
  materials?: string[];
  colors?: string[];
  categories?: Category[];
  onFilterChange?: (filters: Filters) => void;
};

export default function ProductFilter({
  brands = [],
  materials = [],
  colors = [],
  categories = [],
  onFilterChange = () => {},
}: ProductFilterProps) {
  const [filters, setFilters] = useState<Filters>({
    available: false,
    categories: [],
    brands: [],
    materials: [],
    colors: [],
  });


  const toggle = (type: keyof Filters, value?: string | number) => {
    setFilters((prev) => {
      const updated = { ...prev };

      if (type === "available") {
        updated.available = !prev.available;
      } else if (type === "categories") {
        updated.categories = prev.categories.includes(value as number)
          ? prev.categories.filter((v) => v !== value)
          : [...prev.categories, value as number];
      } else if (type === "brands") {
        updated.brands = prev.brands.includes(value as string)
          ? prev.brands.filter((v) => v !== value)
          : [...prev.brands, value as string];
      } else if (type === "materials") {
        updated.materials = prev.materials.includes(value as string)
          ? prev.materials.filter((v) => v !== value)
          : [...prev.materials, value as string];
      } else if (type === "colors") {
        updated.colors = prev.colors.includes(value as string)
          ? prev.colors.filter((v) => v !== value)
          : [...prev.colors, value as string];
      }

      onFilterChange(updated); 
      return updated;
    });
  };

  return (
    <div className="px-4 rounded h-screen">

      <div className="flex items-center gap-2">
        <FiFilter size={22} />
        <p className="font-bold text-[1.1rem]">تصفية</p>
      </div>

    
      <div className="border-b border-gray-300 pb-3">
        <SelectBoxComponent title="المتوفر">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 accent-blue-900"
              checked={filters.available}
              onChange={() => toggle("available")}
            />
            <p className="text-gray-700">إخفاء غير المتوفر</p>
          </label>
        </SelectBoxComponent>
      </div>

    
      <div className="border-b border-gray-300 pb-3">
        <SelectBoxComponent title="فئات المنتج">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 cursor-pointer select-none my-2"
            >
              <input
                type="checkbox"
                className="w-4 h-4 accent-blue-900"
                checked={filters.categories.includes(cat.id)}
                onChange={() => toggle("categories", cat.id)}
              />
              <p className="text-gray-700">{cat.name}</p>
            </label>
          ))}
        </SelectBoxComponent>
      </div>

    
      <div className="border-b border-gray-300 pb-3">
        <SelectBoxComponent title="العلامة التجارية">
          {brands.map((b, i) => (
            <label
              key={i}
              className="flex items-center gap-2 cursor-pointer select-none my-2"
            >
              <input
                type="checkbox"
                className="w-4 h-4 accent-blue-900"
                checked={filters.brands.includes(b)}
                onChange={() => toggle("brands", b)}
              />
              <p className="text-gray-700">{b}</p>
            </label>
          ))}
        </SelectBoxComponent>
      </div>

  
      <div className="border-b border-gray-300 pb-3">
        <SelectBoxComponent title="الخامات المستخدمة">
          {materials.map((m, i) => (
            <label
              key={i}
              className="flex items-center gap-2 cursor-pointer select-none my-2"
            >
              <input
                type="checkbox"
                className="w-4 h-4 accent-blue-900"
                checked={filters.materials.includes(m)}
                onChange={() => toggle("materials", m)}
              />
              <p className="text-gray-700">{m}</p>
            </label>
          ))}
        </SelectBoxComponent>
      </div>

  
      <div className="border-b border-gray-300 pb-3">
        <SelectBoxComponent title="اللون">
          {colors.map((c, i) => (
            <label
              key={i}
              className="flex items-center gap-2 cursor-pointer select-none my-2"
            >
              <input
                type="checkbox"
                className="w-4 h-4 accent-blue-900"
                checked={filters.colors.includes(c)}
                onChange={() => toggle("colors", c)}
              />
              <span
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{ background: c }}
              ></span>
              <p className="text-gray-700">{c}</p>
            </label>
          ))}
        </SelectBoxComponent>
      </div>
    </div>
  );
}
