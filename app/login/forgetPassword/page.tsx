"use client";
import React, { useState } from "react";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://ecommecekhaled.renix4tech.com/api/v1";

  // ارسال الايميل وطلب كود
  const handleSendCode = async () => {
    if (!email.trim()) {
      setMessage("من فضلك أدخل بريدك الإلكتروني");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      const res = await fetch(`${API_URL}/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("تم إرسال كود التحقق إلى بريدك الإلكتروني");
        setCodeSent(true);
      } else {
        setMessage(data.message || "حدث خطأ أثناء الإرسال");
      }
    } catch (err) {
      console.error(err);
      setMessage("فشل الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  // تأكيد الكود
  const handleConfirmCode = async () => {
    if (code.length !== 6) {
      setMessage("الرجاء إدخال الكود المكون من 6 أرقام");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      const res = await fetch(`${API_URL}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("تم التحقق بنجاح، يمكنك الآن إعادة تعيين كلمة المرور");
      } else {
        setMessage(data.message || "الكود غير صحيح");
      }
    } catch (err) {
      console.error(err);
      setMessage("فشل الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 px-4 py-10 min-h-screen">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          نسيت كلمة المرور
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          أدخل بريدك الإلكتروني لإرسال كود التحقق
        </p>

        {!codeSent ? (
          <div className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSendCode}
              disabled={loading}
              className="bg-blue-950 text-white py-2 rounded-lg hover:bg-blue-900 transition disabled:opacity-70"
            >
              {loading ? "جاري الإرسال..." : "إرسال كود"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-gray-600">
              تم إرسال الكود إلى بريدك الإلكتروني، أدخله هنا:
            </p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="الكود المكون من 6 أرقام"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleConfirmCode}
              disabled={loading}
              className="bg-blue-950 text-white py-2 rounded-lg hover:bg-blue-900 transition disabled:opacity-70"
            >
              {loading ? "جاري التحقق..." : "تأكيد الكود"}
            </button>
          </div>
        )}

        {message && (
          <p
            className={`mt-3 font-semibold ${
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
