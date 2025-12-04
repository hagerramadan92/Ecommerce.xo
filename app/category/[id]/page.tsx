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

interface CategoryChild {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

interface CategoryData {
  id: number;
  name: string;
  slug: string;
  image?: string;
  sub_image?: string;
  is_parent: boolean;
  children: CategoryChild[];
  products: ProductI[];
  category_banners: { image: string }[];
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
  const { id } = useParams();
  const categoryId = id as string;

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<CategoryData | null>(null);

  const [allProducts, setAllProducts] = useState<ProductI[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductI[]>([]);

  const [showFilter, setShowFilter] = useState(false);
  const [columns, setColumns] = useState<number>(4);

  const [filterMaterials, setFilterMaterials] = useState<string[]>([]);
  const [filterColors, setFilterColors] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<CategoryChild[]>([]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 12;
  const [priceOrder, setPriceOrder] = useState<"" | "asc" | "desc" | "rating">("");

  // رفعنا الدالة للأعلى عشان ما يحصلش خطأ Hoisting
  const extractFilters = (products: ProductI[]) => {
    const materials = [
      ...new Set(
        products
          .flatMap((p) => p.materials?.map((m) => m.name) || [])
          .filter(Boolean)
      ),
    ];
    const colors = [
      ...new Set(
        products
          .flatMap((p) => p.colors?.map((c) => c.name) || [])
          .filter(Boolean)
      ),
    ];

    setFilterMaterials(materials as string[]);
    setFilterColors(colors as string[]);
  };

  // جلب الكاتيجوري والمنتجات
  useEffect(() => {
    if (!categoryId) return;

    async function fetchCategoryAndProducts() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/categories/${categoryId}`);
        const result = await res.json();

        if (result.status && result.data) {
          const cat: CategoryData = result.data;
          setCategory(cat);
          setSubCategories(cat.children || []);

          // لو الكاتيجوري أب → نجيب منتجات كل الأبناء
          if (cat.is_parent && cat.children.length > 0) {
            const allProds: ProductI[] = [...cat.products];

            for (const child of cat.children) {
              try {
                const childRes = await fetch(`${API_URL}/categories/${child.id}`);
                const childData = await childRes.json();
                if (childData.status && childData.data?.products) {
                  allProds.push(...childData.data.products);
                }
              } catch (err) {
                console.error(`Error fetching child ${child.id}:`, err);
              }
            }

            // إزالة التكرار
            const uniqueProducts = Array.from(
              new Map(allProds.map((p) => [p.id, p])).values()
            );

            setAllProducts(uniqueProducts);
            setFilteredProducts(uniqueProducts);
            extractFilters(uniqueProducts); // تمام دلوقتي
          } else {
            // كاتيجوري فرعية
            const prods = cat.products || [];
            setAllProducts(prods);
            setFilteredProducts(prods);
            extractFilters(prods);
          }
        }
      } catch (err) {
        console.error("Error fetching category:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryAndProducts();
  }, [categoryId]);

  // باقي الكود زي ما هو (الفلترة، ترتيب، pagination...)

  const handleFilterChange = (filters: Filters) => {
    let result = [...allProducts];

    if (filters.available) {
      result = result.filter((p) => (p.stock ?? 0) > 0);
    }

    if (filters.categories.length > 0) {
      result = result.filter((p) =>
        filters.categories.includes(p.category?.id || 0)
      );
    }

    if (filters.materials.length > 0) {
      result = result.filter((p) =>
        p.materials?.some((m) => filters.materials.includes(m.name))
      );
    }

    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors?.some((c) => filters.colors.includes(c.name))
      );
    }

    setFilteredProducts(result);
    setPage(1);
  };

  const sortedProducts = useMemo(() => {
    if (!priceOrder) return filteredProducts;
    const sorted = [...filteredProducts];

    if (priceOrder === "asc" || priceOrder === "desc") {
      sorted.sort((a, b) => {
        const pa = Number(a.final_price ?? a.price ?? 0);
        const pb = Number(b.final_price ?? b.price ?? 0);
        return priceOrder === "asc" ? pa - pb : pb - pa;
      });
    } else if (priceOrder === "rating") {
      sorted.sort((a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0));
    }
    return sorted;
  }, [filteredProducts, priceOrder]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedProducts.slice(start, start + rowsPerPage);
  }, [sortedProducts, page]);

  const handleFavoriteChange = (productId: number, newValue: boolean) => {
    const update = (arr: ProductI[]) =>
      arr.map((p) => (p.id === productId ? { ...p, is_favorite: newValue } : p));

    setAllProducts(update);
    setFilteredProducts(update);
  };

  if (loading) return <Loading />;

  if (!category) {
    return (
      <div className="text-center py-20 text-2xl text-gray-600" dir="rtl">
        القسم غير موجود
      </div>
    );
  }

  const gridClass =
    columns === 1 ? "grid grid-cols-1 gap-6"
      : columns === 2 ? "grid grid-cols-2 gap-6"
      : columns === 3 ? "grid grid-cols-3 gap-6"
      : "grid grid-cols-4 gap-6";

  const options = [
    { label: "الخيارات المميزة", value: "" },
    { label: "الأعلى تقييماً", value: "rating" },
    { label: "من الأقل إلى الأكثر", value: "asc" },
    { label: "من الأكثر إلى الأقل", value: "desc" },
  ];
  return (
    <section
      className="px-6 lg:px-[15%] py-5 grid grid-cols-1 md:grid-cols-4 gap-5"
      dir="rtl"
    >
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:col-span-1 shadow-xl">
        <ProductFilter
          brands={[]}
          materials={filterMaterials}
          colors={filterColors}
          categories={subCategories}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 col-span-4">
        <div className="w-full max-w-7xl mx-auto">
          <h1 className="font-bold text-[20px] mb-4">{category.name}</h1>

          {/* Banner */}
          {category.category_banners?.[0]?.image && (
            <div className="my-6">
              <Discount src={category.category_banners[0].image} href="#" />
            </div>
          )}

          {/* Sub Categories */}
          {subCategories.length > 0 && (
            <div className="flex gap-6 overflow-x-auto py-4 mb-8">
              {subCategories.map((sub) => (
                <a
                  href={`/category/${sub.id}`}
                  key={sub.id}
                  className="flex flex-col items-center gap-2 min-w-fit"
                >
                  <Image
                    src={sub.image || "/images/o1.jpg"}
                    alt={sub.name}
                    width={100}
                    height={100}
                    className="rounded-full object-cover border"
                  />
                  <p className="text-sm font-semibold text-center">{sub.name}</p>
                </a>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <p className="text-lg font-semibold">
              عرض <span className="mx-2">{filteredProducts.length}</span> نتيجة
            </p>

            <div className="flex gap-3">
              {[4, 3, 2, 1].map((c) => (
                <button
                  key={c}
                  onClick={() => setColumns(c)}
                  className={`${columns === c ? "text-pro" : "text-gray-400"} ${
                    c > 2 ? "hidden lg:block" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <PiLineVerticalBold />
                    {Array(c).fill(0).map((_, i) => (
                      <FaSquare key={i} size={20} />
                    ))}
                    <PiLineVerticalBold />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="mb-6 flex justify-end">
            <FormControl sx={{ width: 220 }}>
              <Select
                value={priceOrder}
                onChange={(e) => setPriceOrder(e.target.value as any)}
                input={<OutlinedInput />}
                displayEmpty
                renderValue={(selected) => {
                  return options.find((o) => o.value === selected)?.label || "الخيارات المميزة";
                }}
              >
                {options.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 lg:hidden mb-6 text-lg font-bold"
          >
            <FiFilter size={22} />
            تصفية
          </button>

          {/* Products Grid */}
          {paginatedProducts.length === 0 ? (
            <p className="text-center py-16 text-gray-500">
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
                  images={
                    product.images?.length
                      ? product.images
                      : [{ url: "/images/c1.png", alt: "default" }]
                  }
                  price={(product.price ?? 1).toString()}
                  final_price={product.final_price}
                  discount={
                    product.discount
                      ? {
                          value: product.discount.value.toString(),
                          type: product.discount.type,
                        }
                      : null
                  }
                  stock={product.stock || 0}
                  average_rating={product.average_rating}
                  reviews={product.reviews}
                  is_favorite={product.is_favorite}
                  onFavoriteChange={handleFavoriteChange}
                  className2="hidden"
                  Bottom="bottom-41.5"
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {sortedProducts.length > rowsPerPage && (
            <div className="mt-10 flex justify-center">
              <Stack spacing={2}>
                <Pagination
                  count={Math.ceil(sortedProducts.length / rowsPerPage)}
                  page={page}
                  onChange={(_e, val) => setPage(val)}
                  color="primary"
                  size="large"
                  sx={{ "& .MuiPaginationItem-icon": { transform: "scaleX(-1)" } }}
                />
              </Stack>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilter && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowFilter(false)}
          />
          <div
            className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl transition-transform ${
              showFilter ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="font-bold text-lg">تصفية</h3>
              <button onClick={() => setShowFilter(false)} className="text-2xl">
                ×
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              <ProductFilter
                brands={[]}
                materials={filterMaterials}
                colors={filterColors}
                categories={subCategories}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}