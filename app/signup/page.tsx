"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { log } from "console";

// --- دالة قراءة الكوكي من المتصفح ---
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrors({});

    // --- تحقق من الحقول ---
    const newErrors: { [key: string]: string } = {};
    if (!firstName.trim()) newErrors.firstName = "الاسم الأول مطلوب";
    if (!lastName.trim()) newErrors.lastName = "الاسم الأخير مطلوب";
    if (!email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    if (!phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (!password.trim()) newErrors.password = "كلمة المرور مطلوبة";
    else if (password.length < 8)
      newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    if (confirmPassword !== password)
      newErrors.confirmPassword = "كلمة المرور غير متطابقة";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    if (!API_URL) {
      setMessage("خطأ: رابط API غير مُعرّف");
      return;
    }

    try {
      setLoading(true);

    
      // await fetch(`${API_URL}/sanctum/csrf-cookie`, {
      //   credentials: "include",
      // });

      // --- قراءة token من الكوكيز ---
      const csrfToken = getCookie("next-auth.csrf-token");
      console.log(csrfToken)


      // --- 2️⃣ إرسال بيانات التسجيل مع X-XSRF-TOKEN ---
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": "eyJpdiI6IjN1K2hSbGdDbXJOZWk0MUFCWWJUREE9PSIsInZhbHVlIjoiNC9RWDh2WnJ6MkdaazNZWThndGh1YTBPUjh2N2pHWTVVd2NNS254NzFRRDUzVGpIcFpBVEZWdkJTV0k5b2kyOStvRmZ6K2orc0xPUm1hNWNnTGR1ME9YeTlkMGFHSUxWR2VDM2xYRWVpcWtSVEdNRXZvanB5OWsxRWp5L1MvQ0giLCJtYWMiOiJlZmY5OWI3OWUyNTkzZWQ3MjU5NTZkYTY2N2MzY2NlM2M0ZGMxMTBjZGVlYjVmMDQxNzEzNjM0ZDYxMzBkZTY3IiwidGFnIjoiIn0%3D",
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          phone,
          password,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await res.json();
      console.log("Register response:", data);

      if (res.ok && data.status !== false) {
        setMessage("تم التسجيل بنجاح ✅");
        login(firstName, email, "", `${firstName} ${lastName}`);
        localStorage.setItem("userName", firstName);
        localStorage.setItem("fullName", `${firstName} ${lastName}`);
        localStorage.setItem("userEmail", email);
        setTimeout(() => router.push("/"), 1500);
      } else {
        setMessage(data.message || "حدث خطأ أثناء التسجيل ❌");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setMessage(err.message || "فشل الاتصال بالخادم ❌");
    } finally {
      setLoading(false);
    }
  };

  // --- UI helpers ---
  const inputClasses = (hasError: boolean) =>
    `peer w-full border rounded-lg px-3 pt-4 pb-4 text-gray-800 placeholder-transparent focus:outline-none transition-all ${
      hasError ? "border-red-500" : "focus:border-orange-500 border-gray-300"
    }`;

  const labelClasses = (hasError: boolean) =>
    `absolute right-3 text-base bg-white px-1 text-gray-500 transition-all duration-200
     pointer-events-none 
     peer-placeholder-shown:top-1/2 mb-2 peer-placeholder-shown:-translate-y-1/2 
     peer-placeholder-shown:text-gray-400
     peer-focus:-top-2 peer-focus:text-sm peer-focus:text-orange-500
     ${hasError ? "text-red-500" : ""}`;

  return (
    <div className="flex flex-col items-center bg-gray-50 px-6 py-10 md:px-[13%] xl:px-[35%]">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800">إنشاء حساب جديد</h1>
        <p className="text-gray-700 font-semibold text-[20px] mt-3">
          انضم إلى آلاف العملاء السعداء
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 my-5 relative">
          {/* الاسم الأول والأخير */}
          <div className="flex items-center gap-3">
            <div className="relative w-full">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClasses(!!errors.firstName)}
                placeholder="الاسم الأول"
              />
              <label className={labelClasses(!!errors.firstName)}>الاسم الأول</label>
              {errors.firstName && (
                <p className="text-red-500 text-sm text-right mt-1">{errors.firstName}</p>
              )}
            </div>

            <div className="relative w-full">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClasses(!!errors.lastName)}
                placeholder="الاسم الأخير"
              />
              <label className={labelClasses(!!errors.lastName)}>الاسم الأخير</label>
              {errors.lastName && (
                <p className="text-red-500 text-sm text-right mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* البريد الإلكتروني */}
          <div className="relative w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses(!!errors.email)}
              placeholder="البريد الإلكتروني"
            />
            <label className={labelClasses(!!errors.email)}>البريد الإلكتروني</label>
            {errors.email && (
              <p className="text-red-500 text-sm text-right mt-1">{errors.email}</p>
            )}
          </div>

          {/* الهاتف */}
          <div className="relative w-full">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClasses(!!errors.phone)}
              placeholder="رقم الهاتف"
            />
            <label className={labelClasses(!!errors.phone)}>رقم الهاتف</label>
            {errors.phone && (
              <p className="text-red-500 text-sm text-right mt-1">{errors.phone}</p>
            )}
          </div>

          {/* كلمة المرور */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses(!!errors.password)}
              placeholder="إنشاء كلمة مرور"
            />
            <label className={labelClasses(!!errors.password)}>إنشاء كلمة مرور</label>
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
            >
              {showPassword ? <BiSolidShow size={25} /> : <BiSolidHide size={25} />}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm text-right mt-1">{errors.password}</p>
            )}
          </div>

          {/* تأكيد كلمة المرور */}
          <div className="relative w-full">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClasses(!!errors.confirmPassword)}
              placeholder="تأكيد كلمة المرور"
            />
            <label className={labelClasses(!!errors.confirmPassword)}>تأكيد كلمة المرور</label>
            <div
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
            >
              {showConfirm ? <BiSolidShow size={25} /> : <BiSolidHide size={25} />}
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm text-right mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-all disabled:opacity-70"
          >
            {loading ? "جاري التسجيل..." : "تسجيل"}
          </button>
        </form>

        {message && (
          <p
            className={`text-center font-semibold mt-3 ${
              message.includes("نجاح") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}