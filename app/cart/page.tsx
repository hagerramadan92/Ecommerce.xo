"use client";

import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaMinus, FaTruckFast } from "react-icons/fa6";
import { PiLineVerticalThin } from "react-icons/pi";
import { BsTrash3 } from "react-icons/bs";
import { useCart } from "@/src/context/CartContext";
import toast from "react-hot-toast";
import { MdAddLocationAlt, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useState } from "react";
import AddressForm from "@/components/AddressForm";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CoBon from "@/components/cobon";
import TotalOrder from "@/components/TotalOrder";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

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
      <div className="p-10 text-center min-h-screen flex flex-col items-center justify-center">
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
    <div className="px-5 lg:px-[7%] xl:px-[18%] py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="col-span-1 lg:col-span-2">
          <div className="p-2 ps-6 shadow rounded-xl my-4 bg-white">
            <h2 className="text-2xl font-semibold py-3">
              عربة التسوق ({cartCount})
            </h2>
          </div>

          <div className="flex flex-col shadow-lg rounded-xl my-4 bg-white overflow-hidden">
            {cart.map((item) => (
              <div
                key={item.cart_item_id}
                className="border-b border-gray-100 last:border-b-0 p-6 relative hover:bg-gray-50/50 transition"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0 lg:mx-0">
                    <Image
                      src={item.product.image || "/images/placeholder.png"}
                      alt={item.product.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-md text-gray-800">
                        {item.product.name}
                      </h3>

                      <p className="text-md font-bold text-pro mt-1">
                        {item.price_per_unit} جنيه
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 text-pro font-medium">
                      <button
                        onClick={() => removeFromCart(item.cart_item_id)}
                        className="hover:underline flex items-center gap-1 "
                      >
                        <BsTrash3 size={16} />
                        حذف
                      </button>
                      <PiLineVerticalThin className="text-gray-300" />
                    </div>
                  </div>

                  <div
                    className="absolute bottom-6 left-6 
                   flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2"
                  >
                    <button
                      onClick={() => {
                        if (item.quantity <= 1) {
                          removeFromCart(item.cart_item_id);
                        } else {
                          updateQuantity(item.cart_item_id, item.quantity - 1);
                        }
                      }}
                      className="w-9 h-9 rounded-full bg-white shadow hover:shadow-md transition flex items-center justify-center"
                    >
                      {item.quantity <= 1 ? (
                        <BsTrash3 className="text-red-500" size={16} />
                      ) : (
                        <FaMinus className="text-gray-600" size={14} />
                      )}
                    </button>

                    <span className="font-bold text-lg w-12 text-center">
                      {item.quantity}
                    </span>

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
                      className="w-9 h-9 rounded-full bg-pro text-white shadow hover:shadow-lg transition flex items-center justify-center"
                    >
                      <FaPlus size={16} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* ملخص الطلب */}
        <div className="col-span-1">
          {/* عنوان التوصيل */}
          <div
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
          </div>

          <AddressForm open={openModal} onClose={() => setOpenModal(false)} />

          {/* الكوبون والملخص */}
          <div className="shadow-lg rounded-xl p-6 mt-6 bg-white">
            <CoBon />

            <h4 className="text-2xl font-bold text-pro my-5">ملخص الطلب</h4>
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
