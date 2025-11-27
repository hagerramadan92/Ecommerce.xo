"use client";
import { useCart } from "@/src/context/CartContext";

export default function TotalOrder() {
  const { cart, cartCount, subtotal, total } = useCart();
  console.log("TotalOrder cart:", cart);
  const formattedSubtotal = subtotal.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const shippingFree = true; // لو عايزة منطق ديناميكي: cart.length > 0 ? true : false
  const shippingFee = shippingFree ? 0 : 48;

  const cashOnDelivery = 50;

  const grandTotal = (total + shippingFee + cashOnDelivery).toLocaleString(
    "en-US",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );

  return (
    <div className="my-4 gap-2 flex flex-col">

      {/* المجموع */}
      <div className="flex text-sm items-center justify-between text-black">
        <p className="font-semibold">المجموع ({cartCount} عناصر)</p>
        <p>
          {formattedSubtotal}
          <span className="text-sm ms-1">جنيه</span>
        </p>
      </div>

      {/* رسوم الشحن */}
      <div className="flex items-center justify-between">
        <p className="text-sm">إجمالي رسوم الشحن</p>
        {shippingFree ? (
          <p className="font-semibold text-green-600">مجانا</p>
        ) : (
          <p className="text-md">
            {shippingFee}
            <span className="text-sm ms-1">جنيه</span>
          </p>
        )}
      </div>

      {/* الدفع عند الاستلام */}
      <div className="flex text-pro items-center justify-between border-b-2 border-gray-200 pb-3">
        <p className="text-sm">رسوم الدفع عند الإستلام</p>
        <p className="text-md">
          {cashOnDelivery}
          <span className="text-sm ms-1">جنيه</span>
        </p>
      </div>

      {/* الإجمالي */}
      <div className="flex items-center justify-between pb-3 pt-2">
        <div className="flex gap-1 items-center">
          <p className="text-md text-pro font-semibold">الإجمالي :</p>
          <p className="text-[12px] font-semibold text-gray-600">
            (يشمل ضريبة القيمة المضافة)
          </p>
        </div>

        <p className="text-[15px] text-pro font-bold">
          {grandTotal}
          <span> جنيه</span>
        </p>
      </div>
    </div>
  );
}
