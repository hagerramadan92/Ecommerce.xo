"use client";
import CategoriesSlider from "@/components/CategoriesC";
import InStockSlider from "@/components/InStockSlider";
import ProductCard from "@/components/ProductCard";
import SliderComponent from "@/components/SliderComponent";
import { fetchApi } from "@/lib/api";
import { useAppContext } from "@/src/context/AppContext";
import { BannerI } from "@/Types/BannerI";
import { useEffect, useState } from "react";
import Loading from "./loading";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { homeData } = useAppContext();
  const categories1 = homeData?.categories || [];
  const categories2 = homeData?.sub_categories || [];
  const [mainSlider, setMainSlider] = useState<BannerI[]>([]);
  const [loading, setLoading] = useState(true);
  // const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  
  useEffect(() => {
    const getSlider1 = async () => {
      try {
        const data = await fetchApi("banners?type=main_slider");
        setMainSlider(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Error fetching Slider1:", error);
        setMainSlider([]);
      } finally {
        setLoading(false);
      }
    };

    getSlider1();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <div className="px-5 lg:px-[18%] rounded-2xl py-6   flex flex-col gap-5 ">
        {mainSlider.length > 0 && (
          <SliderComponent
            src={mainSlider[0].items.map((item) => item.image)}
            href={mainSlider[0].items.map((item) => item.link_url || "/")}
          />
        )}
        <CategoriesSlider categories={categories1} />

        {categories2.map((category) => {
        
          if (!category.products || category.products.length === 0) return null;

          return (
            <div key={category.id} className="mb-10">
              {category.category_banners?.length > 0 && (
                <Image
                  src={category.category_banners[0].image ?? "/images/d4.jpg"}
                  alt={category.name}
                  width={800}
                  height={100}
                  className="w-full h-45 object-cover rounded-md"
                />
              )}

              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-4xl font-bold text-pro text-center py-7">
                  {category.name}
                </h2>

                <div className="text-center mb-5">
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-pro hover:underline"
                  >
                    الكل
                  </Link>
                </div>
              </div>
              <InStockSlider
                inStock={category.products}
                
                CardComponent={(product) => (
                  <ProductCard
                    {...product}
                    className="hidden"
                    className2="hidden"
                    classNameHome="hidden"
                    Bottom="bottom-32"
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={product.image || "/images/c1.png"}
                    stock={product.stock }
                    average_rating={product.average_rating}
                    reviews={product.reviews}
                  />
                )}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
