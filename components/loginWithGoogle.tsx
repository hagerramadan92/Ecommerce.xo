"use client";

import { auth, googleProvider, facebookProvider } from "@/lib/firebaseClient";
import { signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

export default function LoginWithGoogle() {
  const API_URL = "https://ecommecekhaled.renix4tech.com/api/v1";
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const sendUserDataToBackend = async (user: any, provider: string) => {
    const payload = {
      provider,
      provider_id: user.uid,
      email: user.email,
      name: user.displayName,
    };

    try {
      const res = await fetch(`${API_URL}/auth/social-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          toast.error("الحساب مرتبط بحساب اجتماعي آخر");
          return;
        }
        toast.error(data.message || "حدث خطأ غير متوقع");
        return;
      }

      toast.success("تم تسجيل الدخول بنجاح!");
      router.push("/"); // التوجّه للصفحة الرئيسية
    } catch (err: any) {
      console.error("Error sending data to backend:", err);
      toast.error("حدث خطأ أثناء التواصل مع الخادم");
    }
  };

  const handleSocialSignIn = async (providerType: "google" | "facebook") => {
    setLoading(true);
    try {
      const provider =
        providerType === "google" ? googleProvider : facebookProvider;
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await sendUserDataToBackend(user, providerType);
    } catch (error: any) {
      console.error(`${providerType} login error:`, error);
      toast.error(
        `فشل تسجيل الدخول بـ${providerType === "google" ? "جوجل" : "الفيسبوك"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button aria-label="log in with google" onClick={() => handleSocialSignIn("google")} disabled={loading}>
        <div
          className={`h-fit p-2 flex items-center justify-center gap-2 rounded-full border border-gray-200 hover:shadow transition duration-100 cursor-pointer ${
            loading ? "opacity-50" : ""
          }`}
        >
          {loading ? (
            <p>جاري تسجيل الدخول...</p>
          ) : (
            <>
              <p>جوجل</p>
              <Image
                src="./images/g.png"
                alt="Google"
                width={28}
                height={28}
                style={{ height: "auto" }}
              />
            </>
          )}
        </div>
      </button>
    </>
  );
}
