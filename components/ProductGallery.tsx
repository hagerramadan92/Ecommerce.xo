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
        className="rounded-xl overflow-hidden"
        spaceBetween={10}
      >
        {allImages.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="w-full h-96 relative bg-white rounded-xl overflow-hidden">
              <Image
                src={img.url??
                  "images/c1.jpg"
                }
                alt={img.alt || `Product ${i}`}
                className="object-cover w-full h-full"
                fill
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        watchSlidesProgress
        className="mt-3"
        style={{ height: "70px" }} 
      >
        {allImages.map((img, i) => (
          <SwiperSlide key={i} className="cursor-pointer w-16! h-16!">
            <div className="w-16 h-16 p-1 border border-gray-200 rounded overflow-hidden hover:border-orange-300">
              <Image
                src={img.url??"images/o1.jpg"}
                alt={img.alt || `Thumb ${i}`}
                className="object-cover w-full h-full"
                width={64}
                height={64}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
