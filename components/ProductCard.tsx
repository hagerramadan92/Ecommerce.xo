"use client";
import { useState, useEffect } from "react";
import HearComponent from "./HearComponent";
import { ProductIn } from "@/Types/ProductIn";
import PriceComponent from "./PriceComponent";
import ImageComponent from "./ImageComponent";
import Link from "next/link";
import { BsCartPlus } from "react-icons/bs";
import Toast from "./Toaster";
import { useCart } from "@/src/context/CartContext";
import { IoIosStar } from "react-icons/io";
import { IoStarHalfSharp } from "react-icons/io5";
import { MdOutlineStarOutline, MdStars } from "react-icons/md";
import { BsCart3 } from "react-icons/bs";
import { PiTruckLight } from "react-icons/pi";
interface ProductCardProps extends ProductIn {
  className?: string;
  className2?: string;
  className3?: string;
  onFavoriteChange?: () => void;
}

export default function ProductCard({
  id,
  img,
  title,
  price,
  oldPrice,
  discount,
  stock = 0,
  className,
  className2,
  className3,
  onFavoriteChange,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    img?: string;
    type: "success" | "warning" | "error";
  } | null>(null);
  const code = 1;
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
      addToCart({
        id,
        title,
        price,
        img,
        quantity: (existing.quantity || 0) + 1,
      });
    } else {
      addToCart({ id, title, price, img, quantity: 1 });
    }

    setToast({
      msg: "تمت إضافة المنتج إلى العربة بنجاح!",
      type: "success",
      img,
    });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      <div className="h-fit relative ">
        <div
          className="flex flex-col border  rounded-xl
     border-gray-200  overflow-hidden pb-4
      hover:shadow-md transition-shadow duration-300 "
        >
          {toast && (
            <Toast message={toast.msg} type={toast.type} img={toast.img} />
          )}

          <div className="relative w-full">
            <Link
              aria-label="product image"
              href={`/product/${id}`}
              className="block w-full h-full overflow-hidden"
            >
              <ImageComponent image={img} />
            </Link>

            <HearComponent liked={isFavorite} onToggleLike={toggleFavorite} />

            {stock > 0 ? (
              <div
                className={` absolute bottom-7 text-white bg-[#62bd7c] rounded rounded-br-none rounded-tr-none text-sm w-fit px-1.5 `}
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
            <div className="text-orange-400  flex mt-2 text-[1.2rem]">
              <IoIosStar />
              <IoIosStar />
              <IoIosStar />
              <IoStarHalfSharp />
              <MdOutlineStarOutline />
            </div>
          </div>

          <div className="px-2 ">
            <Link href={`/product/${id}`}>
              <p className="text-[15px] text-[#252525] my-2 hover:text-[#2c2e2c] transition">
                {title}
              </p>
            </Link>

            <div className="flex gap-1 items-center">
              <PriceComponent price={price} />
              {oldPrice && (
                <p className="text-gray-700 line-through text-[0.8rem] mx-1">
                  {oldPrice}
                </p>
              )}
              {discount && (
                <div
                  className={`font-bold text-[1rem] flex text-[#08b63d] ${className3}`}
                >
                  <span className="me-1">%</span>
                  <p>{discount}</p>
                  <span>-</span>
                </div>
              )}
            </div>
            <div className="bestSeller start-0 absolute top-1 text-white bg-[#860808] rounded rounded-br-none rounded-tr-none text-sm w-fit p-1.5">
              <p>الأكثر مبيعاََ</p>
            </div>

            <div className="px-2 py-1 border border-gray-300 rounded w-fit">
              <p className="text-gray-600">
                <span>2</span>
                مقاسات
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className={`${className2} mb-0 mt-2 text-end cursor-pointer w-full`}
            >
              <div className="flex text-pro rounded justify-center border-pro p-2 items-center border gap-2">
                <p className="text-pro">أضف الي العربة</p>
                <BsCartPlus className="text-pro" />
              </div>
            </button>
            <div className=" absolute end-1 top-45 bg-white p-1 rounded-full text-pro text-xl cursor-pointer hover:text-orange-300">
              <BsCart3 className="text-blue-950 hover:text-orange-500 transition duration-150 " />
            </div>
            <div>
              <div className="flex items-center ">
                <PiTruckLight />
                <p>شحن مجاني</p>
              </div>
              <div className="flex items-center ">
                <MdStars />
                <p>#1 في ديكورات الأطفال</p>
              </div>
              <div className="flex items-center ">
                <p>!</p>
                <p>
                  متبقي <span>1</span> فقط في المخزن
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
