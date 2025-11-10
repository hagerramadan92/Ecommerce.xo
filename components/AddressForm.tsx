"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";

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
    toast.success("تم حفظ العنوان بنجاح ✅", { position: "top-right" });
    reset();
    setTimeout(() => onClose(), 1000);
  };

  if (!open || !mounted) return null;

  return createPortal(
    <>
      <Toaster />
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[1200px] max-h-[90vh] overflow-y-auto p-6 relative">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
            <h2 className="text-xl font-bold text-gray-800 text-center">
              تفاصيل العنوان
            </h2>
            <button
              onClick={onClose}
              className="cursor-pointer text-gray-500 hover:text-black text-xl"
            >
              <IoCloseSharp size={26} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "firstName", label: "الإسم الأول" },
                { name: "lastName", label: "الإسم الأخير" },
              ].map((field) => (
                <div key={field.name} className="relative">
                  <input
                    id={field.name}
                    {...register(field.name as keyof AddressFormInputs)}
                    className="peer border border-gray-300 rounded w-full p-3 pt-5 text-gray-900 focus:border-orange-500 focus:outline-none"
                    placeholder=" "
                  />
                  <label
                    htmlFor={field.name}
                    className="absolute bg-white px-1 text-gray-500 duration-200 transform top-1/2 -translate-y-1/2 right-3 origin-[right]
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400
                    peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-orange-500 peer-focus:scale-90"
                  >
                    {field.label}
                  </label>
                  <p className="text-red-500 text-sm mt-1">
                    {
                      errors[field.name as keyof AddressFormInputs]
                        ?.message as string
                    }
                  </p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "building", label: "المبنى (اختياري)" },
                { name: "floor", label: "الدور" },
                { name: "apartment", label: "رقم الشقة" },
              ].map((field) => (
                <div key={field.name} className="relative">
                  <input
                    id={field.name}
                    {...register(field.name as keyof AddressFormInputs)}
                    className="peer border border-gray-300 rounded w-full p-3 pt-5 text-gray-900 focus:border-orange-500 focus:outline-none"
                    placeholder=" "
                  />
                  <label
                    htmlFor={field.name}
                    className="absolute bg-white px-1 text-gray-500 duration-200 transform top-1/2 -translate-y-1/2 right-3 origin-[right]
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400
                    peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-orange-500 peer-focus:scale-90"
                  >
                    {field.label}
                  </label>
                  <p className="text-red-500 text-sm mt-1">
                    {
                      errors[field.name as keyof AddressFormInputs]
                        ?.message as string
                    }
                  </p>
                </div>
              ))}
            </div>

            <div className="relative">
              <textarea
                id="details"
                {...register("details")}
                className="peer border border-gray-300 rounded w-full p-3 pt-5 text-gray-900 focus:border-orange-500 focus:outline-none"
                placeholder=" "
                rows={3}
              />
              <label
                htmlFor="details"
                className="absolute bg-white px-1 text-gray-500 duration-200 transform top-5 right-3 origin-[right]
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400
                peer-focus:-top-2 peer-focus:text-orange-500 peer-focus:scale-90"
              >
                تفاصيل العنوان
              </label>
              <p className="text-red-500 text-sm mt-1">
                {errors.details?.message}
              </p>
            </div>

            <div className="relative">
              <input
                id="nickname"
                {...register("nickname")}
                className="peer border border-gray-300 rounded w-full p-3 pt-5 text-gray-900 focus:border-orange-500 focus:outline-none"
                placeholder=" "
              />
              <label
                htmlFor="nickname"
                className="absolute bg-white px-1 text-gray-500 duration-200 transform top-1/2 -translate-y-1/2 right-3 origin-[right]
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                peer-focus:-top-2 peer-focus:text-orange-500 peer-focus:scale-90"
              >
                اسم مختصر
              </label>
            </div>

            {/* رقم الهاتف */}
            <div className="relative">
              <input
                id="phone"
                {...register("phone")}
                className="peer border border-gray-300 rounded w-full p-3 pt-5 text-gray-900 focus:border-orange-500 focus:outline-none"
                placeholder=" "
              />
              <label
                htmlFor="phone"
                className="absolute bg-white px-1 text-gray-500 duration-200 transform top-1/2 -translate-y-1/2 right-3 origin-[right]
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                peer-focus:-top-2 peer-focus:text-orange-500 peer-focus:scale-90"
              >
                رقم الهاتف
              </label>
              <p className="text-red-500 text-sm mt-1">
                {errors.phone?.message}
              </p>
            </div>

            {/* المدينة والمنطقة */}
            <div className="grid md:grid-cols-2 gap-4">
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
                <div key={select.name} className="relative">
                  <select
                    id={select.name}
                    {...register(select.name as keyof AddressFormInputs)}
                    className="peer border border-gray-300 rounded w-full p-3 pt-5 text-gray-900 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">اختر {select.label}</option>
                    {select.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor={select.name}
                    className="absolute bg-white px-1 text-gray-500 duration-200 transform top-1/2 -translate-y-1/2 right-3 origin-[right]
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                    peer-focus:-top-2 peer-focus:text-orange-500 peer-focus:scale-90"
                  >
                    {select.label}
                  </label>
                  <p className="text-red-500 text-sm mt-1">
                    {
                      errors[select.name as keyof AddressFormInputs]
                        ?.message as string
                    }
                  </p>
                </div>
              ))}
            </div>

            {/* نوع العنوان */}
            <div className="flex gap-4 mt-2">
              {[
                { value: "home", label: "منزل" },
                { value: "work", label: "عمل" },
              ].map((btn) => (
                <button
                  key={btn.value}
                  type="button"
                  onClick={() => setValue("addressType", btn.value)}
                  className={`px-6 py-2 rounded border transition ${
                    selectedType === btn.value
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <p className="text-red-500 text-sm">
              {errors.addressType?.message}
            </p>

            {/* زر الحفظ */}
            <div className="flex justify-end mt-5">
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
              >
                حفظ العنوان
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
}
