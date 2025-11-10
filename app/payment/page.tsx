import BankPayment from "@/components/BankPayment";
import CoBon from "@/components/cobon";
import InvoiceSection from "@/components/InvoiceSection";
import OrderSummary from "@/components/OrderSummary";
import TotalOrder from "@/components/TotalOrder";
import { FiPlus } from "react-icons/fi";

export default function PaymentPage() {
  return (
    <>
      <div className="px-5 lg:px-[7%] xl:px-[18%]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="col-span-1 lg:col-span-2 h-fit">
            <div className="p-2 ps-6 shadow rounded-xl my-4">
              <h2 className="text-2xl font-semibold py-3"> عنوان الشحن</h2>
            </div>
            <div className="flex flex-col shadow rounded-xl my-4 p-6 gap-3">
              <div className="rounded-xl  border border-gray-100 overflow-hidden pt-5 gap-4">
                <div className=" mb-2">
                  <h3 className="border-b border-gray-300 pb-4 ps-4 text-xl font-semibold">
                    عنوان الشحن
                  </h3>
                  <p className="ps-4 py-4 text-gray-700 font-semibold">
                    التوصيل إلى
                    <span> الجيزه</span>
                  </p>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-4">
                  <button className="flex items-center text-pro-max font-bold cursor-pointer">
                    <FiPlus />
                    <p>أضف عنوان</p>
                  </button>
                  <button className="text-pro-max underline font-bold cursor-pointer">
                    تغيير
                  </button>
                </div>
              </div>
            </div>
            <div className="p-2 ps-6 shadow rounded-xl my-4">
              <h2 className="text-2xl font-semibold py-3">اختر طريقة الدفع</h2>
            </div>

            <BankPayment />
          </div>
          <div className="col-span-1 lg:col-span-1 h-fit mt-4">
            <div className="p-2 shadow mb-1 pb-5 rounded-xl">
              <CoBon />
            </div>

            <div className="p-2 shadow my-3 pb-3 rounded-xl">
              <InvoiceSection />
            </div>
            <div className="p-2 pb-0 shadow mt-3  rounded-xl">
              <OrderSummary />
              <TotalOrder />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
