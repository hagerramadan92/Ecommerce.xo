"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaTruckFast } from "react-icons/fa6";
import { GoChecklist } from "react-icons/go";
import { IoWalletOutline } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import OrderProgress from "./OrderProgress";

interface Props {
  orderId: string;
}

interface OrderItem {
  product_name: string;
  quantity: number;
  price: string;
  options: string;
  image: string | null;
}

interface OrderData {
  order_number: string;
  status: "pending" | "completed" | "cancelled" | string;
  total_amount: string;
  formatted_total: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string | null;
  notes: string;
  created_at: string;
  items: OrderItem[];
}

export default function OrderDetailsPage({ orderId }: Props) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ["تم الطلب", "جاري التنفيذ", "جاري التوصيل", "تم التوصيل"];

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiToken = localStorage.getItem("auth_token");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`${baseUrl}/order/${orderId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
        });
        const data = await res.json();
        if (data.status && data.data) {
          setOrder(data.data);

          // تعيين الـ step الحالي حسب الـ status
          switch (data.data.status) {
            case "pending":
              setCurrentStep(2);
              break;
            case "completed":
              setCurrentStep(4);
              break;
            case "cancelled":
              setCurrentStep(0);
              break;
            default:
              setCurrentStep(1);
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, baseUrl, apiToken]);

  if (loading) return <p>جاري تحميل تفاصيل الطلب...</p>;
  if (!order) return <p>لم يتم العثور على الطلب</p>;

  return (
    <div className="rounded-2xl lg:px-2 mb-16 w-full">
      {/* Header */}
      <div className="shadow rounded-xl p-3 bg-white text-[#475569] font-semibold pb-4 mb-3">
        <h3 className="text-pro text-[1.6rem] font-bold mb-1">
          تفاصيل الطلب
        </h3>
        <p className="mb-1">
          رقم الطلب:
          <span className="font-bold ms-1">{order.order_number}</span>
        </p>
        <p>
          تاريخ الطلب:
          <span className="font-bold ms-1">{order.created_at}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* تفاصيل المنتجات */}
        <div className="shadow rounded-2xl pt-3 lg:col-span-2 bg-white h-fit">
          {order.items.map((item, index) => (
            <div key={index}>
              <h3 className="text-pro-max font-bold ps-4 mb-2 text-lg">
                رقم المنتج: <span>{index + 1}</span>
              </h3>
              <div className="flex gap-4 ps-4">
                <Image
                  src={item.image || "/images/o1.jpg"}
                  alt={item.product_name || "منتج"}
                  width={120}
                  height={120}
                  className="rounded-xl"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-[#323d4b] my-2 font-semibold">
                    {item.product_name || "اسم المنتج"}
                  </p>
                  <p className="text-[#383a41b2]">
                    الكمية:
                    <span className="font-semibold mx-1 text-[#475569]">
                      {item.quantity || 1} منتج
                    </span>
                  </p>
                  <p className="text-[#475569]">
                    سعر المنتج:
                    <span className="font-semibold mx-1 text-[#475569]">
                      {item.price || "0"} جنيه
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-1 mt-4 mb-2 pb-4 items-center border-b border-gray-200 ps-4">
            <FaTruckFast size={20} className="scale-x-[-1]" />
            <p className="text-[#696969e6] font-semibold text-[1rem]">
              التوصيل خلال الفترة من{" "}
              <span className="font-bold text-[#43454c] mx-1">
                {order.shipping_address || "العنوان غير متوفر"}
              </span>
              باستثناء الإجازات.
            </p>
          </div>

          <div className="p-6 ps-4">
            <OrderProgress steps={steps} currentStep={currentStep} />
          </div>

          {/* حالة الطلب مع الألوان */}
          <div className="pb-3 border-t border-gray-200">
            <div
              className={`ms-4 my-3 px-3 rounded-md w-fit text-[0.95rem] py-1 ${
                order.status === "pending"
                  ? "bg-[#fef1df] text-[#a35e00]"
                  : order.status === "completed"
                  ? "bg-[#d1fae5] text-[#065f46]"
                  : order.status === "cancelled"
                  ? "bg-[#fee2e2] text-[#b91c1c]"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {order.status === "pending"
                ? "جاري التنفيذ"
                : order.status === "completed"
                ? "تم التنفيذ"
                : order.status === "cancelled"
                ? "ملغى"
                : order.status}
            </div>
          </div>
        </div>

        {/* ملخص الطلب */}
        <div className="flex flex-col gap-5">
          <div className="shadow rounded-2xl pt-3 lg:col-span-1 bg-white h-fit p-4">
            <div className="flex gap-4 pb-4 border-b border-gray-200 items-center">
              <GoChecklist className="w-9 h-10 p-1.5 rounded bg-blue-50 text-blue-900" />
              <p className="text-[#1f2a4a] font-semibold text-lg">ملخص الطلب</p>
            </div>
            <div className="mt-4 text-[#696969] gap-2.5 font-semibold flex flex-col">
              <div className="flex items-center justify-between">
                <p>المجموع الفرعي:</p>
                <p className="font-bold text-[1rem]">{order.total_amount || "0"} جنيه</p>
              </div>
              <div className="flex items-center justify-between">
                <p>اجمالي رسوم الشحن:</p>
                <p className="font-bold text-[1rem]">50 جنيه</p>
              </div>
              <div className="flex items-center justify-between">
                <p>رسوم الدفع عند الاستلام:</p>
                <p className="font-bold text-[1rem]">50 جنيه</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xl">الإجمالي</p>
                <p className="font-bold text-black text-xl">
                  {order.total_amount || "0"}
                  <span className="text-sm font-normal">جنيه</span>
                </p>
              </div>
            </div>
          </div>

          {/* طريقة الدفع */}
          <div className="shadow rounded-2xl pt-3 bg-white h-fit p-4 flex items-center gap-4">
            <IoWalletOutline className="w-9 h-10 p-1.5 rounded bg-blue-50 text-blue-900" />
            <div>
              <h5 className="text-xl text-[#696969] font-semibold mb-1.5">
                طريقة الدفع:
              </h5>
              <p className="text-[#475569] text-[1rem]">Cash On Delivery (COD)</p>
            </div>
          </div>

          {/* عنوان الشحن */}
          <div className="shadow rounded-2xl pt-3 bg-white h-fit p-4 flex items-center gap-4">
            <SlLocationPin className="w-9 h-10 p-1.5 rounded bg-blue-50 text-blue-900" />
            <div>
              <h5 className="text-xl text-[#696969] font-semibold mb-1.5">عنوان الطلب</h5>
              <p className="text-[#475569] font-semibold text-[1rem]">
                {order.shipping_address || "العنوان غير متوفر"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
