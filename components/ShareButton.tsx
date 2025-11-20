"use client";

import { BsShare } from "react-icons/bs";
import toast from "react-hot-toast";

export default function ShareButton() {
  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      // إذا كان المتصفح يدعم المشاركة الأصلية
      try {
        await navigator.share({ title, url });
        toast.success("تمت المشاركة بنجاح!");
      } catch (err) {
        console.error(err);
        toast.error("فشل المشاركة");
      }
    } else {
      // إذا لم يدعم المشاركة، يتم نسخ الرابط
      try {
        await navigator.clipboard.writeText(url);
        toast.success("تم نسخ رابط الصفحة!");
      } catch (err) {
        console.error(err);
        toast.error("فشل نسخ الرابط");
      }
    }
  };

  return (
    <div
      onClick={handleShare}
      className="w-8 h-8 shadow rounded-full bg-white/70 duration-75 flex items-center justify-center p-0.5 cursor-pointer transition-transform hover:scale-110"
    >
      <BsShare size={17} className="text-pro" />
    </div>
  );
}
