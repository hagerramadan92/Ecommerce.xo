"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

// نوع الـ payload اللي بيتبعت للـ API
interface AddToCartPayload {
  product_id: number;
  quantity?: number;
  size_id?: number | null;
  color_id?: number | null;
  printing_method_id?: number | null;
  print_locations?: number[];
  embroider_locations?: number[];
  selected_options?: { option_name: string; option_value: string }[];
  design_service_id?: number | null;
  is_sample?: boolean;
  note?: string;
  image_design?: string | null;
}

// نوع عنصر السلة
interface CartItem {
  cart_item_id: number;
  product: any;
  quantity: number;
  price_per_unit: string;
  line_total: string;
  size?: string;
  color?: { name: string; hex: string };
  printing_method?: string;
  print_locations?: number[];
  embroider_locations?: number[];
  selected_options?: any[];
  design_service?: string;
  is_sample?: boolean;
}

// نوع الـ Context
interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  total: number;
  loading: boolean;

  
  addToCart: (
    productId: number,
    options?: Partial<Omit<AddToCartPayload, "product_id">>
  ) => Promise<boolean>;

  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { authToken: token } = useAuth();
  const isAuthenticated = !!token;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCart = async () => {
    if (!token) {
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (res.ok && data.status && data.data?.items) {
        const items = data.data.items.map((item: any) => ({
          cart_item_id: item.id,
          product: item.product,
          quantity: item.quantity,
          price_per_unit: item.price_per_unit,
          line_total: item.line_total,
          size: item.size,
          color: item.color,
          printing_method: item.printing_method,
          print_locations: item.print_locations ? JSON.parse(item.print_locations) : [],
          embroider_locations: item.embroider_locations ? JSON.parse(item.embroider_locations) : [],
          selected_options: item.selected_options ? JSON.parse(item.selected_options) : [],
          design_service: item.design_service,
          is_sample: item.is_sample === 1,
        }));
        setCart(items);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      toast.error("فشل تحميل السلة");
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = async () => {
    await fetchCart();
  };


  const addToCart = async (
    productId: number,
    options: Partial<Omit<AddToCartPayload, "product_id">> = {}
  ): Promise<boolean> => {
    if (!token) {
      toast.error("يجب تسجيل الدخول أولاً");
      return false;
    }

    if (!productId || productId <= 0) {
      toast.error("معرف المنتج غير صحيح");
      return false;
    }

    const payload: AddToCartPayload = {
      product_id: productId,
      quantity: 1,
      size_id: null,
      color_id: null,
      printing_method_id: null,
      print_locations: [],
      embroider_locations: [],
      selected_options: [],
      design_service_id: null,
      is_sample: false,
      note: "",
      image_design: null,
      ...options,
    };

    try {
      const res = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.status) {
        toast.success("تمت الإضافة إلى السلة بنجاح");
        await refreshCart();
        return true;
      } else {
        toast.error(data.message || "فشل إضافة المنتج");
        return false;
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("خطأ في الاتصال، حاول مرة أخرى");
      return false;
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    if (!token) return;
    try {
      await fetch(`${API_URL}/cart/items/${cartItemId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      toast.success("تم الحذف من السلة");
      await refreshCart();
    } catch (err) {
      toast.error("فشل الحذف");
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!token || quantity < 1) return;
    try {
      await fetch(`${API_URL}/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cart_item_id: cartItemId, quantity }),
      });
      await refreshCart();
    } catch (err) {
      toast.error("فشل تحديث الكمية");
    }
  };

  const clearCart = async () => {
    if (!token || cart.length === 0) return;
    try {
      await fetch(`${API_URL}/cart/clear`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      toast.success("تم تفريغ السلة");
      setCart([]);
    } catch (err) {
      toast.error("فشل تفريغ السلة");
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.line_total || "0"), 0);
  const total = subtotal;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        total,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};