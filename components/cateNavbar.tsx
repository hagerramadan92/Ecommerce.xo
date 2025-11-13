import { useAppContext } from "@/src/context/AppContext";
import Link from "next/link"


export default function CateNavbar() {
 const { homeData } = useAppContext();
const categories = homeData?.categories || [];
  return (
    <>
    <div className="hidden1 justify-between  py-2.5 px-[5%]  xl:px-[18%] shadow">
      {
        categories.slice(0,13).map((cat,index)=>(
          <Link key={index} href={`/category/${cat.slug}`}
           className="text-[1rem] text-pro-hover px-2" aria-label={cat.name}>
            {cat.name}
            </Link>
        ))
      }
    </div>
    </>
  )
}
