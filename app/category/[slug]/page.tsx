"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Discount from "@/components/Discount";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import { categoryNames } from "@/Types/data";
import { FaSquare } from "react-icons/fa";
import { PiLineVerticalBold } from "react-icons/pi";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import Loading from "@/app/loading";
import { ProductI } from "@/Types/ProductsI";
import { FiFilter } from "react-icons/fi";
import { CategoryBannerI } from "@/Types/CategoryBannerI";
import Image from "next/image";

export default function CategoryPage() {
  const API_URL = "https://ecommecekhaled.renix4tech.com/api/v1";
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug ?? "";

  const [loading, setLoading] = useState(true);
  const [childrenIds, setChildrenIds] = useState<number[]>([]);
  const [products, setProducts] = useState<ProductI[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [columns, setColumns] = useState(4);
  const [categoryTitleDynamic, setCategoryTitleDynamic] = useState("");
  const [categoryBanners, setCategoryBanners] = useState<CategoryBannerI[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 12;
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [filterBrands, setFilterBrands] = useState<string[]>([]);
  const [filterMaterials, setFilterMaterials] = useState<string[]>([]);
  const [filterColors, setFilterColors] = useState<string[]>([]);
  const [filterCategories, setFilterCategories] = useState<any[]>([]);

  // 1️⃣ جلب القسم الفرعي والـ banners
  useEffect(() => {
    async function fetchCategoryChildren() {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();

      const mainCategory = data.data?.find((c: any) => c.slug === slug);
      if (!mainCategory) {
        console.warn("القسم غير موجود للـ slug:", slug);
        setLoading(false);
        return;
      }

      setCategoryTitleDynamic(mainCategory.name);
      setCategoryBanners(mainCategory.category_banners || []);
      setSubCategories(mainCategory.children || []);
      setFilterCategories(mainCategory.children || []);

      const childrenIds =
        mainCategory.children?.map((child: any) => child.id) || [];
      if (childrenIds.length === 0) childrenIds.push(mainCategory.id);
      setChildrenIds(childrenIds);
    }

    fetchCategoryChildren();
  }, [slug]);

  // 2️⃣ تغيير عدد الأعمدة حسب حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setColumns(2);
      } else {
        setColumns(4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 3️⃣ جلب المنتجات والفلاتر
  useEffect(() => {
    if (childrenIds.length === 0) return;

    async function fetchProducts() {
      const query = childrenIds.join(",");
      const res = await fetch(`${API_URL}/products?category_id=${query}`);
      const data = await res.json();
      const list = data.data || [];
      setProducts(list);

      // الفلاتر الديناميكية
      setFilterBrands([
        ...new Set(
          list.map((p: any) => p.brand?.name).filter((b): b is string => !!b)
        ),
      ]);
      setFilterMaterials([
        ...new Set(
          list.map((p: any) => p.materials?.name).filter((m): m is string => !!m)
        ),
      ]);
      setFilterColors([
        ...new Set(
          list
            .flatMap((p: any) => p.colors?.map((c: any) => c.name) || [])
            .filter((c): c is string => !!c)
        ),
      ]);

      setLoading(false);
    }

    fetchProducts();
  }, [childrenIds]);

  if (loading) return <Loading />;

  const paginatedProducts = products.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const gridClass =
    columns === 1
      ? "grid grid-cols-1 gap-4 "
      : columns === 2
      ? "grid grid-cols-2 gap-4"
      : columns === 3
      ? "grid grid-cols-3 gap-4"
      : "grid grid-cols-4 gap-4";

  return (
    <section className="px-6 lg:px-[15%] py-5 grid grid-col-1 md:grid-cols-4 gap-5" dir="rtl">
      {/* Sidebar */}
      <div className="hidden lg:block lg:col-span-1 shadow-xl ">
        <ProductFilter
          brands={filterBrands}
          materials={filterMaterials}
          colors={filterColors}
          categories={filterCategories}
        />
      </div>

      {/* Main content */}
      <div className="lg:col-span-3 col-span-4 flex flex-col items-center">
        {products.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد منتجات في هذا القسم.</p>
        ) : (
          <div>
            <p className="font-bold text-[20px]">{categoryTitleDynamic}</p>

            {/* Banner */}
            <div className="my-4 mb-9">
              <Discount
                src={categoryBanners[0]?.image?.trimStart() || "/images/d2.jpg"}
                href={`/category`}
              />
            </div>

            {/* Sub Categories */}
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
                  <p className="text-center text-pro font-semibold text-sm">{sub.name}</p>
                </div>
              ))}
            </div>

            {/* Grid Controls */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-[16px] lg:text-[22px] font-semibold">
                عرض <span className="mx-2">{products.length}</span> نتيجة
              </p>
              <div className="text-gray-500 flex gap-2">
                {/* Buttons columns */}
                {[4,3,2,1].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColumns(c)}
                    className={`${columns === c ? "text-pro" : ""} ${c>2?"hidden lg:block":c===2?"": "md:hidden block"}`}
                  >
                    <div className="flex">
                      <PiLineVerticalBold />
                      {Array(c).fill(0).map((_,i)=><FaSquare key={i} size={20}/>)}
                      <PiLineVerticalBold />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Filter */}
            <div>
              <button onClick={() => setShowFilter(true)}>
                <div className="flex items-center gap-2 lg:hidden mb-4 cursor-pointer">
                  <FiFilter size={22} />
                  <p className="font-bold text-[1.1rem] cursor-pointer">تصفية</p>
                </div>
              </button>
              {showFilter && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowFilter(false)}></div>}
              <div className={`fixed top-0 right-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ${showFilter ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex justify-between items-center p-4 border-b">
                  <p className="font-bold text-lg">تصفية</p>
                  <button className="text-gray-500 cursor-pointer hover:text-gray-700 text-xl" onClick={() => setShowFilter(false)}>✕</button>
                </div>
                <div className="p-4 overflow-y-auto">
                  <ProductFilter
                    brands={filterBrands}
                    materials={filterMaterials}
                    colors={filterColors}
                    categories={filterCategories}
                  />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`${gridClass}`}>
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} {...product} classNameCate="hidden"/>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="text-center mt-6">
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(products.length / rowsPerPage)}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              sx={{ "& .MuiPaginationItem-icon": { transform: "scaleX(-1)" } }}
            />
          </Stack>
        </div>
      </div>
    </section>
  );
}
