"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FreeDeliver from "@/components/FreeDeliver";
import ImageComponent from "@/components/ImageComponent";
import PlansPayment from "@/components/PlansPayment";
import PriceComponent from "@/components/PriceComponent";
import ProductNotFound from "@/components/ProductNotFound";
import { FaTruckFast } from "react-icons/fa6";
import { GoStarFill } from "react-icons/go";
import Loading from "@/app/loading";
import { ProductI } from "@/Types/ProductsI";
import StickerForm from "@/components/StickerForm";

export default function ProductPageClient() {
  const params = useParams();
  const { id } = params;
  const API_URL = "https://ecommecekhaled.renix4tech.com/api/v1";

  const [product, setProduct] = useState<ProductI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data.data ?? null);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <Loading />;
  if (error || !product) return <ProductNotFound />;

  return (
    <>
      <div className="mx-5 lg:mx-[18%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-5">
        <div>
          <div >
            {/* اسم المنتج */}
            <h2 className="text-[#43454c] mb-3 text-xl font-bold">
              {product.name}
            </h2>

            {/* التقييم */}
            <div className="flex gap-3 items-center mb-2">
              <div className="flex gap-1 text-pro-max items-center">
                {[...Array(5)].map((_, i) => (
                  <GoStarFill key={i} className="text-yellow-500" />
                ))}
              </div>
              <p className="text-[#43454c] text-lg">
                {product.average_rating?.toFixed(1) ?? "0"}
              </p>
              <span className="text-[#646464] text-lg">|</span>
              <p className="underline cursor-pointer text-[#43454c] text-lg">
                ({product.reviews?.length ?? 0} تقييمات)
              </p>
            </div>

            {/* Free Delivery */}
            <FreeDeliver />

            {/* السعر والخصم */}
            <div className="flex gap-2 mt-4 items-center">
              <PriceComponent
                final_price={parseFloat(
                  product.final_price?.toString() ?? product.price
                )}
              />
              {product.has_discount &&
                product.price &&
                product.final_price &&
                product.discount && (
                  <>
                    <p className="text-gray-400 line-through text-[1rem] mx-1">
                      {product.price}
                    </p>
                    <div className="font-bold text-[1rem] flex text-[#08b63d] bg-[#d2ecda] rounded py-0.5 px-3">
                      <span className="me-1">%</span>
                      <p>{product.discount.value}</p>
                      <span>-</span>
                    </div>
                  </>
                )}
            </div>

            {/* شامل الضريبة */}
            {product.includes_tax && (
              <p className="text-[#898989] text-[13px] mt-2">
                السعر يشمل ضريبة القيمة المضافة
              </p>
            )}

            {/* وفر */}
            {product.price && product.final_price && (
              <p className="text-green-600 font-semibold text-[12px] mt-1">
                لقد وفرت{" "}
                {(
                  parseFloat(product.price) -
                  parseFloat(product.final_price.toString())
                ).toLocaleString("en-US")}{" "}
                جنيه
              </p>
            )}

            {/* التوصيل */}
            {product.delivery_time && (
              <div className="mt-3 flex gap-1 items-start">
                <FaTruckFast className="h-5 w-8 text-pro mt-1 scale-x-[-1]" />
                <p className="text-gray-600 text-[0.95rem]">
                  {`التوصيل خلال الفترة من ${product.delivery_time.from} - ${product.delivery_time.to}`}
                </p>
              </div>
            )}

            {/* المميزات */}
            {product.features && product.features.length > 0 && (
              <ul className="mt-3 list-disc list-inside text-gray-700">
                {product.features.map((f, i) => (
                  <li key={i}>{f.name}</li>
                ))}
              </ul>
            )}

            {/* خيارات المنتج: ألوان، أحجام، مواد */}
            <div className="mt-3 flex flex-wrap gap-3">
              {product.colors && product.colors.length > 0 && (
                <div className="flex gap-1 items-center">
                  <span className="font-semibold">الألوان:</span>
                  {product.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: c.name }}
                    />
                  ))}
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div className="flex gap-1 items-center">
                  <span className="font-semibold">المقاسات:</span>
                  {product.sizes.map((s, i) => (
                    <span key={i}>{s.value}</span>
                  ))}
                </div>
              )}

              {product.materials && product.materials.length > 0 && (
                <div className="flex gap-1 items-center">
                  <span className="font-semibold">المواد:</span>
                  {product.materials.map((m, i) => (
                    <span key={i}>{m.name}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* صورة المنتج */}

          <StickerForm />
          {/* <PlansPayment product={product} /> */}
        </div>
        <ImageComponent image={product.image || "/images/c1.png"} />
      </div>
    </>
  );
}
