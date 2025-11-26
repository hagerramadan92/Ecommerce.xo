import React from 'react'
import ChangePassword from './ChangePassword'

export default function MangeAccount() {
  return (
    <div className='mt-0'>
      {/* myAccount */}
            <div className="border border-gray-200  rounded-xl p-4 mb-5">
              <h2 className="text-2xl font-semibold text-pro mb-6">حسابي</h2>
              <hr className="bg-gray-50 text-gray-300 mb-5" />
              <form className="grid md:grid-cols-2 gap-6 my-5">
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">الإسم الأول</label>
                  <input
                    type="text"
                    placeholder="أدخل الاسم الأول"
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-pro focus:ring-1 focus:ring-pro"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">الإسم الأخير</label>
                  <input
                    type="text"
                    placeholder="أدخل الاسم الأخير"
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-pro focus:ring-1 focus:ring-pro"
                  />
                </div>
              </form>
            </div>

            {/* privacy */}
            <div className="border border-gray-200  rounded-xl p-4 my-5">
              <h2 className="text-2xl font-semibold text-pro mb-6">الحماية</h2>
              <hr className="bg-gray-50 text-gray-300 mb-5" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    كلمة المرور
                  </h3>
                  <div className="flex items-center justify-between py-2 my-1 bg-gray-100 rounded px-2">
                    <p className="text-gray-500 text-lg p-0.5 rounded ">
                     ********
                    </p>
                    <button aria-label="change password" className="text-pro font-medium hover:underline cursor-pointer">
                      تغيير
                    </button>
                    <ChangePassword/>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    رقم الهاتف
                  </h3>
                  <div className="bg-gray-100 py-2 my-1 rounded">
                    <p className="text-gray-500 text-lg p-0.5 rounded ">
                      +9086868
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* News */}
            <div className="border border-gray-200  rounded-xl p-4 my-5">
              <h2 className="text-2xl font-semibold text-pro my-6">الاخبار</h2>
              <hr className="bg-gray-50 text-gray-300 mb-5" />

              <p className="pb-9">انت لست مشترك في النشرات الاخباريه بعد</p>
            </div>
            {/* delete account */}
            <div className="border border-gray-200  rounded-xl p-4 my-5">
              <h2 className="text-2xl font-semibold text-pro mb-6">
                حذف الحساب
              </h2>
              <hr className="bg-gray-50 text-gray-300 mb-5" />
              <p className="text-gray-400 my-3">نأسف لمغادرتك, انت دائما مرحب بعودتك!</p>
              <button aria-label="delete my account" className="text-red-500 font-medium underline cursor-pointer">
                حذف الحساب
              </button>
            </div>
    </div>
  )
}
