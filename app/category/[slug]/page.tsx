"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Discount from "@/components/Discount";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import { FaSquare } from "react-icons/fa";
import { PiLineVerticalBold } from "react-icons/pi";
import { FiFilter } from "react-icons/fi";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import Loading from "@/app/loading";
import Image from "next/image";
import { ProductI } from "@/Types/ProductsI";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useTheme } from "@mui/material/styles";

// =========================
// أنواع البيانات
// =========================

interface Brand {
  name: string;
}

interface Material {
  name: string;
}

interface Color {
  name: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  children?: Category[];
  category_banners?: { image: string }[];
}

interface Filters {
  available: boolean;
  brands: string[];
  materials: string[];
  colors: string[];
  categories: number[];
}

export default function CategoryPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug ?? "";

  const [loading, setLoading] = useState(true);

  const [childrenIds, setChildrenIds] = useState<number[]>([]);
  const [products, setProducts] = useState<ProductI[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductI[]>([]);

  const [showFilter, setShowFilter] = useState(false);
  const [columns, setColumns] = useState<number>(4);

  const [categoryTitleDynamic, setCategoryTitleDynamic] = useState<string>("");
  const [categoryBanners, setCategoryBanners] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);

  const [filterBrands, setFilterBrands] = useState<string[]>([]);
  const [filterMaterials, setFilterMaterials] = useState<string[]>([]);
  const [filterColors, setFilterColors] = useState<string[]>([]);
  const [filterCategories, setFilterCategories] = useState<Category[]>([]);

  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 12;

  const [priceOrder, setPriceOrder] = useState<"" | "asc" | "desc" | "rating">(
    ""
  );

  // =========================
  // 1) Fetch Categories
  // =========================
  useEffect(() => {
    async function fetchCategoryChildren() {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();

      const allCategories: Category[] = data.data || [];

      const mainCategory = allCategories.find((c) => c.slug === slug);
      if (!mainCategory) {
        setLoading(false);
        return;
      }

      setCategoryTitleDynamic(mainCategory.name);
      setCategoryBanners(mainCategory.category_banners || []);
      setSubCategories(mainCategory.children || []);
      setFilterCategories(mainCategory.children || []);

      const ids = mainCategory.children?.map((child) => child.id) || [
        mainCategory.id,
      ];

      setChildrenIds(ids);
    }

    fetchCategoryChildren();
  }, [slug]);

  // =========================
  // 2) Fetch Products
  // =========================
  useEffect(() => {
    if (childrenIds.length === 0) return;

    async function fetchProducts() {
      const query = childrenIds.join(",");
      const res = await fetch(`${API_URL}/products?category_id=${query}`);
      const data = await res.json();

      const list: ProductI[] = data.data || [];
      setProducts(list);
      setFilteredProducts(list);

      setFilterMaterials([
        ...new Set(
          list
            .flatMap((p) => p.materials?.map((m) => m.name) || [])
            .filter((b): b is string => !!b)
        ),
      ]);

      setFilterColors([
        ...new Set(
          list
            .flatMap((p) => p.colors?.map((c) => c.name) || [])
            .filter(Boolean)
        ),
      ]);

      setLoading(false);
    }

    fetchProducts();
  }, [childrenIds]);

  // =========================
  // 3) Filtering Function
  // =========================
  const handleFilterChange = (filters: Filters) => {
    let result = [...products];

    if (filters.available) {
      result = result.filter((p) => p.stock);
    }

    if (filters.categories.length > 0) {
      result = result.filter(
        (p) => p.category && filters.categories.includes(p.category.id)
      );
    }

    if (filters.materials.length > 0) {
      result = result.filter(
        (p) =>
          p.materials &&
          p.materials.some((m) => filters.materials.includes(m.name))
      );
    }

    if (filters.colors.length > 0) {
      result = result.filter((p) => {
        const productColors = p.colors?.map((c) => c.name) || [];
        return productColors.some((c) => filters.colors.includes(c));
      });
    }

    setFilteredProducts(result);
    setPage(1);
  };

  // =========================
  // 4) Price / Rating Sorting
  // =========================
  const sortedProducts = useMemo(() => {
    if (priceOrder === "") return filteredProducts;

    const sorted = [...filteredProducts];

    if (priceOrder === "asc" || priceOrder === "desc") {
      sorted.sort((a, b) => {
        const priceA = Number(a.final_price ?? a.price ?? 0);
        const priceB = Number(b.final_price ?? b.price ?? 0);
        return priceOrder === "asc" ? priceA - priceB : priceB - priceA;
      });
    } else if (priceOrder === "rating") {
      sorted.sort((a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0));
    }

    return sorted;
  }, [filteredProducts, priceOrder]);

  // =========================
  // 5) Pagination
  // =========================
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedProducts.slice(start, end);
  }, [sortedProducts, page]);

  if (loading) return <Loading />;

  const gridClass =
    columns === 1
      ? "grid grid-cols-1 gap-4"
      : columns === 2
      ? "grid grid-cols-2 gap-4"
      : columns === 3
      ? "grid grid-cols-3 gap-4"
      : "grid grid-cols-4 gap-4";
  const options = [
    { label: "الخيارات المميزة", value: "" },
    { label: "الأعلى تقييماً", value: "rating" },
    { label: "السعر: من الأقل إلى الأكثر", value: "asc" },
    { label: "السعر: من الأكثر إلى الأقل", value: "desc" },
  ];
  return (
    <section
      className="px-6 lg:px-[15%] py-5 grid grid-col-1 md:grid-cols-4 gap-5"
      dir="rtl"
    >
      {/* Sidebar */}
      <div className="hidden lg:block lg:col-span-1 shadow-xl">
        <ProductFilter
          brands={filterBrands}
          materials={filterMaterials}
          colors={filterColors}
          categories={filterCategories}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Main content */}
      <div className="lg:col-span-3 col-span-4 flex flex-col items-center">
        <div className="flex flex-col">
          <p className="font-bold text-[20px]">{categoryTitleDynamic}</p>

          <div className="my-4 mb-9">
            <Discount
              src={categoryBanners[0]?.image?.trimStart() || "/images/d2.jpg"}
              href={`/category`}
            />
          </div>

          {/* Sub categories */}
          <div className="flex gap-4 overflow-x-auto py-3">
            {subCategories.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-col justify-center items-center gap-1 cursor-pointer"
              >
                <Image
                  src={sub.image || "/images/o1.jpg"}
                  alt={sub.name}
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
                <p className="text-center text-pro font-semibold text-sm">
                  {sub.name}
                </p>
              </div>
            ))}
          </div>

          {/* Grid Controls + Price Dropdown */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full mb-5 gap-3">
            <p className="text-[16px] lg:text-[22px] font-semibold">
              عرض <span className="mx-2">{filteredProducts.length}</span> نتيجة
            </p>

            <div className="flex gap-2 items-center">
              {[4, 3, 2, 1].map((c) => (
                <button
                  key={c}
                  onClick={() => setColumns(c)}
                  className={`${columns === c ? "text-pro" : "text-gray-400"} ${
                    c > 2 ? "hidden lg:block" : c === 2 ? "" : "md:hidden block"
                  }`}
                >
                  <div className="flex">
                    <PiLineVerticalBold />
                    {Array(c)
                      .fill(0)
                      .map((_, i) => (
                        <FaSquare key={i} size={20} />
                      ))}
                    <PiLineVerticalBold />
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Price Filter Dropdown */}
          <div className="md:text-end mb-2">
            <FormControl sx={{ width: 200}}>
              <Select
                value={priceOrder}
                onChange={(e) =>
                  setPriceOrder(
                    e.target.value as "" | "asc" | "desc" | "rating"
                  )
                }
                input={<OutlinedInput />}
                displayEmpty
                sx={{
                  textAlign: "right",
                  bgcolor: "white",
                  color: "blue.700",
                  borderColor: "blue.400",
                  fontWeight: 600,
                  p: 0,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "blue.50",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "blue.400",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "blue.300",
                    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)",
                  },
                }}
                renderValue={(selected) => {
                  const found = options.find((o) => o.value === selected);
                  return found?.label || <em>الخيارات المميزة</em>;
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Mobile Filter Button */}
          <button onClick={() => setShowFilter(true)}>
            <div className="flex items-center gap-2 lg:hidden mb-4 cursor-pointer">
              <FiFilter size={22} />
              <p className="font-bold text-[1.1rem] cursor-pointer">تصفية</p>
            </div>
          </button>

          {showFilter && (
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowFilter(false)}
            ></div>
          )}

          {/* Mobile Filter Drawer */}
          <div
            className={`fixed top-0 right-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ${
              showFilter ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <p className="font-bold text-lg">تصفية</p>
              <button
                className="text-gray-500 cursor-pointer hover:text-gray-700 text-xl"
                onClick={() => setShowFilter(false)}
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              <ProductFilter
                brands={filterBrands}
                materials={filterMaterials}
                colors={filterColors}
                categories={filterCategories}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Products Grid */}
          {paginatedProducts.length === 0 ? (
            <p className="text-center text-gray-500">
              لا توجد منتجات مطابقة للفلاتر.
            </p>
          ) : (
            <div className={gridClass}>
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image || "/images/c1.png"}
                  
                  price={(product.price ?? 1).toString()}
                  final_price={product.final_price}
                  discount={
                    product.discount
                      ? {
                          value: product.discount.value.toString(),
                          type: product.discount.type.toString(),
                        }
                      : null
                  }
                  stock={product.stock || 0}
                  average_rating={product.average_rating}
                  reviews={product.reviews}
                  classNameCate="hidden"
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="self-center text-center mt-6">
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(sortedProducts.length / rowsPerPage)}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-icon": { transform: "scaleX(-1)" },
                  
                }}
              />
            </Stack>
          </div>
        </div>
      </div>
    </section>
  );
}
