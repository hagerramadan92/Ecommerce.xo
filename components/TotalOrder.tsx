"use client";
import { useCart } from "@/src/context/CartContext";

export default function TotalOrder() {
  const { cart, removeFromCart, total } = useCart();
  const formattedTotal = total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const free = 1;
  return (
    <>
      <div className="my-4 gap-2 flex flex-col">
        <div className="flex text-sm items-center justify-between text-black ">
          <p className="font-semibold">المجموع</p>
          <p>
            2,435
            <span className="text-sm ms-1">جنيه</span>
          </p>
        </div>
        <div className="flex items-center justify-between ">

          <p className="text-sm">إجمالي رسوم الشحن</p>

          {free ?(<p className="font-semibold text-green-600">مجانا</p> ): (  <p className="text-md">
            48
            <span className="text-sm ms-1">جنيه</span>
          </p>)}

        
        </div>
        <div className="flex text-pro items-center justify-between border-b-2 border-gray-200  pb-3">
          <p className="text-sm">رسوم الدفع عند الإستلام</p>
          <p className="text-md">
            50
            <span className="text-sm ms-1">جنيه</span>
          </p>
        </div>
        <div className="flex items-center justify-between pb-3 pt-2">
          <div className="flex gap-1 items-center">
            <p className="text-md text-pro font-semibold">الإجمالي :</p>
            <p className="text-[12px] font-semibold text-gray-600">
              (يشمل ضريبة القيمة المضافة)
            </p>
          </div>

          <p className="text-[15px] text-pro font-bold">
            {formattedTotal}
            <span>جنيه</span>
          </p>
        </div>
      </div>
    </>
  );
}
