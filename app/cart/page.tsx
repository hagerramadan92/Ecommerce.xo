"use client";

import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaMinus, FaTruckFast } from "react-icons/fa6";
import { PiLineVerticalThin } from "react-icons/pi";
import { BsTrash3 } from "react-icons/bs";
import { useCart } from "@/src/context/CartContext";
import toast from "react-hot-toast";
import {
  MdAddLocationAlt,
  MdKeyboardArrowLeft,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { useState } from "react";
import AddressForm from "@/components/AddressForm";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CoBon from "@/components/cobon";
import TotalOrder from "@/components/TotalOrder";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { IoIosCloseCircle } from "react-icons/io";
import ProductCard from "@/components/ProductCard";
import InStockSlider from "@/components/InStockSlider";
import StickerForm from "@/components/StickerForm";
import Swal from "sweetalert2";

export default function CartPage() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  const { cart, cartCount, total, removeFromCart, updateQuantity, loading } =
    useCart();
  const handleClick = () => {
    router.push("/payment");
  };

  if (cart.length === 0) {
    return (
      <div className="p-10 text-center  flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">العربة فارغة</h2>
        <Link
          href="/"
          className="bg-pro text-white py-3 px-8 rounded-lg hover:bg-pro-max transition text-lg font-medium"
        >
          العودة للتسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 lg:px-[7%] xl:px-[18%] pb-8 pt-5">
      <div className="flex items-center gap-2 text-sm mb-1">
        <Link href="/" aria-label="go to home" className="text-pro-max">
          الرئيسيه
        </Link>
        <MdKeyboardArrowLeft />
        <h6 className="text-gray-600">عربة التسوق</h6>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="col-span-1 lg:col-span-2">
          {/* <div className="p-2 ps-6  rounded-lg border border-gray-200 my-4 bg-white">
            <h2 className="text-lg font-semibold py-3">
              عربة التسوق ({cartCount})
            </h2>
          </div> */}

          <div className="flex flex-col  my-4 bg-white overflow-hidden">
            {cart.map((item) => (
              <div
                key={item.cart_item_id}
                className=" p-6 relative border rounded-lg border-gray-200 mb-4 "
              >
                <div className="relative md:border-0 border-b border-gray-200">
                  <div className="md:flex justify-between items-start flex md:flex-row flex-col gap-3 md:gap-0">
                    <div className="flex gap-3 md:border-0  border-b border-gray-200 w-full md:w-fit pb-4 md:pb-0">
                      <div className="w-25 h-20 bg-gray-100 rounded">
                        <Image
                          src={item.product.image || "/images/placeholder.png"}
                          alt={item.product.name}
                          width={96}
                          height={80}
                          className="w-full h-full object-fit rounded"
                        />
                      </div>

                      <div className="flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-md text-gray-800">
                            {item.product.name}
                          </h3>

                          {/* <p className="text-sm text-gray-400 mt-1">
                            {item.price_per_unit} جنيه
                          </p> */}
                          <p className="text-sm text-gray-400 mt-1">
                            السعر:{" "}
                            {parseFloat(item.line_total || "0").toFixed(2)}{" "}
                            جنيه
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* counter */}
                    <div className="flex items-center gap-3   border border-gray-200 rounded-lg">
                      {/* + */}
                      <button
                        onClick={() => {
                          if (item.quantity >= 10) {
                            toast.error("الحد الأقصى 10 قطع فقط لهذا المنتج", {
                              icon: "معلومة",
                              duration: 4000,
                            });
                          } else {
                          updateQuantity(item.cart_item_id, item.quantity + 1);
                          }
                        }}
                        className="w-10 h-9 text-gray-500 cursor-pointer border-gray-200 border-l rounded-lg rounded-bl-none rounded-tl-none   transition flex items-center justify-center"
                      >
                        <FaPlus size={16} />
                      </button>
                      <span className="font-semibold  w-5 text-lg text-center bg-white ">
                        {item.quantity}
                      </span>

                      {/* - */}
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) {
                            removeFromCart(item.cart_item_id);
                          } else {
                            updateQuantity(
                              item.cart_item_id,
                              item.quantity - 1
                            );
                          }
                        }}
                        className="w-10 h-9 border-gray-200 border-r cursor-pointer rounded-lg rounded-br-none rounded-tr-none transition flex items-center justify-center"
                      >
                        {item.quantity <= 1 ? (
                          <BsTrash3 className="text-red-500" size={16} />
                        ) : (
                          <FaMinus className="text-gray-600" size={14} />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center text-sm text-red-400 gap-4">
                      <div className="flex absolute bottom-1/6 end-0 md:relative items-center">
                        <p className="text-sm text-green-600 mt-1">
                          المجموع:{" "}
                          {parseFloat(item.line_total || "0").toFixed(2)} جنيه
                        </p>
                      </div>

                      {/* close */}
                      <button
                        onClick={async () => {
                          const result = await Swal.fire({
                            title: "هل أنت متأكد؟",
                            text: "سيتم حذف هذا المنتج من السلة نهائيًا!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#d33",
                            cancelButtonColor: "#3085d6",
                            confirmButtonText: "نعم، احذفه",
                            cancelButtonText: "لا، ألغِ الأمر",
                            reverseButtons: true,
                            customClass: {
                              popup: "animate__animated animate__fadeInDown",
                              confirmButton: "font-bold",
                              cancelButton: "font-bold",
                            },
                          });

                          if (result.isConfirmed) {
                            await removeFromCart(item.cart_item_id);
                          }
                        }}
                        className="cursor-pointer absolute top-0 end-0 md:relative"
                      >
                        <IoIosCloseCircle className="text-red-400" size={28} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <StickerForm
                    cartItemId={item.cart_item_id}
                    productId={item.product.id}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1">
          {/* <div
            onClick={() => setOpenModal(true)}
            className="flex items-center justify-between rounded-lg shadow p-5 mt-4 bg-white cursor-pointer hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <MdAddLocationAlt size={26} className="text-pro" />
              <p className="font-medium">
                التوصيل إلى{" "}
                <span className="font-bold text-pro">حي الجيزة، الجيزة</span>
              </p>
            </div>
            <MdOutlineKeyboardArrowLeft size={26} />
          </div> */}

          {/* <AddressForm open={openModal} onClose={() => setOpenModal(false)} /> */}

          <div className="border border-gray-200   rounded-lg p-6 mt-4 bg-white">
            <CoBon />

            <h4 className="text-md font-semibold text-pro my-5">ملخص الطلب</h4>
            <TotalOrder />

            <Button
              variant="contained"
              onClick={handleClick}
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: "1.2rem",
                fontWeight: "bold",
                backgroundColor: "#14213d",
                "&:hover": { backgroundColor: "#0f1a31" },
                borderRadius: "12px",
                textTransform: "none",
              }}
              endIcon={<KeyboardBackspaceIcon />}
            >
              تابع عملية الشراء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
