import Image from "next/image";
import { LuTruck } from "react-icons/lu";

export default function OrderPayDetails() {
  return (
    <>
      <div className="  border border-gray-200 rounded-md pt-3 overflow-hidden">
        <div className="flex gap-3 ps-3">
          <Image src="/images/o1.jpg" alt="product" width={92} height={92} className="h-fit rounded"/>

          <div className="pb-3 pt-0">
            <p className="text-sm mb-2 text-gray-700">طبق تقديم خشب أرو بيج - 42 × 22 سم</p>
            <p className="text-gray-500 font-semibold mb-1">
              الكمية : <span>1</span>
            </p>
            <h6 className="font-bold">
              810
              <span className="font-semibold text-sm ms-1">جنيه</span>
            </h6>
            <p className="bg-[#f0fbf3] text-[#20a144] rounded px-3 py-1 w-fit text-md my-2">ينتج عند الطلب</p>
            <div className="flex items-center gap-1">
                <LuTruck size={28} className=" scale-x-[-1] text-gray-600"/>
                <p className="text-sm text-gray-600">توصيل18 نوفمبر - 20 نوفمبر, بإستثناء الاجازات</p>
            </div>
            
          </div>
        </div>

        <p className="text-gray-700 bg-gray-50 text-center w-full py-2 font-semibold">
          إجمالي رسوم الشحن
          <span className="font-bold mx-0.5">27</span>
          <span>جنيه</span>
        </p>
      </div>
    </>
  );
}
