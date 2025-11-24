"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Image from "next/image";
import { ImagesI } from "@/Types/ProductsI";

interface GalleryProps {
  mainImage: string;
  images: ImagesI[];
}

export default function ProductGallery({ mainImage, images }: GalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const allImages = [{ url: mainImage, alt: "Main Product" }, ...images];

  return (
    <div className="w-full">
      {/* Main Slider */}
      <Swiper
        modules={[Navigation, Thumbs]}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        className="overflow-hidden"
        spaceBetween={10}
      >
        {allImages.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="w-full h-132 relative bg-white  overflow-hidden">
              <Image
                src={img.url??
                  "images/c1.jpg"
                }
                alt={img.alt || `Product ${i}`}
                className="object-cover w-full h-full"
                width={120}
                height={120}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={70}
        slidesPerView={4}
        watchSlidesProgress
        className="mt-3"
        style={{ height: "120px"  }} 
      >
        {allImages.map((img, i) => (
          <SwiperSlide key={i} className="cursor-pointer w-16! h-16!">
            <div className="w-30 h-20 flex gap-6 p-1 border border-gray-200 rounded overflow-hidden hover:border-orange-500">
              <Image
                src={img.url??"images/o1.jpg"}
                alt={img.alt || `Thumb ${i}`}
                className="object-cover w-[110px] h-20 hover:opacity-75 duration-100 transition"
                width={110}
                height={80}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
