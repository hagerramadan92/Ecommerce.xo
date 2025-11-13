"use client";
import CategoriesSlider from "@/components/CategoriesC";
import Discount from "@/components/Discount";
import InStockSlider from "@/components/InStockSlider";
import ProductCard from "@/components/ProductCard";
import ShowAll from "@/components/ShowAll";
import SliderComponent from "@/components/SliderComponent";
import { useAppContext } from "@/src/context/AppContext";
import {
  inStock,
  pro,
  sliderImages,
  sliderLinks,
  Ess,
  Desc,
  sliderImages2,
  inStock2,
  Desc2,
  inStock3,
  Desc3,
  Desc4,
  inStock4,
  inStock5,
} from "@/Types/data";

export default function Home() {
  const { homeData } = useAppContext();
  const categories1 = homeData?.categories || [];
  return (
    <>
      <div className="px-5 lg:px-[18%] rounded-2xl py-6   flex flex-col gap-5">
        <SliderComponent src={sliderImages} href={sliderLinks} />
        <Discount src="/images/discount.jpg" href="/" />
        <CategoriesSlider categories={categories1} />
        <Discount src="/images/d3.jpg" href="/" />
        <Discount src="/images/d2.jpg" href="/" />
        <h2 className="text-xl md:text-4xl font-bold text-pro text-center py-7">
          غرفة سفرة و مطبخ
        </h2>
        <Discount src="/images/k1.jpg" href="/" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ">
          {Desc.map((des, index) => (
            <div className="flex" key={index}>
              <Discount src={des.img} href={des.href} />
            </div>
          ))}
        </div>
        <h2 className="text-xl md:text-4xl font-bold text-pro text-center py-7">
          أساسيات غرفة السفرة
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-5">
          {Ess.map((des, index) => (
            <div className="flex" key={index}>
              <Discount src={des.img} href={des.href} />
            </div>
          ))}
        </div>
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10">
          {Ess.map((des, index) => (
            <div className="flex" key={index}>
              <Discount src={des.img} href={des.href} />
            </div>
          ))}
        </div>
        <h2 className="text-xl md:text-4xl font-bold text-pro text-center py-7">
          أجهزة هتسهل عليك حياتك
        </h2>
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ">
          {pro.map((des, index) => (
            <div className="flex" key={index}>
              <Discount src={des.img} href={des.href} />
            </div>
          ))}
        </div>
        <ShowAll
          title="جدد مطبخك بأحدث الأجهزة"
          Anchor="مشاهدة المزيد"
          link="/"
        />

        <InStockSlider
          inStock={inStock}
          CardComponent={(props) => <ProductCard {...props} className="flex" className2="hidden" />}
        />
        <SliderComponent src={sliderImages2} href={sliderLinks} />
        <Discount src="/images/d4.jpg" href="/" />
        <ShowAll
          title="اكتشف مجموعتنا من الترابيزات"
          Anchor="مشاهدة المزيد"
          link="/"
        />
        <InStockSlider
          inStock={inStock2}
          CardComponent={(props) => (
            <ProductCard {...props} className="hidden" className2="hidden"  />
          )}
        />
        <h2 className="text-xl md:text-4xl font-bold text-pro text-center py-7">
          جدّد قعدة بيتك دلوقتي
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ">
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
        />
        <InStockSlider
          inStock={inStock3}
          CardComponent={(props) => (
            <ProductCard {...props} className="hidden" className2="hidden"  />
          )}
        />
        <h2 className="text-xl md:text-4xl font-bold text-pro text-center py-7">
          كل التفاصيل اللي أوضة نومك محتاجها
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-4">
          {Desc3.map((des, index) => (
            <div className="flex" key={index}>
              <Discount src={des.img} href={des.href} />
            </div>
          ))}
        </div>
        <Discount src="/images/d5.jpg" href="/" />
        <h2 className="text-xl md:text-4xl font-bold text-pro text-center py-7 mt-2">
          أكتشف أساس المكتب المثالي
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 my-4">
          {Desc4.map((des, index) => (
            <div className="flex" key={index}>
              <Discount src={des.img} href={des.href} />
            </div>
          ))}
        </div>
        <h2 className="text-xl md:text-4xl font-bold text-pro text-center py-7 mt-2">
          أكتشف أساس المكتب للأطفال
        </h2>
        <InStockSlider
          inStock={inStock4}
          CardComponent={(props) => (
            <ProductCard {...props} className="hidden" className2="hidden"  />
          )}
        />

        <h2 className="text-xl md:text-4xl font-bold text-pro text-center py-7 mt-2">
          أكتشف معدات الرياضة دلوقتي
        </h2>
        <Discount src="/images/d7.jpg" href="/" />
        <ShowAll
          title="اكتشف أفضل أجهزة الجري"
          Anchor="مشاهدة المزيد"
          link="/"
        />
        <InStockSlider
          inStock={inStock5}
          CardComponent={(props) => <ProductCard {...props} className="flex" className2="hidden" />}
        />
      
      </div>

      
     
   
    </>
  );
}
