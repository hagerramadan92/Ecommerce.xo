"use client";
import CategoriesSlider from "@/components/CategoriesC";
import Discount from "@/components/Discount";
import InStockSlider from "@/components/InStockSlider";
import ProductCard from "@/components/ProductCard";
import ShowAll from "@/components/ShowAll";
import SliderComponent from "@/components/SliderComponent";
import { fetchApi } from "@/lib/api";
import { useAppContext } from "@/src/context/AppContext";
import { BannerI } from "@/Types/BannerI";
import { sliderLinks } from "@/Types/data";
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
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});

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
  console.log(categories2);

  return (
    <>
      <div className="px-5 lg:px-[18%] rounded-2xl py-6   flex flex-col gap-5">
        {mainSlider.length > 0 && (
          <SliderComponent
            src={mainSlider[0].items.map((item) => item.image)}
            href={sliderLinks}
          />
        )}
        <CategoriesSlider categories={categories1} />

        {/* {categories2.length > 0 && (
          <h2 className="text-xl md:text-4xl font-bold text-pro text-center py-7">
            {categories2[0].name}
          </h2>
        )} */}
        {/* <Image src="images/banner1.jpg" alt="banner" />
            <h2>categoryName</h2>
            <Link href="/">All</Link>
            <ProductCard/> */}

        {/* <div>
          {categories2.length > 0 && categories2[3].products?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 ">
              {categories2[0].products.map((des, index) => (
                <div className="flex" key={des.id || index}>
                  <Discount
                    src={des.image ? des.image : "images/c1.png"}
                    href={des.slug ? `/${des.slug}` : "/"}
                  />
                </div>
              ))}
            </div>
          )}
        </div> */}

        {/* {categories2.length > 0 && (
          <h2 className="text-xl md:text-4xl font-bold text-pro text-center py-7">
            {categories2[2].name}
          </h2>
        )} */}
        {/* 
        <div>
          {categories2.length > 0 && categories2[4].products?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 ">
              {categories2[0].products.map((des, index) => (
                <div className="flex" key={des.id || index}>
                  <Discount
                    src={des.image ? des.image : "images/c1.png"}
                    href={des.slug ? `/${des.slug}` : "/"}
                  />
                </div>
              ))}
            </div>
          )}
        </div> */}

        {/* <ShowAll
          title="جدد مطبخك بأحدث الأجهزة"
          Anchor="مشاهدة المزيد"
          link="/"
        /> */}

        {/* {categories2.length > 0 && categories2[0].products?.length > 0 && (
          <InStockSlider
            inStock={categories2[0].products}
            CardComponent={(props) => (
              <ProductCard {...props} className="flex" className2="hidden"  classNameHome="hidden"/>
            )}
          />
        )} */}

        {/* <SliderComponent src={sliderImages2} href={sliderLinks} /> */}
        {/* <Discount src="/images/d4.jpg" href="/" /> */}
        {/* <ShowAll
          title="اكتشف مجموعتنا من الترابيزات"
          Anchor="مشاهدة المزيد"
          link="/product"
        /> */}
        {categories2.map((category, index) => {
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
                  className="text-blue-500 hover:underline"
                >
                   الكل 
                </Link>
              </div>
              </div>

              <InStockSlider
                inStock={category.products}
                CardComponent={(props) => (
                  <ProductCard
                    {...props}
                    className="hidden"
                    className2="hidden"
                    classNameHome="hidden"
                  />
                )}
              />
            </div>
          );
        })}

        {/* {categories2.length > 0 && (
          <h2 className="text-xl md:text-4xl font-bold text-pro text-center py-7">
            {categories2[3].name}
          </h2>
        )} */}

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ">
          {Desc2.map((des, index) => (
            <div className="flex" key={index}>
              <Discount src={des.img} href={des.href} />
            </div>
          ))}
        </div>
        <ShowAll
          title="وحدة تلفزيون تناسب كل مساحة"
          Anchor="مشاهدة المزيد"
          link="/"
        /> */}
        {/* {categories2.length > 0 && categories2[2].products?.length > 0 && (
          <InStockSlider
            inStock={categories2[0].products}
            CardComponent={(props) => (
              <ProductCard {...props} className="hidden" className2="hidden" classNameHome="hidden" />
            )}
          />
        )} */}

        {/* {categories2.length > 0 && (
          <h2 className="text-xl md:text-4xl font-bold text-pro text-center py-7">
            {categories2[4].name}
          </h2>
        )} */}
        {/* 
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-4">
          {Desc3.map((des, index) => (
            <div className="flex" key={index}>
              <Discount src={des.img} href={des.href} />
            </div>
          ))}
        </div> */}
        {/* <Discount src="/images/d5.jpg" href="/" /> */}
        {/* {categories2.length > 0 && (
          <h2 className="text-xl md:text-4xl font-bold text-pro text-center py-7">
            {categories2[5].name}
          </h2>
        )} */}

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 my-4">
          {Desc4.map((des, index) => (
            <div className="flex" key={index}>
              <Discount src={des.img} href={des.href} />
            </div>
          ))}
        </div> */}

        {/* {categories2.length > 0 && (
          <h2 className="text-xl md:text-4xl font-bold text-pro text-center py-7">
            {categories2[6].name}
          </h2>
        )}

        {categories2.length > 0 && categories2[1].products?.length > 0 && (
          <InStockSlider
            inStock={categories2[0].products}
            CardComponent={(props) => (
              <ProductCard {...props} className="hidden" className2="hidden" classNameHome="hidden"/>
            )}
          />
        )}

        {categories2.length > 0 && (
          <h2 className="text-xl md:text-4xl font-bold text-pro text-center py-7">
            {categories2[6].name}
          </h2>
        )} */}

        {/* <Discount src="/images/d7.jpg" href="/" /> */}
        {/* <ShowAll
          title="اكتشف أفضل أجهزة الجري"
          Anchor="مشاهدة المزيد"
          link="/"
        /> */}
        {/* {categories2.length > 0 && categories2[1].products?.length > 0 && (
          <InStockSlider
            inStock={categories2[0].products}
            CardComponent={(props) => (
              <ProductCard {...props} className="hidden" className2="hidden" classNameHome="hidden" />
            )}
          />
        )} */}
      </div>
    </>
  );
}
