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
  const handleClick = () => {
    router.push("/payment");
  };
  const [openModal, setOpenModal] = useState(false);
  const { cart, removeFromCart, changeQuantity, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-4">العربة فارغة</h2>
        <Link
          href="/"
          className="bg-pro text-white py-2 px-6 rounded hover:bg-pro-max transition"
        >
          العودة للتسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 lg:px-[7%] xl:px-[18%]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="col-span-1 lg:col-span-2 h-fit">
          <div className="p-2 ps-6 shadow rounded-xl my-4">
            <h2 className="text-2xl font-semibold py-3">عربة التسوق</h2>
          </div>

          <div className="flex flex-col shadow rounded-xl my-4 p-6 gap-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-100 overflow-hidden pt-5 gap-4 relative"
              >
                <div className="flex flex-col lg:flex-row w-full">
                  <div className="flex gap-4">
                    {/* product-image */}
                    <div className="w-32 h-32 bg-gray-100 ms-4 rounded-md flex items-center justify-center overflow-hidden">
                      {item.img && (
                        <Image
                          src={item.img}
                          alt={item.title}
                          width={125}
                          height={125}
                          className="object-contain w-full h-full"
                        />
                      )}
                    </div>
                    {/* product info */}
                    <div className="flex flex-col gap-1.5">
                      <p className="text-black/75">{item.title}</p>
                      <p className="font-bold">{item.price} جنيه</p>
                      <div className="text-[#20a144] bg-[#f0fbf3] px-2 py-1 text-[0.9rem] rounded w-fit">
                        <p>ينتج عند الطلب</p>
                      </div>
                      <div className="flex gap-1">
                        <FaTruckFast className="h-4.5 w-4.5 text-pro mt-1 scale-x-[-1]" />
                        <p className="text-gray-700 text-[0.95rem]">
                          توصيل{" "}
                          <span className="text-gray-800">
                            06 نوفمبر - 16 نوفمبر{" "}
                          </span>
                          باستثناء الإجازات
                        </p>
                      </div>
                      <div className="flex items-center text-[#177998] font-bold">
                        <button onClick={() => removeFromCart(item.id)}>
                          الحذف
                        </button>
                        <PiLineVerticalThin className="opacity-50" />
                        <button>حفظ لوقت لاحق</button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* counter */}
                <div className="flex items-center gap-3 absolute bottom-15 end-3">
                  <button
                    className="px-1 py-1 bg-gray-50 rounded hover:bg-gray-100 transition cursor-pointer"
                    onClick={() =>
                      item.quantity === 1
                        ? removeFromCart(item.id)
                        : changeQuantity(item.id, (item.quantity || 1) - 1)
                    }
                  >
                    {item.quantity > 1 ? (
                      <FaMinus className="text-gray-400" />
                    ) : (
                      <BsTrash3 className="text-gray-400" />
                    )}
                  </button>

                  <span className="font-bold py-1 rounded text-center text-[1.1rem]">
                    {item.quantity || 1}
                  </span>

                  <button
                    className="px-1 py-1 text-gray-400 bg-gray-50 rounded hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => {
                      if ((item.quantity || 1) >= 10) {
                        toast.error(
                          "لقد وصلت للحد الأقصى (10 منتجات). تواصل مع الدعم لمزيد من الكمية."
                        );
                      } else {
                        changeQuantity(item.id, (item.quantity || 1) + 1);
                      }
                    }}
                  >
                    <FaPlus />
                  </button>
                </div>
                {/* free deliver */}
                <div className="bg-[#fafafa] text-[#20a144] w-full py-3 text-center font-semibold mt-4">
                  <p>شحن مجاني</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-1 h-fit">
          {/* deliver to */}
          <div
            className="flex items-center justify-between rounded shadow p-4 mt-4 text-[#605f5f] cursor-pointer hover:bg-gray-50"
            onClick={() => setOpenModal(true)}
          >
            <div className="flex items-center gap-1">
              <MdAddLocationAlt size={22} />
              <p>
                التوصيل إلى<span className="font-bold"> حي الجيزة الجيزة</span>
              </p>
            </div>
            <MdOutlineKeyboardArrowLeft size={22} />
          </div>

          <AddressForm open={openModal} onClose={() => setOpenModal(false)} />
          <div className="shadow p-4 pb-0 mt-4 text-[#605f5f] mb-5">
            <CoBon />

            <h4 className="text-pro font-semibold my-2 text-xl">ملخص الطلب</h4>
            <TotalOrder />
            <Button
              variant="contained"
              sx={{
                fontSize: "1.1rem",
                backgroundColor: "#14213d",
                "&:hover": { backgroundColor: "#0f1a31" },
                color: "#fff",
                gap: "10px",
                paddingX: "20px",
                paddingY: "10px",
                borderRadius: "10px",
                textTransform: "none",
                 width:"100%"
              }}
              endIcon={<KeyboardBackspaceIcon />}
              onClick={handleClick}
            >
              تابع عملية الشراء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
