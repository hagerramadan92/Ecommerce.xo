"use client";

import { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import OrderPayDetails from "./orderPayDetails";


export default function OrderSummary() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="w-full">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer showDetails mb-4"
        onClick={() => setShowDetails(!showDetails)}
      >
        <h4 className="text-pro font-semibold my-2 text-xl">ملخص الطلب</h4>

        <div className="flex items-center gap-1">
          <p className="text-gray-800 transition-all duration-300">
            {showDetails ? "إخفاء التفاصيل" : "إظهار التفاصيل"}
          </p>
          <MdOutlineKeyboardArrowDown
            size={22}
            className={`text-gray-400 transition-transform duration-300 ${
              showDetails ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      {/* Animated component */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <OrderPayDetails />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
