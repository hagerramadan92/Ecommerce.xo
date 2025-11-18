"use client";
import { useState, useEffect } from "react";
import HearComponent from "./HearComponent";
import PriceComponent from "./PriceComponent";
import ImageComponent from "./ImageComponent";
import Link from "next/link";
import { BsCartPlus, BsEye } from "react-icons/bs";
import { useCart } from "@/src/context/CartContext";
import { IoIosStar } from "react-icons/io";
import { IoStarHalfSharp } from "react-icons/io5";
import { MdOutlineStarOutline } from "react-icons/md";
import { BsCart3 } from "react-icons/bs";
import BottomSlider from "./BottomSlider";
import { useToast } from "../src/context/ToastContext";
import { ProductI } from "@/Types/ProductsI";
import { BiShowAlt } from "react-icons/bi";
import { GoEye } from "react-icons/go";
import ShowImage from "./ShowImage";
import RatingStars from "./RatingStars";

interface ProductCardProps extends ProductI {
  className?: string;
  className2?: string;
  className3?: string;
  classNameHome?: string;
  classNameCate?: string;
  onFavoriteChange?: () => void;
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
  onFavoriteChange,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const code = 0;
  const bestSeller = 0;
  const { cart, addToCart } = useCart();

  useEffect(() => {
    const favorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    ) as string[];
    setIsFavorite(favorites.includes(id.toString()));
  }, [id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    ) as string[];
    let updatedFavorites: string[];

    if (isFavorite) {
      updatedFavorites = favorites.filter((favId) => favId !== id.toString());
    } else {
      updatedFavorites = [...favorites, id.toString()];
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
    onFavoriteChange?.();
  };

  const handleAddToCart = () => {
    const existing = cart.find((item) => item.id === id);

    if (existing) {
      if (existing.quantity >= 10) {
        showToast({
          msg: "لا يمكن إضافة أكثر من 10 قطع!",
          type: "error",
        });

        return;
      }

      addToCart({
        id,
        name,
        price,
        image,
        quantity: existing.quantity + 1,
      });
    } else {
      addToCart({ id, name, price, image, quantity: 1 });
    }

    showToast({
      msg: "تمت إضافة المنتج إلى العربة!",
      type: "success",
      img: image || "/images/c1.png",
    });
  };
  const { showToast } = useToast();

  return (
    <>
      <div className=" relative ">
        <div
          className="flex flex-col border  rounded-xl
                   border-gray-200  overflow-hidden pb-3
                     hover:shadow-md transition-shadow duration-300 "
        >
          <div className="relative w-full">
            <Link
              aria-label="product image"
              href={`/product/${id}`}
              className="block w-full h-full overflow-hidden"
            >
              <ImageComponent image={image || "/images/c1.png"} />
            </Link>

            <HearComponent liked={isFavorite} onToggleLike={toggleFavorite} />

            {stock > 0 ? (
              <div
                className={` absolute bottom-0 text-white bg-[#62bd7c] rounded rounded-br-none rounded-tr-none text-sm w-fit px-1.5 `}
              >
                <p>متوفر</p>
              </div>
            ) : (
              <div
                className={` absolute bottom-[27px] text-white bg-[#b30404] rounded rounded-br-none rounded-tr-none text-sm w-fit p-1.5`}
              >
                <p>نفذت الكمية</p>
              </div>
            )}

            {code > 0 && stock > 0 && (
              <div
                className={` absolute top-2 py-2 text-white bg-[#880808] rounded rounded-br-none rounded-tr-none text-sm w-fit px-1.5`}
              >
                <p>
                  {" "}
                  استخدم كود: <span>B1G1</span>
                </p>
              </div>
            )}
            {/* show image */}
            <button
              onClick={() => setShowImage(true)}
              className={`flex absolute cursor-pointer end-1 hover:scale-105 bottom-0.5 bg-white/80 w-7 h-7 
            rounded-full items-center
             justify-center ${className2}`}
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

          <div className="px-2 ">
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
            {/* average_rating */}

            <RatingStars
              average_ratingc={average_rating || 2}
              reviewsc={reviews || []}
            />

            {bestSeller > 0 && (
              <div className="bestSeller start-0 absolute top-1 text-white bg-[#860808] rounded rounded-br-none rounded-tr-none text-sm w-fit p-1.5">
                <p>الأكثر مبيعاََ</p>
              </div>
            )}

            <div
              className={`px-2 py-1 border border-gray-300 rounded text-sm w-fit mt-3 ${classNameHome}`}
            >
              <p className="text-gray-600">
                <span>2</span>
                مقاسات
              </p>
            </div>
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
              className={`${classNameCate} `}
            >
              <div className=" absolute end-1 top-45 bg-white p-1 rounded-full text-pro text-xl cursor-pointer hover:text-orange-300">
                <BsCart3 className="text-blue-950 hover:text-orange-500 transition duration-150 " />
              </div>
            </button>

            <div className="mt-5">
              <BottomSlider />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
