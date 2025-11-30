"use client";
import { useState } from "react";

import Image from "next/image";
import { FaAngleLeft } from "react-icons/fa6";
import OrderPayDetails from "@/components/orderPayDetails";
import TotalOrder from "@/components/TotalOrder";

import { TbCopy } from "react-icons/tb";
import OrderProgress from "@/components/OrderProgress";
import Link from "next/link";
import ButtonComponent from "@/components/ButtonComponent";

export default function page() {
  const [section, setSection] = useState("orders");

  const steps = ["تم الطلب", "جاري التنفيذ", "جاري التوصيل", "تم التوصيل"];
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <>
      <div className="px-5 lg:px-[7%] xl:px-[18%] py-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="col-span-1 lg:col-span-2 h-fit shadow p-5 rounded-2xl ">
            <div className="flex  items-center gap-3">
              <Image
                src="/images/success.png"
                alt="success"
                width={87}
                height={92}
              />
              <div className="flex flex-col gap-7">
                <div className="flex items-center gap-1 font-semibold text-2xl text-green-600 mt-5">
                  <p>شكراً</p>
                  <p>Hager</p>
                  <p>!</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-gray-100 px-2  rounded flex items-center gap-1 w-fit">
                    <h6>رقم الطلب </h6>
                    <p>#1639463</p>
                  </div>
                  <div className="p-2 border  border-gray-200 rounded w-fit cursor-pointer">
                    <TbCopy size={20} className="cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-50 mt-8 flex items-center justify-center my-4 py-4 rounded-xl">
              <OrderProgress steps={steps} currentStep={currentStep} />
            </div>
            <div className="p-3 rounded-lg border border-gray-200">
              <h5 className="font-semibold text-xl my-2">حالة الطلب</h5>
              <p className="text-sm mb-2">
                تم استلام طلبك بنجاح. ستصلك رسالة تأكيد عبر البريد الإلكتروني
                <span className="font-semibold">hagerramadan440@gmail.com</span>
              </p>
              <Link href="/myAccount/orders">
                <div className="flex items-center gap-0.5 font-semibold text-md cursor-pointer text-pro-max mb-2">
                  <p>تتبع طلبك</p>
                  <FaAngleLeft />
                </div>
              </Link>
            </div>
            <div className="p-3 rounded-lg border border-gray-200 mt-5">
              <h5 className="font-semibold text-xl my-2">عنوان الشحن</h5>
              <div className="flex flex-col text-black/75 text-md my-3">
                <p>haGER ramadan</p>
                <p>الجيزة حي الجيزة الجيزه الجيزه</p>
                <p>1102034678</p>
              </div>
            </div>
            <div className="p-3 rounded-lg border border-gray-200 mt-5">
              <h5 className="font-semibold text-xl my-2">طريقة الدفع</h5>
              <div className="flex items-center gap-1 my-2">
                <Image
                  src="/images/cod.png"
                  alt="payment method"
                  width={55}
                  height={33}
                />
                <p className="text-sm text-black/90">Cash On Delivery (COD)</p>
              </div>
            </div>
            <div className="flex items-center justify-between my-2">
              <div className="flex items-center gap-1">
                <p>إذا كنت بحاجة إلى أي دعم</p>
                <span>|</span>
                <Link href="/myAccount/help" className=" underline ">
                  مركز المساعدة
                </Link>
              </div>
              <div className="px-4 bg-pro text-white py-2 rounded w-fit">
                <Link href="/">اضافه طلب جديد</Link>
              </div>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-1 h-fit ">
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="font-semibold text-2xl mb-4">تفاصيل الطلب</h2>
              <OrderPayDetails />
            </div>

            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="font-semibold text-2xl mb-4">ملخص الطلب</h2>
              <TotalOrder />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
