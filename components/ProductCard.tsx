"use client";

import { useEffect, useState } from "react";
import HearComponent from "./HearComponent";
import PriceComponent from "./PriceComponent";
import ImageComponent from "./ImageComponent";
import Link from "next/link";
import { BsCartPlus, BsCart3 } from "react-icons/bs";
import { useCart } from "@/src/context/CartContext";
import BottomSlider from "./BottomSlider";
import { useToast } from "../src/context/ToastContext";
import { ProductI } from "@/Types/ProductsI";
import ShowImage from "./ShowImage";
import RatingStars from "./RatingStars";
import toast from "react-hot-toast";
import { useAuth } from "@/src/context/AuthContext";
import { GoEye } from "react-icons/go";

interface ProductCardProps extends ProductI {
  className?: string;
  className2?: string;
  className3?: string;
  classNameHome?: string;
  classNameCate?: string;
  Bottom?: string;
  onFavoriteChange?: (productId: number, newValue: boolean) => void;

  selectedSizeId?: number | null;
  selectedColorId?: number | null;
  selectedPrintingMethodId?: number | null;
  selectedPrintLocations?: number[];
  selectedEmbroiderLocations?: number[];
  selectedOptions?: { option_name: string; option_value: string }[];
  selectedDesignServiceId?: number | null;
  isSample?: boolean;
}

export default function ProductCard({
  id,
  image,
  name,
  price,
  final_price,
  discount,
  stock,
  classNameHome,
  className2,
  className3,
  classNameCate,
  average_rating,
  reviews,
  is_favorite,
  Bottom,
  onFavoriteChange,
  selectedSizeId,
  selectedColorId,
  selectedPrintingMethodId,
  selectedPrintLocations = [],
  selectedEmbroiderLocations = [],
  selectedOptions = [],
  selectedDesignServiceId,
  isSample = false,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // const { addToCart, refreshCart } = useCart();
  const { authToken: token } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const loadFavorites = () => {
      const saved = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      ) as number[];
      setIsFavorite(saved.includes(id) || (is_favorite ?? false));
    };

    loadFavorites();
    window.addEventListener("storage", loadFavorites);
    return () => window.removeEventListener("storage", loadFavorites);
  }, [id, is_favorite]);

  const toggleFavorite = async (productId: number) => {
    if (!token) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    const newState = !isFavorite;
    setIsFavorite(newState);
    onFavoriteChange?.(productId, newState);

    let saved = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    ) as number[];
    if (newState) saved.push(productId);
    else saved = saved.filter((id) => id !== productId);
    localStorage.setItem("favorites", JSON.stringify(saved));

    try {
      const res = await fetch(`${API_URL}/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        setIsFavorite(!newState);
        onFavoriteChange?.(productId, !newState);
        toast.error(data.message || "فشل تحديث المفضلة");
      } else {
        toast.success("تم تحديث المفضلة بنجاح");
      }
    } catch (err) {
      setIsFavorite(!newState);
      onFavoriteChange?.(productId, !newState);
      toast.error("حدث خطأ أثناء تحديث المفضلة");
    }
  };
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (isAdding || stock === 0) return;
    setIsAdding(true);

    const success = await addToCart(id, {
      quantity: 1,
      size_id: selectedSizeId ?? null,
      color_id: selectedColorId ?? null,
      printing_method_id: selectedPrintingMethodId ?? null,
      print_locations:
        selectedPrintLocations.length > 0 ? selectedPrintLocations : [],
      embroider_locations:
        selectedEmbroiderLocations.length > 0 ? selectedEmbroiderLocations : [],
      selected_options: selectedOptions.length > 0 ? selectedOptions : [],
      design_service_id: selectedDesignServiceId ?? null,
      is_sample: isSample,
    });

    setIsAdding(false);
  };
  return (
    <div className="relative group">
      <div className="flex flex-col border rounded-xl border-gray-200 overflow-hidden pb-3 hover:shadow-lg transition-all duration-300">
        <div className="relative w-full">
          <Link
            href={`/product/${id}`}
            className="block w-full h-full overflow-hidden"
          >
            <ImageComponent image={image || "/images/c1.png"} />
          </Link>

          <div className="absolute top-2 end-2 z-10">
            <HearComponent
              liked={isFavorite}
              onToggleLike={() => toggleFavorite(id)}
              ClassName="text-pro"
            />
          </div>

          {stock > 0 ? (
            <div className="absolute bottom-0 text-white bg-[#62bd7c] rounded rounded-br-none rounded-tr-none text-sm w-fit px-1.5">
              <p>متوفر</p>
            </div>
          ) : (
            <div className="absolute bottom-[27px] text-white bg-[#b30404] rounded rounded-br-none rounded-tr-none text-sm w-fit p-1.5">
              <p>نفذت الكمية</p>
            </div>
          )}

          <button
            aria-label="show product "
            onClick={() => setShowImage(true)}
            className={`flex absolute cursor-pointer end-1 hover:scale-105 bottom-0.5 bg-white/80 w-7 h-7 rounded-full items-center justify-center ${className2}`}
          >
            <GoEye size={20} className="text-pro cursor-pointer" />
          </button>

          {showImage && (
            <ShowImage
              onClose={() => setShowImage(false)}
              src={image || "/images/c1.png"}
            />
          )}
        </div>

        <div className="px-2">
          <Link href={`/product/${id}`}>
            <p className="text-[15px] text-gray-600 my-2 hover:text-[#2c2e2c] transition font-bold">
              {name}
            </p>
          </Link>

          <div className={`flex items-center gap-2 mt-2 ${classNameHome}`}>
            <PriceComponent final_price={final_price || 1} />
            {price && Number(price) !== final_price && (
              <p className="text-gray-500 line-through text-sm">{price} ج.م</p>
            )}
            {discount && (
              <div className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                -{discount.value}%
              </div>
            )}
          </div>

          <RatingStars
            average_ratingc={average_rating || 0}
            reviewsc={reviews || []}
          />

          <div className="mt-4">
            <BottomSlider />
          </div>
        </div>
      </div>

      <button
        aria-label="add to cart"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleAddToCart();
        }}
        disabled={isAdding || stock === 0}
        className={`${classNameCate} absolute end-1.5 ${Bottom} z-20 transition-all duration-300`}
      >
        <div className="bg-white p-1 rounded-full text-pro text-xl cursor-pointer hover:text-orange-300">
          {isAdding ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-gray-700 rounded-full animate-spin"></div>
          ) : (
            <BsCart3 size={24} className="cursor-pointer" />
          )}
        </div>
      </button>
      {/* 
      
      
      
      <button>
        <div className="bg-white p-1 rounded-full text-gray-700 hover:text-orange-500 transition-all duration-200">
          {isAdding ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-gray-700 rounded-full animate-spin"></div>
          ) : (
            <BsCart3 size={24} className="cursor-pointer" />
          )}
        </div>
      </button>
      
      */}
    </div>
  );
}
