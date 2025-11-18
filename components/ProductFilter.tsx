import { FiFilter } from "react-icons/fi";
import SelectBoxComponent from "./SelectBoxComponent";


export default function ProductFilter({ brands = [], materials = [], colors = [], categories = [] }) {
  return (
    <>
      <div className="px-4 rounded h-screen">
        
        <div className="flex items-center gap-2">
          <FiFilter size={22} />
          <p className="font-bold text-[1.1rem]">تصفية</p>
        </div>

        {/* متوفر */}
        <div className="border-b border-gray-300 pb-3">
          <SelectBoxComponent title="المتوفر">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 accent-blue-900" />
              <p className="text-gray-700">إخفاء غير المتوفر</p>
            </label>
          </SelectBoxComponent>
        </div>

        {/* الفئات */}
        <div className="border-b border-gray-300 pb-3">
          <SelectBoxComponent title="فئات المنتج">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer select-none my-2">
                <input type="checkbox" className="w-4 h-4 accent-blue-900" />
                <p className="text-gray-700">{cat.name}</p>
              </label>
            ))}
          </SelectBoxComponent>
        </div>

        {/* الماركات */}
        <div className="border-b border-gray-300 pb-3">
          <SelectBoxComponent title="العلامة التجارية">
            {brands.map((b, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer select-none my-2">
                <input type="checkbox" className="w-4 h-4 accent-blue-900" />
                <p className="text-gray-700">{b}</p>
              </label>
            ))}
          </SelectBoxComponent>
        </div>

        {/* الخامات */}
        <div className="border-b border-gray-300 pb-3">
          <SelectBoxComponent title="الخامات المستخدمة">
            {materials.map((m, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer select-none my-2">
                <input type="checkbox" className="w-4 h-4 accent-blue-900" />
                <p className="text-gray-700">{m}</p>
              </label>
            ))}
          </SelectBoxComponent>
        </div>

        {/* الألوان */}
        <div className="border-b border-gray-300 pb-3">
          <SelectBoxComponent title="اللون">
            {colors.map((c, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer select-none my-2">
                <input type="checkbox" className="w-4 h-4 accent-blue-900" />
                <span className="w-5 h-5 rounded-full border border-gray-300" style={{ background: c }}></span>
                <p className="text-gray-700">{c}</p>
              </label>
            ))}
          </SelectBoxComponent>
        </div>

      </div>
    </>
  );
}

