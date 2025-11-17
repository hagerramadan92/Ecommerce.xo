"use client";

import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ProductI } from "@/Types/ProductsI";


interface InStockSliderProps {
  inStock: ProductI[];
   CardComponent: React.ComponentType<ProductI>;
}

export default function InStockSlider({ inStock , CardComponent }: InStockSliderProps) {
  const prevRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.destroy();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <div className="relative w-full py-6 md:px-7">
      <div
        ref={prevRef}
        className="hidden absolute left-0 top-1/2 -translate-y-1/2 bg-pro-hover hover:text-white bg-gray-100 text-black  rounded-full w-10 h-10 md:flex items-center justify-center cursor-pointer z-20"
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
        className="hidden absolute right-0 top-1/2 -translate-y-1/2 bg-pro-hover hover:text-white bg-gray-100 text-black  rounded-full w-10 h-10 md:flex items-center justify-center cursor-pointer z-20"
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

    
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Navigation]}
        spaceBetween={7}
        slidesPerGroup={4}
        breakpoints={{
          0: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1280: { slidesPerView: 5 },
        }}
        className="max-w-[95%] mx-auto" 
      >
        {inStock.map((des, index) => (
          <SwiperSlide key={index}>
             <CardComponent id={des.id} 
             image={des.image} name={des.name} price={des.price} stock={des.stock}  final_price={des.final_price}  discount={des.discount}/>
          </SwiperSlide>
        ))}
      </Swiper>  
    </div>
  );
}
