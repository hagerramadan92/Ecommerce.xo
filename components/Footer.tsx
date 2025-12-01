"use client";
import { useAppContext } from "@/src/context/AppContext";
import Link from "next/link";
import {
  FaPhone,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
export default function Footer() {
  const socialIcons = {
  phone: FaPhone,
  whatsapp: FaWhatsapp,
  facebook: FaFacebook,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
};
  const Links = [
    {
      title: "معلومات عنا",
      href: "/about",
    },
    {
      title: "الشروط و الاحكام",
      href: "/terms",
    },
    {
      title: "سياسة الأسترجاع",
      href: "/returnsPolicy",
    },
    {
      title: "سياسة الخصوصية",
      href: "/policy",
    },
    {
      title: "الضمان",
      href: "/warranty",
    },
    {
      title: "أنضم كشريك",
      href: "/partner",
    },
    {
      title: " الفريق",
      href: "/team",
    },
    {
      title: "اتصل بنا",
      href: "/contactUs",
    },
   
  ];
 
  const { socialMedia } = useAppContext();

  const social_Media = socialMedia;

  return (
    <>
      <div className="text-white bg-pro px-5 lg:px-[18%] pb-20 pt-10 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ">
          <div>
            <h4 className="font-semibold  mt-5 lg:mt-0">الشركة</h4>
            <div className="flex flex-col gap-3 mt-4">
              {Links.map((link, index) => (
                <Link key={index} href={link.href}>
                  {link.title}
                </Link>
              )).slice(0, 3)}
            </div>
          </div>
          <div>
            <h4 className="font-semibold  mt-5 lg:mt-0">روابط مهمة</h4>
            <div className="flex flex-col gap-3 mt-4">
              {Links.map((link, index) => (
                <Link key={index} href={link.href}>
                  {link.title}
                </Link>
              )).slice(3, 7)}
            </div>
          </div>
          <div>
            <h4 className="font-semibold  mt-5 lg:mt-0">تريد مساعده؟</h4>
            <div className="flex flex-col gap-3 mt-4">
              {Links.map((link, index) => (
                <Link key={index} href={link.href}>
                  {link.title}
                </Link>
              )).slice(7)}

              {social_Media.map((social, index) => (
                <div key={index}>
                  {social.key === "email" && <p>{social.value}</p>}
                  {social.key === "phone" && <p>رقم الدعم: {social.value}</p>}
                </div>
              ))}
            </div>
          </div>
          <div>

            <h4 className="font-semibold mt-5 lg:mt-0">العنوان</h4>
            <div className="flex flex-col gap-3 mt-4">
             
                <div className="">
                    {social_Media.map((social, index) => (
                <div key={index}>
                  {social.key === "address" && <p>{social.value}</p>}
                
                </div>
              ))}
                </div>
            
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 ">
          <div>
            <p>نحن نقبل</p>
          </div>
          <div>
            <p className="mb-1">تابعنا</p>
            <div className="flex gap-2 items-center">
           {social_Media.slice(1, 5).map((social, index) => {
        const Icon = socialIcons[social.key as keyof typeof socialIcons]; // نجيب المكون المناسب
        if (!Icon) return null; // لو مفيش أيقونة متاحة
        return (
          <Link key={index} href={social.value || "#"} target="_blank">
            <Icon size={20} />
          </Link>
        );
      })}
            </div>
          </div>
        </div>
        <p className="text-center mt-15">Ⓒ جميع الحقوق محفوظة 2025</p>
      </div>
    </>
  );
}
