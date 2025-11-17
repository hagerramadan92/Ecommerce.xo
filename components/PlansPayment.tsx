"use client";

import QuantityCounter from "@/components/QuantityCounter";
import ButtonComponent from "./ButtonComponent";
import ImageComponent from "./ImageComponent";
import { ProductIn } from "@/Types/ProductIn";

interface PlansPaymentProps {
  product: ProductIn; 
}

export default function PlansPayment({product}:PlansPaymentProps) {

  return (
    <div>
      <div className="flex flex-col gap-5 p-5 rounded-xl border border-gray-200 shadow pb-10">
     
        <QuantityCounter product={product} />
      
      </div>
    </div>
  );
}
