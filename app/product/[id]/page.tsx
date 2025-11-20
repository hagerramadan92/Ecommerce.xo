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

export default function ProductPageClient() {
  const params = useParams();
  const { id } = params;
  const { authToken: token } = useAuth();
  const [showStickerForm, setShowStickerForm] = useState(true);
  const [showPOV, setShowPOV] = useState(false);
  const [activeTab, setActiveTab] = useState<"options" | "reviews" | null>(
    "options"
  );

  const [product, setProduct] = useState<ProductI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  // const [activeTab, setActiveTab] = useState("sticker");
  const API_URL = "https://ecommecekhaled.renix4tech.com/api/v1";

  // -----------------------
  // Fetch product when id or token changes
  // -----------------------
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

        // تحديث حالة المفضلة مباشرة من localStorage
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

  // -----------------------
  // Toggle favorite
  // -----------------------
  const toggleFavorite = async () => {
    if (!token) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!product) return;

    const newState = !isFavorite;
    setIsFavorite(newState);

    // تحديث localStorage فورًا
    let saved = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    ) as number[];
    if (newState) {
      if (!saved.includes(product.id)) saved.push(product.id);
    } else {
      saved = saved.filter((pid) => pid !== product.id);
    }
    localStorage.setItem("favorites", JSON.stringify(saved));

    // إرسال للـ API
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
        setIsFavorite(!newState); // رجوع للوضع القديم
        toast.error(data.message || "فشل تحديث المفضلة");
      } else {
        toast.success(data.message || "تم تحديث المفضلة");
      }
    } catch (err) {
      console.error(err);
      setIsFavorite(!newState); // رجوع للوضع القديم
      toast.error("حدث خطأ أثناء تحديث المفضلة");
    }
  };

  if (loading) return <Loading />;
  if (error || !product) return <p>المنتج غير موجود</p>;

  return (
    <>
      <div className=" lg:ms-[15%] gap-5 grid grid-cols-1 md:grid-cols-2 p-5">
        <div className="lg:w-[75%] w-full ">
          <h2 className="text-[#43454c] mb-3 text-xl font-bold">
            {product.name}
          </h2>
    

          <div className="my-3 flex items-center gap-4">
            <HearComponent liked={isFavorite} onToggleLike={toggleFavorite} />
            <ShareButton />
            <div className="flex gap-3 items-center mb-2">
              <RatingStars
                average_ratingc={product.average_rating || 2}
                reviewsc={product.reviews || []}
              />
            </div>
          </div>
          <h6 className="font-bold text-xl">مواصفات المنتج</h6>
          <p className="text-sm mt-1 text-gray-700" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
         
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
              {activeTab === "options" && <StickerForm />}
              {activeTab === "reviews" && <POVComponent product={product}/>}
            </div>
          </div>
        </div>
       <div className=" w-full">
  <div className="sticky top-20"> {/* top-20 تحدد المسافة من أعلى الشاشة */}
    <ProductGallery 
      mainImage={product.image || "images/o1.jpg"} 
      images={product.images} 
    />
  </div>
</div>
      </div>
    </>
  );
}
