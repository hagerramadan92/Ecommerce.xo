"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { auth } from "@/lib/firebaseClient";
import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import Link from "next/link";
import { GoogleAuthProvider } from "firebase/auth";
import LoginWithGoogle from "@/components/loginWithGoogle";

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

    const newErrors: { [key: string]: string } = {};
    if (!firstName.trim()) newErrors.firstName = "الاسم الأول مطلوب";
    if (!lastName.trim()) newErrors.lastName = "الاسم الأخير مطلوب";
    if (!email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }
    if (!phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^\d+$/.test(phone)) {
      newErrors.phone = "رقم الهاتف يجب أن يحتوي على أرقام فقط";
    } else if (phone.length < 11) {
      newErrors.phone = "رقم الهاتف يجب أن يكون 11 رقم";
    } else if (phone.length > 11) {
      newErrors.phone = "رقم الهاتف يجب أن يكون 11 رقم";
    }
    if (!password.trim()) newErrors.password = "كلمة المرور مطلوبة";
    else if (password.length < 8)
      newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";

    if (confirmPassword !== password)
      newErrors.confirmPassword = "كلمة المرور غير متطابقة";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
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
        const token = data.data?.token;
        if (token) {
          localStorage.setItem("auth_token", token);
        }
        setMessage("تم التسجيل بنجاح");
        login(firstName, email, "", `${firstName} ${lastName}`);
        localStorage.setItem("userName", firstName);
        localStorage.setItem("fullName", `${firstName} ${lastName}`);
        localStorage.setItem("userEmail", email);
        setTimeout(() => router.push("/"), 1000);
      } else {
        setMessage(data.message || "حدث خطأ أثناء التسجيل");
        if (data.errors) {
          const apiErrors: { [key: string]: string } = {};
          Object.keys(data.errors).forEach((key) => {
            apiErrors[key] = data.errors[key][0];
          });
          setErrors(apiErrors);
        }
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setMessage("فشل الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };


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
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 my-5  relative"
        >
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
              <label className={labelClasses(!!errors.firstName)}>
                الاسم الأول
              </label>
              {errors.firstName && (
                <p className="text-red-500 text-sm text-right mt-1">
                  {errors.firstName}
                </p>
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
              <label className={labelClasses(!!errors.lastName)}>
                الاسم الأخير
              </label>
              {errors.lastName && (
                <p className="text-red-500 text-sm text-right mt-1">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>
          {/* البريد الإلكتروني */}
          <div className="relative w-full">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses(!!errors.email)}
              placeholder="البريد الإلكتروني"
            />
            <label className={labelClasses(!!errors.email)}>
              البريد الإلكتروني
            </label>
            {errors.email && (
              <p className="text-red-500 text-sm text-right mt-1">
                {errors.email}
              </p>
            )}
          </div>
          {/* الهاتف */}
          <div className="relative w-full">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClasses(!!errors.phone)}
              placeholder="رقم الهاتف"
            />
            <label className={labelClasses(!!errors.phone)}>رقم الهاتف</label>
            {errors.phone && (
              <p className="text-red-500 text-sm text-right mt-1">
                {errors.phone}
              </p>
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
            <label className={labelClasses(!!errors.password)}>
              إنشاء كلمة مرور
            </label>
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
            >
              {showPassword ? (
                <BiSolidShow size={25} />
              ) : (
                <BiSolidHide size={25} />
              )}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm text-right mt-1">
                {errors.password}
              </p>
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
            <label className={labelClasses(!!errors.confirmPassword)}>
              تأكيد كلمة المرور
            </label>
            <div
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
            >
              {showConfirm ? (
                <BiSolidShow size={25} />
              ) : (
                <BiSolidHide size={25} />
              )}
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm text-right mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <button
          aria-label="create account"
            type="submit"
            disabled={loading}
            className="bg-blue-950 cursor-pointer text-white py-3 rounded-lg hover:bg-blue-900 transition-all disabled:opacity-70"
          >
            {loading ? "جاري التسجيل..." : "انشاء حساب"}
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
        <div className="flex items-center justify-center mt-1  mb-9">
          <p>لدي حساب بالفعل ؟</p>
          <Link href="/login">
            <p className=" underline ">تسجيل دخول</p>
          </Link>
        </div>
        <div className="relative border-t border-gray-200 grid grid-cols-1  gap-3 py-2 pt-8">
          <label className="bg-white p-1 absolute top-[-19] left-[30%] text-gray-500">
            أو سجل دخول عن طريق
          </label>
          <LoginWithGoogle />
        </div>
      </div>
    </div>
  );
}
