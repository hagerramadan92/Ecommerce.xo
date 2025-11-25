import { FaHeart, FaRegHeart } from "react-icons/fa";

import { HiMiniHeart, HiOutlineHeart } from "react-icons/hi2";

interface HearComponentProps {
  liked: boolean;
  onToggleLike: () => void;
  ClassName?:string
  ClassNameP?:string
}

export default function HearComponent({
  liked,
  onToggleLike,
  ClassName,
  ClassNameP
}: HearComponentProps) {
  return (
    <button
    aria-label="heart icon"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleLike();
      }}
      className={`w-9 h-9 ${ClassNameP} rounded-full bg-white/70 duration-75
        flex items-center justify-center  p-0.5 cursor-pointer transition-transform hover:scale-110`}
    >
      {liked ? (
        <HiMiniHeart size={19} className=" text-pro" />
      ) : (
        <HiOutlineHeart size={20} className={`${ClassName}`}/>
      )}
    </button>
  );
}
