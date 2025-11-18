import { ReviewsI } from "@/Types/ReviewsI";
import { IoIosStar } from "react-icons/io";
import { IoStarHalfSharp } from "react-icons/io5";
import { MdOutlineStarOutline } from "react-icons/md";

export default function RatingStars({ average_ratingc , reviewsc}: { average_ratingc: number , reviewsc:ReviewsI[]}) {
  const fullStars = Math.floor(average_ratingc);    
  const hasHalfStar = average_ratingc % 1 >= 0.5;   
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); 

  return (
    <div className="flex gap-0.5 items-center mt-2">
      <p className="text-[13px] text-gray-900 font-semibold">{average_ratingc}</p>

      <div className="text-yellow-500 flex text-[1.2rem]">
   
        {Array.from({ length: fullStars }).map((_, i) => (
          <IoIosStar key={`full-${i}`} />
        ))}

        {hasHalfStar && <IoStarHalfSharp className="scale-x-[-1]" />}

        {Array.from({ length: emptyStars }).map((_, i) => (
          <MdOutlineStarOutline key={`empty-${i}`} />
        ))}
      </div>

      <p className="text-[13px] text-gray-400 font-semibold">({reviewsc.length})</p>
    </div>
  );
}
