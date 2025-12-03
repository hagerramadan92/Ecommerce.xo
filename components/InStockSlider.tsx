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
  title?: string;
}

export default function InStockSlider({
  inStock,
  CardComponent,
  title = "",
}: InStockSliderProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <div className="relative w-full py-0">
      <div className="flex items-center justify-between mb-6 px-4 md:px-0">
        <h2 className="text-xl md:text-2xl font-bold text-pro">{title}</h2>

        <div className="flex items-center gap-3">
          <button
            ref={prevRef}
            className="flex items-center cursor-pointer justify-center w-8 h-8 rounded border border-gray-300 hover:border-orange-500 text-gray-500 hover:bg-pro hover:text-orange-500 transition-all duration-200"
            aria-label="السابق"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 scale-[-1]"
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
          </button>

          <button
            ref={nextRef}
            className="flex items-center cursor-pointer justify-center w-8 h-8 rounded border border-gray-300 hover:border-orange-500 text-gray-500 hover:bg-pro hover:text-orange-500 transition-all duration-200"
            aria-label="التالي"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 scale-[-1]"
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
          </button>
        </div>
      </div>

      {/* السلايدر */}
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={2}
        slidesPerGroup={2}
        breakpoints={{
          640: { slidesPerView: 2, slidesPerGroup: 2 },
          768: { slidesPerView: 3, slidesPerGroup: 3 },
          1024: { slidesPerView: 4, slidesPerGroup: 4 },
          1280: { slidesPerView: 5, slidesPerGroup: 5 },
        }}
        className="px-4 md:px-0"
      >
        {inStock.map((product) => (
          <SwiperSlide key={product.id}>
            <CardComponent
              id={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
              stock={product.stock}
              final_price={product.final_price}
              discount={product.discount}
              average_rating={product.average_rating}
              reviews={product.reviews}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
