'use client'
import React from "react";
import Button from "@mui/material/Button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useCart } from "@/src/context/CartContext";
import { useRouter } from "next/navigation";

export default function TotalOrder() {

  const { cart, removeFromCart, changeQuantity, total } = useCart();
  const formattedTotal = total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const router = useRouter();
  const handleClick = () => {
    router.push("/payment");
  };
  return (
    <>
      <div className="my-4 gap-2 flex flex-col">
       
        <div className="flex items-center justify-between text-black ">
          <p className="font-semibold">المجموع</p>
          <p>
            2,435
            <span className="text-sm ms-1">جنيه</span>
          </p>
        </div>
        <div className="flex items-center justify-between ">
          <p className="font-semibold">إجمالي رسوم الشحن</p>
          <p className="text-md">
            48
            <span className="text-sm ms-1">جنيه</span>
          </p>
        </div>
        <div className="flex text-pro items-center justify-between border-b-2 border-gray-200  pb-3">
          <p className="font-semibold">رسوم الدفع عند الإستلام</p>
          <p className="text-md">
            50
            <span className="text-sm ms-1">جنيه</span>
          </p>
        </div>
        <div className="flex items-center justify-between pb-3 pt-2">
          <div className="flex gap-1 items-center">
            <p className="text-lg text-pro font-bold">الإجمالي :</p>
            <p className="text-[12px] font-semibold">
              (يشمل ضريبة القيمة المضافة)
            </p>
          </div>

          <p className="text-[15px] text-pro font-bold">
            {formattedTotal}
            <span>جنيه</span>
          </p>
        </div>
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
          }}
          endIcon={<KeyboardBackspaceIcon />}
          onClick={handleClick}
        >
          تابع عملية الشراء
        </Button>
      </div>
    </>
  );
}
