import { FaHeart, FaRegHeart } from "react-icons/fa";
import { TfiHeart } from "react-icons/tfi";

interface HearComponentProps {
  liked: boolean;
  onToggleLike: () => void;
}

export default function HearComponent({ liked, onToggleLike }: HearComponentProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleLike();
      }}
      className="w-8 h-8  border border-gray-300 rounded-full bg-white/70 duration-75  flex items-center justify-center  p-0.5 cursor-pointer transition-transform hover:scale-110"
    >
      {liked ? (
           <FaHeart size={17} className="text-pro" />
      ) : (
        <TfiHeart size={17} className=" text-gray-500" />
      )}
    </button>
  );
}
