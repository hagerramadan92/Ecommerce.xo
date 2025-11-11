"use client";
import { useState } from "react";

export default function Page() {
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const addresses = [
    {
      id: 1,
      title: "الجيزه",
      name: "Hager Ramadan",
      details: "الجيزه الجيزه",
      floor: "الدور(2) - رقم الشقة(21)",
      phone: "1102034678",
    },
    {
      id: 2,
      title: "القاهرة",
      name: "Hager Ramadan",
      details: "مدينة نصر - الحي الثامن",
      floor: "الدور(5) - رقم الشقة(10)",
      phone: "1102034678",
    },
    {
      id: 3,
      title: "الاسكندرية",
      name: "Hager Ramadan",
      details: "شارع البحر - سيدي بشر",
      floor: "الدور(3) - رقم الشقة(5)",
      phone: "1102034678",
    },
  ];
  return (
    <>
      <div>
        <h2 className="text-[#252525] font-bold text-[1.7rem]">
          إدارة العناوين
        </h2>

        {/* Addresses List */}
        <div className=" flex flex-col gap-4 mt-7">
          {addresses.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedAddress(item.id)}
              className={`cursor-pointer rounded-2xl   border transition-all duration-300 ${
                selectedAddress === item.id
                  ? " border-orange-500"
                  : " border-gray-200 "
              }`}
            >
              <div
                className={`flex items-center rounded-2xl rounded-bl-none rounded-br-none justify-between border-b border-gray-200 p-4 ${
                  selectedAddress === item.id
                    ? "bg-orange-100"
                    : "bg-gray-50 border-gray-200 "
                }`}
              >
                <h4 className="text-[#000000de] font-semibold text-xl">
                  {item.title}
                </h4>
              </div>
              <div className="px-4 py-3 flex flex-col gap-1">
                <h5>{item.name}</h5>
                <p>{item.details}</p>
                <p>{item.floor}</p>
                <p>{item.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
