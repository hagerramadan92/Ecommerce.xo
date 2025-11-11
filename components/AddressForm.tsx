"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";
import Button from "@mui/material/Button";
import { motion, AnimatePresence } from "framer-motion";

interface AddressFormInputs {
  firstName: string;
  lastName: string;
  building?: string;
  floor: string;
  apartment: string;
  details: string;
  nickname?: string;
  phone: string;
  city: string;
  area: string;
  addressType: string;
}

interface AddressFormProps {
  open: boolean;
  onClose: () => void;
}

const schema = yup.object().shape({
  firstName: yup.string().required("الإسم الأول مطلوب"),
  lastName: yup.string().required("الإسم الأخير مطلوب"),
  floor: yup.string().required("الدور مطلوب"),
  apartment: yup.string().required("رقم الشقة مطلوب"),
  details: yup.string().required("تفاصيل العنوان مطلوبة"),
  phone: yup
    .string()
    .matches(/^01[0-9]{9}$/, "رقم الهاتف غير صحيح")
    .required("رقم الهاتف مطلوب"),
  city: yup.string().required("المدينة مطلوبة"),
  area: yup.string().required("المنطقة مطلوبة"),
  addressType: yup.string().required("نوع العنوان مطلوب"),
});

export default function AddressForm({ open, onClose }: AddressFormProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddressFormInputs>({
    resolver: yupResolver(schema),
  });

  const selectedType = watch("addressType");

  const onSubmit = (data: AddressFormInputs) => {
    localStorage.setItem("address", JSON.stringify(data));
    toast.success("تم حفظ العنوان بنجاح ", { position: "top-left" });
    reset();
    setTimeout(() => onClose(), 500);
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <Toaster />

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-[90%] md:w-[900px] max-h-[90vh] overflow-y-auto p-8 relative"
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  تفاصيل العنوان
                </h2>
                <button
                  onClick={onClose}
                  className="cursor-pointer text-gray-500 hover:text-gray-800 transition"
                >
                  <IoCloseSharp size={26} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="h-[60vh] overflow-y-scroll flex flex-col gap-4 mt-7 px-4">
                  <div className="grid md:grid-cols-2 gap-5">
                    {[
                      { name: "firstName", label: "الإسم الأول" },
                      { name: "lastName", label: "الإسم الأخير" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-gray-700 mb-1 font-semibold">
                          {field.label}
                        </label>
                        <input
                          {...register(field.name as keyof AddressFormInputs)}
                          className={`border rounded-lg w-full p-3 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition ${
                            errors[field.name as keyof AddressFormInputs]
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                        />
                        <p className="text-red-500 text-sm mt-1">
                          {
                            errors[field.name as keyof AddressFormInputs]
                              ?.message as string
                          }
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-3 gap-5">
                    {[
                      { name: "building", label: "المبنى (اختياري)" },
                      { name: "floor", label: "الدور" },
                      { name: "apartment", label: "رقم الشقة" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-gray-700 mb-1 font-semibold">
                          {field.label}
                        </label>
                        <input
                          {...register(field.name as keyof AddressFormInputs)}
                          className={`border rounded-lg w-full p-3 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition ${
                            errors[field.name as keyof AddressFormInputs]
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                        />
                        <p className="text-red-500 text-sm mt-1">
                          {
                            errors[field.name as keyof AddressFormInputs]
                              ?.message as string
                          }
                        </p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">
                      تفاصيل العنوان
                    </label>
                    <textarea
                      {...register("details")}
                      className={`border rounded-lg w-full p-3 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition ${
                        errors.details ? "border-red-400" : "border-gray-300"
                      }`}
                      rows={3}
                    />
                    <p className="text-red-500 text-sm mt-1">
                      {errors.details?.message}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {[
                      { name: "nickname", label: "اسم مختصر" },
                      { name: "phone", label: "رقم الهاتف" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-gray-700 mb-1 font-semibold">
                          {field.label}
                        </label>
                        <input
                          {...register(field.name as keyof AddressFormInputs)}
                          className={`border rounded-lg w-full p-3 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition ${
                            errors[field.name as keyof AddressFormInputs]
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                        />
                        <p className="text-red-500 text-sm mt-1">
                          {
                            errors[field.name as keyof AddressFormInputs]
                              ?.message as string
                          }
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {[
                      {
                        name: "city",
                        label: "المدينة",
                        options: ["القاهرة", "الإسكندرية", "الجيزة"],
                      },
                      {
                        name: "area",
                        label: "المنطقة",
                        options: ["مدينة نصر", "الدقي", "المهندسين"],
                      },
                    ].map((select) => (
                      <div key={select.name}>
                        <label className="block text-gray-700 mb-1 font-semibold">
                          {select.label}
                        </label>
                        <select
                          {...register(select.name as keyof AddressFormInputs)}
                          className={`border rounded-lg w-full p-3 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition ${
                            errors[select.name as keyof AddressFormInputs]
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">اختر {select.label}</option>
                          {select.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <p className="text-red-500 text-sm mt-1">
                          {
                            errors[select.name as keyof AddressFormInputs]
                              ?.message as string
                          }
                        </p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-semibold">
                      نوع العنوان
                    </label>
                    <div className="flex gap-4">
                      {[
                        { value: "home", label: " منزل" },
                        { value: "work", label: "عمل" },
                      ].map((btn) => (
                        <button
                          key={btn.value}
                          type="button"
                          onClick={() => setValue("addressType", btn.value)}
                          className={`px-6 py-2 rounded-lg font-semibold border transition-all duration-300 ${
                            selectedType === btn.value
                              ? "bg-orange-500 text-white border-orange-500 shadow-md"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-red-500 text-sm mt-1">
                      {errors.addressType?.message}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <Button
                    variant="contained"
                    type="submit"
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
                    حفظ العنوان
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
