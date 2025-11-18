'use client'
import { useAppContext } from "@/src/context/AppContext";
import Image from "next/image";
import Link from "next/link";



export default function CategoriesPage() {
  const {parentCategories} = useAppContext()
  return (
    <section className="px-5 lg:px-[18%] rounded-2xl py-6  ">
      <h1 className="text-2xl font-bold mb-6 text-center text-pro">الأقسام</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-7 gap-4">
        {parentCategories.map((cat,index) => (
          <Link
            key={index}  
            href={`/category/${cat.slug}`}
            className="shadow rounded-xl p-3 flex items-center flex-col justify-center hover:bg-gray-50"
          >
            <Image src={cat.image} alt={cat.name} width={120} height={110}/>
           <p className="text-gray-700 text-sm text-center"> {cat.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
