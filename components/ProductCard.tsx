"use client";
import { useState } from "react";
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
  onFavoriteChange?: (productId: number, newValue: boolean) => void; // تمرير ID والحالة الجديدة
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
  onFavoriteChange,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(is_favorite ?? false);
  const [showImage, setShowImage] = useState(false);
  const { cart, addToCart } = useCart();
  const { showToast } = useToast();
  const { authToken: token } = useAuth();

  const handleAddToCart = () => {
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      if (existing.quantity >= 10) {
        showToast({ msg: "لا يمكن إضافة أكثر من 10 قطع!", type: "error" });
        return;
      }
      addToCart({ id, name, price, image, quantity: existing.quantity + 1 });
    } else {
      addToCart({ id, name, price, image, quantity: 1 });
    }
    showToast({
      msg: "تمت إضافة المنتج إلى العربة!",
      type: "success",
      img: image || "/images/c1.png",
    });
  };

  const toggleFavorite = async (productId: number) => {
    if (!token) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    const newValue = !isFavorite;
    // تحديث الواجهة فورًا
    setIsFavorite(newValue);
    onFavoriteChange?.(productId, newValue); // تحديث حالة الأب فورًا

    try {
      const res = await fetch(
        "https://ecommecekhaled.renix4tech.com/api/v1/favorites/toggle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: productId }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.status) {
        setIsFavorite(!newValue); 
        onFavoriteChange?.(productId, !newValue);
        toast.error(data.message || "فشل تحديث المفضلة");
      } else {
        toast.success(data.message || "تم تحديث المفضلة");
      }
    } catch (err) {
      console.error(err);
      setIsFavorite(!newValue); 
      onFavoriteChange?.(productId, !newValue);
      toast.error("حدث خطأ أثناء تحديث المفضلة");
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col border rounded-xl border-gray-200 overflow-hidden pb-3 hover:shadow-md transition-shadow duration-300">
        <div className="relative w-full">
          <Link
            href={`/product/${id}`}
            className="block w-full h-full overflow-hidden"
          >
            <ImageComponent image={image || "/images/c1.png"} />
          </Link>

          <HearComponent
            liked={isFavorite}
            onToggleLike={() => toggleFavorite(id)}
          />

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

          <div className={`flex gap-1 items-center ${classNameHome}`}>
            <PriceComponent final_price={final_price || 1} />
            {price && (
              <p className="text-gray-700 line-through text-[0.72rem] mx-1">
                {price}
              </p>
            )}
            {discount && (
              <div
                className={`font-bold text-[0.7rem] flex text-[#08b63d] ${className3}`}
              >
                <span className="me-1">%</span>
                <p>{discount.value}</p>
                <span>-</span>
              </div>
            )}
          </div>

          <RatingStars
            average_ratingc={average_rating || 2}
            reviewsc={reviews || []}
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            className={`${className2} hidden mb-0 mt-2 text-end cursor-pointer w-full`}
          >
            <div className="flex text-pro rounded justify-center border-pro p-2 items-center border gap-2">
              <p className="text-pro">أضف الي العربة</p>
              <BsCartPlus className="text-pro" />
            </div>
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            className={`${classNameCate} absolute end-1.5 bottom-52`}
          >
            <div className="bg-white p-1 rounded-full text-pro text-xl cursor-pointer hover:text-orange-300">
              <BsCart3 className="text-blue-950 hover:text-orange-500 transition duration-150" />
            </div>
          </button>

          <div className="mt-5">
            <BottomSlider />
          </div>
        </div>
      </div>
    </div>
  );
}
