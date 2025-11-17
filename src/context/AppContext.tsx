"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { fetchHomeData } from "@/lib/api";
import { fetchApi } from "@/lib/api";

import {  CategoryI } from "@/Types/CategoriesI";
import { ProductI } from "@/Types/ProductsI";
import { SubCategoriesI } from "@/Types/SubCategoriesI";


interface HomeData {
  categories: CategoryI[];
  products: ProductI[];
  sub_categories: SubCategoriesI[];
}


interface AppContextType {
  homeData: HomeData | null;
  parentCategories: CategoryI[];
  childCategories: CategoryI[];
  loading: boolean;
  error: string | null;
}


const AppContext = createContext<AppContextType>({
  homeData: null,
  parentCategories: [],
  childCategories: [],
  loading: true,
  error: null,
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [parentCategories, setParentCategories] = useState<CategoryI[]>([]);
  const [childCategories, setChildCategories] = useState<CategoryI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);

        // 1) بيانات الـ HOME
        const home = await fetchHomeData();
        setHomeData(home);

        // 2) Categories Parent
        const parents = await fetchApi("categories?type=parent");
        setParentCategories(Array.isArray(parents) ? parents : []);

        // 3) Categories Child
        const children = await fetchApi("categories?type=child");
        setChildCategories(Array.isArray(children) ? children : []);

      } catch (err: any) {
        setError(err.message || "فشل تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        homeData,
        parentCategories,
        childCategories,
        loading,
        error,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
