"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import { ProductI } from "@/Types/ProductsI";
import HearComponent from "@/components/HearComponent";
import { useAuth } from "@/src/context/AuthContext";
import toast from "react-hot-toast";
import RatingStars from "@/components/RatingStars";
import { BsShare } from "react-icons/bs";
import ShareButton from "@/components/ShareButton";
import { FaBarcode } from "react-icons/fa";
import StickerForm from "@/components/StickerForm";
import POVComponent from "@/components/POVComponent";
import ProductGallery from "@/components/ProductGallery";
import CustomSeparator from "@/components/Breadcrumbs";
import Image from "next/image";
import ButtonComponent from "@/components/ButtonComponent";
import ProductCard from "@/components/ProductCard";
import InStockSlider from "@/components/InStockSlider";
import Link from "next/link";
import { useAppContext } from "@/src/context/AppContext";

export default function ProductPageClient() {
  const params = useParams();
  const { id } = params;
  const { authToken: token } = useAuth();
  const [showStickerForm, setShowStickerForm] = useState(true);
  const [showPOV, setShowPOV] = useState(false);
  const [activeTab, setActiveTab] = useState<"options" | "reviews" | null>(
    "options"
  );
  const { homeData } = useAppContext();
  const categories2 = homeData?.sub_categories || [];
  const [product, setProduct] = useState<ProductI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const handleSubmit = () => {
    console.log("added to cart successfully");
    toast.success("تم إضافة المنتج إلى السلة بنجاح ");
  };

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;

      setLoading(true);
      setError(false);

      try {
        const res = await fetch(`${API_URL}/products/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error("Product not found");

        const data = await res.json();
        const prod = data.data ?? null;
        setProduct(prod);

        const savedFavorites = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        ) as number[];
        setIsFavorite(prod && savedFavorites.includes(prod.id));
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, token]);

  const toggleFavorite = async () => {
    if (!token) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!product) return;

    const newState = !isFavorite;
    setIsFavorite(newState);

    let saved = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    ) as number[];
    if (newState) {
      if (!saved.includes(product.id)) saved.push(product.id);
    } else {
      saved = saved.filter((pid) => pid !== product.id);
    }
    localStorage.setItem("favorites", JSON.stringify(saved));

    try {
      const res = await fetch(`${API_URL}/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id }),
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        setIsFavorite(!newState);
        toast.error(data.message || "فشل تحديث المفضلة");
      } else {
        toast.success(data.message || "تم تحديث المفضلة");
      }
    } catch (err) {
      console.error(err);
      setIsFavorite(!newState);
      toast.error("حدث خطأ أثناء تحديث المفضلة");
    }
  };

  if (loading) return <Loading />;
  if (error || !product) return <p>المنتج غير موجود</p>;

  return (
    <>
      <div className=" xl:ms-[15%] ms-5 sm:ms-10 md:gap-5 lg:flex md:grid md:grid-cols-2">
        <div className="lg:w-[35%]  mt-5 mb-4">
          <div className="py-5 font-family-cairo">
            <CustomSeparator proName={product.name} />
          </div>

          <h2 className="text-[#373944] mb-5 mt-3 text-3xl font-bold">
            {product.name}
          </h2>

          <div className="my-3 flex items-center gap-7">
            <div className="flex gap-3">
              <HearComponent
                liked={isFavorite}
                onToggleLike={toggleFavorite}
                ClassName="text-gray-400"
                ClassNameP="border border-gray-300"
              />
              <ShareButton />
            </div>

            <div className="flex gap-3 items-center mb-2">
              <RatingStars
                average_ratingc={product.average_rating || 2}
                reviewsc={product.reviews || []}
              />
            </div>
          </div>
          <h6 className="font-bold text-3xl my-7 text-gray-600">
            مواصفات المنتج
          </h6>
          <p
            className="text-sm mt-1 text-gray-700"
            dangerouslySetInnerHTML={{ __html: product.description || "" }}
          />

          <div className="flex items-center justify-between border border-gray-300 rounded-lg p-2 my-3">
            <div className="flex items-center gap-1">
              <FaBarcode size={19} className="text-pro-max" />
              <p className="text-sm">رقم الموديل</p>
            </div>

            <p className="text-sm">{product.id}</p>
          </div>
          {/* rate form */}
          <div className="rounded-2xl border border-gray-200 border-t-0">
            {/* Buttons */}
            <div className="grid grid-cols-2 border-b-2 border-amber-400">
              <div
                className={`flex items-center justify-center py-3 rounded-2xl rounded-br-none rounded-bl-none cursor-pointer 
        ${activeTab === "options" ? "bg-orange-300" : "bg-white"}`}
                onClick={() => setActiveTab("options")}
              >
                <button className="text-center transition cursor-pointer">
                  خيارات المنتج
                </button>
              </div>

              <div
                className={`flex items-center justify-center py-3 rounded-2xl rounded-br-none rounded-bl-none cursor-pointer 
        ${activeTab === "reviews" ? "bg-orange-300" : "bg-white"}`}
                onClick={() => setActiveTab("reviews")}
              >
                <button className="text-center transition cursor-pointer">
                  تقييمات المنتج
                </button>
              </div>
            </div>

            <div className="m-4">
              {activeTab === "options" && (
                <StickerForm productId={product.id} />
              )}
              {activeTab === "reviews" && <POVComponent product={product} />}
            </div>
          </div>
        </div>
        <div className="lg:w-[5%] hidden lg:flex"></div>
        <div className=" lg:w-[60%] ">
          <div className="sticky top-20">
            {" "}
            <ProductGallery
              mainImage={product.image || "images/o1.jpg"}
              images={
                product.images?.length
                  ? product.images
                  : [{ url: "/images/c1.png", alt: "default image" }]
              }
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between z-50 py-4 px-7  shadow-gray-700 shadow-2xl  fixed bottom-0 start-0 end-0 bg-white">
        {/* product image */}
        <div className="flex gap-5 items-center">
          <Image
            src={product.image ?? "images/o1.jpg"}
            alt={product.name ?? "product"}
            width={100}
            height={100}
            className="rounded-xl w-19 h-19"
          />
          <div>
            <p className="text-sm text-gray-600">
              {product.name?.slice(0, 20)}
            </p>
            <h3 className="text-xl font-bold">{product.name}</h3>
          </div>
        </div>
        {/* cart */}
        <div className="flex items-center gap-3  max-w-max">
          <div className="flex flex-col items-center ">
            <h4 className="text-xl font-bold">-</h4>
            <p className="text-gray-500 text-[12px]">السعر يشمل الضريبة</p>
          </div>
          <div className=" ">
            <ButtonComponent title="اضافة للسلة" onClick={handleSubmit} />
          </div>
        </div>
      </div>
      <div className="mx-6 md:mx-[4%] xl:mx-[14%] my-6">
        {product && categories2.length > 0 && (
          <section className="">
            {(() => {
              const currentCategory = categories2.find((cat) =>
                cat.products?.some((p) => p.id === product.id)
              );
              if (
                currentCategory &&
                currentCategory.products &&
                currentCategory.products.length > 1
              ) {
                const similarProducts = currentCategory.products.filter(
                  (p) => p.id !== product.id
                );

                return (
                  <div key={currentCategory.id} className="mb-16">
                    <InStockSlider
                      title="منتجات قد تعجبك"
                      inStock={similarProducts}
                      CardComponent={(props) => (
                        <ProductCard
                          {...props}
                          classNameHome="hidden"
                          className2="hidden"
                        />
                      )}
                    />
                  </div>
                );
              }

              const fallbackProducts = categories2
                .flatMap((cat) => cat.products || [])
                .filter((p) => p.id !== product.id)
                .slice(0, 12);

              if (fallbackProducts.length > 0) {
                return (
                  <div>
                    <InStockSlider
                      title="منتجات قد تعجبك"
                      inStock={fallbackProducts}
                      CardComponent={(props) => (
                        <ProductCard
                          {...props}
                          classNameHome="hidden"
                          className2="hidden"
                        />
                      )}
                    />
                  </div>
                );
              }

              return null;
            })()}
          </section>
        )}
      </div>
    </>
  );
}
