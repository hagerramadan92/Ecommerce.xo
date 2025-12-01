import { BiMessageRoundedEdit } from "react-icons/bi";
import { FiTruck } from "react-icons/fi";
interface SubIconProps {
  className?: string;
   className2?: string;
   className3?: string;
   
}

export default function SubIcon({className ,className2 , className3}:SubIconProps) {
  return (
    <>
    <div className={` ${className}`}>
          <div className="flex items-center gap-2  cursor-pointer text-pro-hover">
            <FiTruck size={25} strokeWidth={1.3} />
            <span className={`${className2}`}> تتبع الطلب</span>
          </div>

         
        </div>
        </>
  )
}
