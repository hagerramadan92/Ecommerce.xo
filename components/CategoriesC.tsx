"use client";

import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import { CategoriesI } from "@/Types/CategoriesI";



interface CategoriesSliderProps {
  categories: CategoriesI[];
}

export default function CategoriesSlider({
  categories,
}: CategoriesSliderProps) {
  const prevRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (swiperRef.current && prevRef.current && nextRef.current) {
        swiperRef.current.params.navigation.prevEl = prevRef.current;
        swiperRef.current.params.navigation.nextEl = nextRef.current;
        swiperRef.current.navigation.destroy();
        swiperRef.current.navigation.init();
        swiperRef.current.navigation.update();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full py-6 lg:px-10">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Navigation]}
        spaceBetween={7}
        breakpoints={{
          0: { slidesPerView: 4 },
          640: { slidesPerView: 5 },
          992: { slidesPerView: 6 },
          1424: { slidesPerView: 10 },
        }}
      >
        {categories.map((cat, index) => (
          <SwiperSlide key={index}>
            <Link href={`/category/${cat.slug}`} aria-label={`Go to ${cat.name}`}>
              <div className="flex flex-col items-center gap-1 group">
                <div className="relative w-14 h-14 md:w-[90px] md:h-[90px] bg-[#f0f4f7] rounded-full overflow-hidden transition-all duration-300">
                  <Image
                    src="/images/cat1.png"
                    alt={cat.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h2 className="text-[14px] mt-2 font-semibold text-pro capitalize text-center group-hover:text-pro-hover transition-colors">
                  {cat.name}
                </h2>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

   
      <div
        ref={prevRef}
        className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 bg-pro-hover hover:text-white bg-gray-100 text-black rounded-full w-10 h-10 items-center justify-center cursor-pointer transition hidden lg:flex"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </div>

      <div
        ref={nextRef}
        className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 bg-pro-hover hover:text-white bg-gray-100 text-black rounded-full w-10 h-10 items-center justify-center cursor-pointer transition hidden lg:flex"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}
