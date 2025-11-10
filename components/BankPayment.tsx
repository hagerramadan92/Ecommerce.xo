"use client";

import { useState } from "react";
import Image from "next/image";
import { MdKeyboardArrowDown } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export default function BankPayment() {
  const [open, setOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<number | null>(null);

  const banks = [
    {
      id: 1,
      name: "البنك الاهلي السعودي",
      desc: "الدفع بطاقة الخصم / الائتمان البنك الاهلي السعودي",
      img: "/images/bank.webp",
    },
    {
      id: 2,
      name: "بنك BB4",
      desc: "الدفع بطاقة الخصم / الائتمان بنك BB4",
      img: "/images/bb4.png",
    },
    {
      id: 3,
      name: "تحويل بنكي",
      desc: "الدفع عن طريق التحويل البنكي",
      img: "/images/bank+transfer.png",
    },
  ];
  const banks2 = [
    {
      id: 4,
      name: "الدفع عند الاستلام",
      desc: "سيتم تطبيق رسوم أضافية",
      img: "/images/money .png",
    },
    {
      id: 5,
      name: "كروت فيزا بريميوم",
      desc: "  ادفع بواسطه فيزا ",
      img: "/images/visa.png",
    },
  ];

  return (
    <div className="shadow-md rounded-xl p-4 mb-4">
      {/* parent */}
      <div
        className="flex items-center justify-between gap-2 cursor-pointer parent"
        onClick={() => setOpen(!open)}
      >
        <p className="text-xl text-gray-800">الدفع بالبطاقات البنكية</p>
        <MdKeyboardArrowDown
          size={22}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      <div
        className={`flex items-center gap-4 my-2 images transition-opacity duration-500 ${
          open ? "opacity-0" : "opacity-100"
        }`}
        style={{ minHeight: "50px" }}
      >
        {banks.map((bank) => (
          <Image
            key={bank.id}
            src={bank.img}
            alt={bank.name}
            width={80}
            height={35}
          />
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col gap-4 selecting overflow-hidden"
          >
            {banks.map((bank) => (
              <label
                key={bank.id}
                className={`flex items-center gap-3 p-4 border rounded cursor-pointer transition-all ${
                  selectedBank === bank.id
                    ? "border-orange-300 bg-orange-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="bank"
                  checked={selectedBank === bank.id}
                  onChange={() => setSelectedBank(bank.id)}
                  className="w-6 h-6 accent-[#e26200] cursor-pointer"
                />
                <Image src={bank.img} alt={bank.name} width={80} height={55} />
                <div className="flex flex-col gap-1">
                  <h6 className="font-semibold">{bank.name}</h6>
                  <p className="text-gray-500 font-semibold text-sm">
                    {bank.desc}
                  </p>
                </div>
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="my-6">
         {banks2.map((bank) => (
        <label
          key={bank.id}
          className={`flex items-center gap-3 my-6 p-4 border rounded cursor-pointer transition-all ${
            selectedBank === bank.id
              ? "border-orange-300 bg-orange-50"
              : "border-gray-200"
          }`}
        >
          <input
            type="radio"
            name="bank"
            checked={selectedBank === bank.id}
            onChange={() => setSelectedBank(bank.id)}
            className="w-6 h-6 accent-[#e26200] cursor-pointer"
          />
          <Image src={bank.img} alt={bank.name} width={40} height={35} />
          <div className="flex flex-col gap-1">
            <h6 className="font-semibold">{bank.name}</h6>
            <p className="text-gray-500 font-semibold text-sm">{bank.desc}</p>
          </div>
        </label>
      ))}
      </div>
     
    </div>
  );
}
