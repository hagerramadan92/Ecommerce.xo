"use client";
import { useState } from "react";
import toast from "react-hot-toast";
export default function CoBon() {
  const [code, setCode] = useState("");
  const handleApply = () => {
    if (!code.trim()) {
      toast.error("هناك خطأ ما، من فضلك أدخل الكود", { position: "top-left" });
      return;
    }

    toast.success("تم تطبيق الكود بنجاح ", { position: "top-left" });
  };
  return (
    <div>
      <p className="text-xl font-bold p-2 text-pro">كوبون كود</p>
      <div className="flex items-center border border-gray-300 rounded overflow-hidden w-full max-w-sm">
        <input
          type="text"
          value={code}
          placeholder="ادخل الكود"
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 px-4 py-2 text-gray-800 focus:outline-none"
        />
        <button
          onClick={handleApply}
          aria-label="copon"
          className="bg-gray-200 cursor-pointer text-gray-800 px-5 py-2 hover:bg-gray-300 transition-colors duration-200"
        >
          تطبيق
        </button>
      </div>
    </div>
  );
}
