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
  size_id?: number;
  color_id?: number;
  printing_method_id?: number;
  design_service_id?: number;
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
  updateCartItem: (cartItemId: number, updates: any) => Promise<boolean>;
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

  // تحديث محلي فوري + API في الخلفية
  const updateLocalQuantity = (cartItemId: number, quantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.cart_item_id === cartItemId 
          ? { 
              ...item, 
              quantity, 
              line_total: (parseFloat(item.price_per_unit || "0") * quantity).toFixed(4) 
            }
          : item
      )
    );
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
    
    // تحديث محلي فوري
    setCart(prevCart => prevCart.filter(item => item.cart_item_id !== cartItemId));
    
    try {
      await fetch(`${API_URL}/cart/items/${cartItemId}`, { 
        method: "DELETE", 
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        } 
      });
      toast.success("تم الحذف من السلة");
      // لا نحتاج لـ refreshCart هنا لأننا حدّثنا محلياً
    } catch (err) {
      // في حالة الخطأ، نعيد تحميل السلة لاستعادة الحالة الصحيحة
      await refreshCart();
      toast.error("فشل الحذف");
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!token || quantity < 1) return;
    
    if (quantity > 10) {
      toast.error("الحد الأقصى 10 قطع فقط لهذا المنتج", {
        duration: 4000,
      });
      return;
    }
    
    // تحديث محلي فوري
    updateLocalQuantity(cartItemId, quantity);
    
    try {
      const response = await fetch(`${API_URL}/cart/items/${cartItemId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        // في حالة الخطأ، نعيد تحميل السلة لاستعادة الحالة الصحيحة
        await refreshCart();
        toast.error("فشل تحديث الكمية");
      } else {
        toast.success(`تم تحديث الكمية إلى ${quantity}`);
      }
    } catch (err) {
      // في حالة الخطأ، نعيد تحميل السلة لاستعادة الحالة الصحيحة
      await refreshCart();
      toast.error("فشل تحديث الكمية");
    }
  };

  const updateCartItem = async (cartItemId: number, updates: any): Promise<boolean> => {
    if (!token) return false;
    
    try {
      const response = await fetch(`${API_URL}/cart/items/${cartItemId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        // تحديث محلي للبيانات الجديدة من الرد
        if (data.data && data.data.item) {
          setCart(prevCart => 
            prevCart.map(item => 
              item.cart_item_id === cartItemId 
                ? {
                    ...item,
                    quantity: data.data.item.quantity,
                    price_per_unit: data.data.item.price_per_unit,
                    line_total: data.data.item.line_total,
                    size: data.data.item.size,
                    color: data.data.item.color,
                    printing_method: data.data.item.printing_method,
                    print_locations: data.data.item.print_locations ? JSON.parse(data.data.item.print_locations) : [],
                    embroider_locations: data.data.item.embroider_locations ? JSON.parse(data.data.item.embroider_locations) : [],
                    selected_options: data.data.item.selected_options ? JSON.parse(data.data.item.selected_options) : [],
                    design_service: data.data.item.design_service,
                    is_sample: data.data.item.is_sample === 1,
                  }
                : item
            )
          );
        }
        toast.success("تم تحديث العنصر بنجاح");
        return true;
      } else {
        await refreshCart(); // إعادة تحميل في حالة الخطأ
        toast.error(data.message || "فشل تحديث العنصر");
        return false;
      }
    } catch (err) {
      console.error("Update cart item error:", err);
      await refreshCart(); // إعادة تحميل في حالة الخطأ
      toast.error("خطأ في الاتصال، حاول مرة أخرى");
      return false;
    }
  };

  const clearCart = async () => {
    if (!token || cart.length === 0) return;
    
    // تحديث محلي فوري
    setCart([]);
    
    try {
      await fetch(`${API_URL}/cart/clear`, { 
        method: "DELETE", 
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        } 
      });
      toast.success("تم تفريغ السلة");
    } catch (err) {
      // في حالة الخطأ، نعيد تحميل السلة لاستعادة الحالة الصحيحة
      await refreshCart();
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
        updateCartItem,
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