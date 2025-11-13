"use client";
import React, { useState, useEffect } from "react";
import ButtonComponent from "@/components/ButtonComponent";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth } from "@/lib/firebaseClient";
import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext"; // ✅ إضافة

export default function Page() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const API_URL = "https://ecommecekhaled.renix4tech.com/api/v1";

  const { login: loginContext } = useAuth(); // ✅ استخدام Context

  const validateInput = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return "من فضلك أدخل البريد الإلكتروني أو رقم الهاتف";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(trimmed)) return "";

    const phoneRegex = /^(?:\+?20|0)?1[0-9]{9}$/;
    if (phoneRegex.test(trimmed)) return "";

    return "من فضلك أدخل بريد إلكتروني أو رقم هاتف صالح";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});
    setMessage(null);

    const validationError = validateInput(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!password.trim()) {
      setErrors({ password: "كلمة المرور مطلوبة" });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: value,
          password,
        }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok && data.status !== false) {
        const token = data.data?.token;
        if (token) localStorage.setItem("auth_token", token);

        // ✅ تحديث Context بعد تسجيل الدخول
        loginContext(
          data.data.user.name,
          data.data.user.email,
          data.data.user.image,
          data.data.user.name // أو fullName إذا موجود من API
        );

        router.push("/");
      } else {
        setMessage(data.message || "حدث خطأ أثناء تسجيل الدخول");
        if (data.errors) {
          const apiErrors: { [key: string]: string } = {};
          Object.keys(data.errors).forEach((key) => {
            apiErrors[key] = data.errors[key][0];
          });
          setErrors(apiErrors);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("فشل الاتصال بالخادم");
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      localStorage.setItem("userEmail", session.user.email || "");
      localStorage.setItem("userName", session.user.name || "");
      localStorage.setItem("userImage", session.user.image || "");
      router.push("/");
    }
  }, [status, session, router]);

  const signInWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Facebook user:", result.user);
    } catch (err: any) {
      console.error("Facebook sign-in error:", err);
      alert("حدث خطأ أثناء تسجيل الدخول بـ Facebook");
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
    <div className="flex flex-col items-center bg-gray-50 px-4 py-10">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          تسجيل الدخول أو إنشاء حساب جديد
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          أدخل بريدك الإلكتروني أو رقم الهاتف لتسجيل الدخول أو إنشاء حساب
        </p>

        <form className="space-y-6 my-2 mb-1.5" onSubmit={handleSubmit}>
          <div className="relative w-full">
            <input
              id="userInput"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={`peer w-full border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-lg px-3 pt-4 pb-2 text-gray-800 placeholder-transparent focus:outline-none focus:border-blue-500 transition-all`}
              placeholder="أدخل بريدك الإلكتروني أو رقم الهاتف"
            />
            <label
              htmlFor="userInput"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 text-base transition-all duration-200
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:px-1"
            >
              أدخل بريدك الإلكتروني أو رقم الهاتف
            </label>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-right -mt-3">{error}</p>
          )}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: "" }));
              }}
              className={inputClasses(!!errors.password)}
              placeholder=" كلمة مرور"
            />
            <label className={labelClasses(!!errors.password)}>
              كلمة المرور
            </label>
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
            >
              {showPassword ? <BiSolidShow size={25} /> : <BiSolidHide size={25} />}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm text-right">{errors.password}</p>
            )}
          </div>

          <ButtonComponent title="تسجيل الدخول" onClick={handleSubmit} />
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

        <div className="flex items-center justify-between mb-8">
          <Link href="/login/forgetPassword">
            <p className="text-orange-600 hover:text-orange-400">
              هل نسيت كلمة المرور؟
            </p>
          </Link>
          <Link href="/signup">
            <p className="text-blue-900 hover:text-blue-700">ليس لدي حساب؟ </p>
          </Link>
        </div>

        <div className="relative border-t border-gray-200 grid grid-cols-1 lg:grid-cols-2 gap-3 py-2 pt-8">
          <label className="bg-white p-1 absolute top-[-19] left-[27%] text-gray-500">
            أو سجل دخول عن طريق
          </label>
          <button onClick={signInWithFacebook}>
            <div className="h-fit p-2 flex items-center justify-center gap-2 rounded-full border border-gray-200 hover:shadow transition duration-100 cursor-pointer">
              <p>فيس بوك</p>
              <Image src="./images/f.avif" alt="facebook" width={22} height={22} />
            </div>
          </button>
          <button
            onClick={async () => {
              try {
                const response = await signIn("google", {
                  prompt: "select_account",
                  redirect: false,
                });
                console.log("Google SignIn response:", response);
              } catch (error) {
                console.error("Error during Google SignIn:", error);
              }
            }}
          >
            <div className="h-fit p-2 flex items-center justify-center gap-2 rounded-full border border-gray-200 hover:shadow transition duration-100 cursor-pointer">
              <p>جوجل</p>
              <Image src="./images/g.png" alt="Google" width={28} height={28} style={{ height: "auto" }} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
