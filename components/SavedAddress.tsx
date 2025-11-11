"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Button from "@mui/material/Button";
import AddressForm from "./AddressForm";

export default function SavedAddress({ onClose }: { onClose: () => void }) {
  const [showAddress, setShowAddress] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white w-[60vw] max-h-[80vh] overflow-y-auto p-8 rounded-xl"
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-gray-200 mb-3">
            <h3 className="text-[#252525] font-bold text-[1.3rem]">
              العناوين المحفوظة
            </h3>
            <div
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 cursor-pointer rounded-full"
            >
              <IoMdClose size={22} className="text-gray-500" />
            </div>
          </div>

          {/* Addresses List */}
          <div className="h-[40vh] overflow-y-scroll flex flex-col gap-4 mt-7">
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
                  <div className="w-10 h-10 flex items-center justify-center hover:bg-orange-200 cursor-pointer rounded-full">
                    <button onClick={() => setOpenModal(true)} className="cursor-pointer">
                      <FaRegEdit size={20} className="text-gray-600 cursor-pointer" />
                    </button>
                  </div>
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

          {/* Footer */}
          <div className="py-2 mt-7">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setOpenModal(true)}
                className="flex items-center gap-1 text-pro-max font-bold text-lg cursor-pointer"
              >
                <FaPlus />
                <p>أضف عنوان</p>
              </button>

              <Button
                variant="contained"
                sx={{
                  fontSize: "1.1rem",
                  backgroundColor: "#14213d",
                  "&:hover": { backgroundColor: "#0f1a31" },
                  color: "#fff",
                  gap: "10px",
                  paddingX: "60px",
                  paddingY: "8px",
                  borderRadius: "10px",
                  textTransform: "none",
                }}
              >
                تأكيد
              </Button>
            </div>
          </div>
          <AddressForm open={openModal} onClose={() => setOpenModal(false)} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
