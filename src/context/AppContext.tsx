"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchHomeData } from "@/lib/api"; // استدعاء الدالة من lib/api
import { CategoriesI } from "@/Types/CategoriesI";
import { ProductsI } from "@/Types/ProductsI";



interface HomeData {
  categories: CategoriesI[];
  products: ProductsI[];
}

interface AppContextType {
  homeData: HomeData | null;
  loading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType>({
  homeData: null,
  loading: true,
  error: null,
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const data = await fetchHomeData(); // استخدام الدالة من lib/api
        setHomeData(data);
      } catch (err: any) {
        setError(err.message || "فشل تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <AppContext.Provider value={{ homeData, loading, error }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
