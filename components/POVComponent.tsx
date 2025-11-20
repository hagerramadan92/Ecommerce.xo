"use client";

import { ProductI } from "@/Types/ProductsI";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
interface POVProps {
  product: ProductI; // هنا بنحدد النوع
}
export default function POVComponent({ product }: POVProps) {
  const reviews = product?.reviews || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold mb-4">تقييمات المنتج</h3>

      {reviews.length === 0 && (
        <p className="text-gray-500 text-center">لا توجد تقييمات بعد</p>
      )}

      {reviews.map((review) => (
        <div
          key={review.id}
          className=" border-b border-gray-300  p-4 flex gap-4 items-start bg-white "
        >
          <Image
            src={review.user?.image || "/user.png"}
            alt={review.user?.name || "user"}
            width={22}
            height={22}
            className="w-12 h-12 rounded-full object-cover"
          />

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-900">{review.user?.name}</p>

              <p className="text-xs text-gray-400 mt-1">{review.created_at}</p>
            </div>

            <p className="text-gray-700 mt-1">{review.comment}</p>
            <div className="flex text-yellow-400">
              {Array(review.rating)
                .fill(0)
                .map((_, i) => (
                  <FaStar key={i} />
                ))}
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <span className="px-2 py-1 bg-green-100 text-green-600 rounded-md">
                قام بالشراء
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-md">
                تم التقييم
              </span>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
