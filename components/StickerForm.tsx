"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { useCart } from "@/src/context/CartContext";

interface StickerFormProps {
  cartItemId?: number;
  productId: number;
}

export default function StickerForm({ cartItemId, productId }: StickerFormProps) {
  const { updateCartItem, cart } = useCart();
  
  // --- form values ---
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [designService, setDesignService] = useState("");
  const [protectionLayer, setProtectionLayer] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [executionTime, setExecutionTime] = useState("");
  const [samplePhoto, setSamplePhoto] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // --- API dynamic data ---
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${baseUrl}/products/${productId}`);
        const data = await res.json();
        setApiData(data.data);
        console.log("Product Data:", data.data);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  // دالة محسنة لتحديث السلة مع debouncing
  const handleUpdateCart = useCallback(async () => {
    if (!cartItemId) {
      console.log("No cartItemId provided");
      return;
    }

    const updates: any = {};

    // تحديث المقاس
    if (size) {
      const sizeId = getSizeId(size);
      updates.size_id = sizeId;
      console.log("Updating size:", size, "ID:", sizeId);
    }
    
    // تحديث اللون
    if (color) {
      const colorId = getColorId(color);
      updates.color_id = colorId;
      console.log("Updating color:", color, "ID:", colorId);
    }
    
    // تحديث الخامة
    if (material) {
      const materialId = getMaterialId(material);
      updates.material_id = materialId;
      console.log("Updating material:", material, "ID:", materialId);
    }
    
    // تحديث خدمة التصميم
    if (designService) {
      const designServiceId = getDesignServiceId(designService);
      updates.design_service_id = designServiceId;
      console.log("Updating design service:", designService, "ID:", designServiceId);
    }
    
    // تحديث طبقة الحماية
    if (protectionLayer) {
      const protectionLayerId = getProtectionLayerId(protectionLayer);
      updates.protection_layer_id = protectionLayerId;
      console.log("Updating protection layer:", protectionLayer, "ID:", protectionLayerId);
    }
    
    // إضافة الخيارات المحددة
    const selectedOptions = [];
    if (deliveryMethod) selectedOptions.push({ option_name: "شكل الاستلام", option_value: deliveryMethod });
    if (executionTime) selectedOptions.push({ option_name: "مدة التنفيذ", option_value: executionTime });
    if (samplePhoto) selectedOptions.push({ option_name: "تصوير عينة", option_value: samplePhoto });

    // إضافة الخصائص المحددة
    if (selectedFeatures.length > 0) {
      selectedFeatures.forEach(feature => {
        selectedOptions.push({ option_name: "خاصية", option_value: feature });
      });
    }

    if (selectedOptions.length > 0) {
      updates.selected_options = selectedOptions;
      console.log("Selected options:", selectedOptions);
    }

    if (Object.keys(updates).length > 0) {
      console.log("Sending updates to API:", updates);
      const success = await updateCartItem(cartItemId, updates);
      if (success) {
        console.log("Cart item updated successfully");
      } else {
        console.log("Failed to update cart item");
      }
    }
  }, [
    size, color, material, designService, protectionLayer, 
    deliveryMethod, executionTime, samplePhoto, selectedFeatures, 
    cartItemId, updateCartItem
  ]);

  // استخدام useEffect مع debouncing محسن
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (cartItemId && (
        size || color || material || designService || protectionLayer || 
        deliveryMethod || executionTime || samplePhoto || selectedFeatures.length > 0
      )) {
        console.log("Triggering cart update...");
        handleUpdateCart();
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [
    size, color, material, designService, protectionLayer, 
    deliveryMethod, executionTime, samplePhoto, selectedFeatures, 
    handleUpdateCart, cartItemId
  ]);

  // معالج تغيير القيم
  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    console.log("Form value changed:", value);
    setter(value);
  };

  // معالج تغيير الخصائص
  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  // دوال مساعدة للحصول على الـ IDs
  const getSizeId = (sizeName: string) => {
    const sizeObj = apiData?.sizes?.find((s: any) => s.name === sizeName);
    return sizeObj?.id || 1;
  };

  const getColorId = (colorName: string) => {
    const colorObj = apiData?.colors?.find((c: any) => c.name === colorName);
    return colorObj?.id || 1;
  };

  const getMaterialId = (materialName: string) => {
    const materialObj = apiData?.materials?.find((m: any) => m.name === materialName);
    return materialObj?.id || 1;
  };

  const getDesignServiceId = (service: string) => {
    return service === "premium" ? 2 : 1;
  };

  const getProtectionLayerId = (layer: string) => {
    return layer === "laminate" ? 1 : 2;
  };

  const renderSelect = (
    label: string,
    value: string,
    onChange: (e: any) => void,
    options: { value: string; label: string; hex?: string }[],
    description: string = "أختر"
  ) => {
    // إذا كانت options فارغة أو غير موجودة، لا نعرض الـ select
    if (!options || options.length === 0) {
      return null;
    }

    return (
      <Box display="flex" gap={2} alignItems="center" mb={3}>
        <Box flex={1}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="subtitle1" color="text.secondary" fontWeight="bold" sx={{ color: "#344" }}>
              {label}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "red", fontWeight: "bold" }}>
              *
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {description}
          </Typography>
        </Box>

        <Box flex={2}>
          <FormControl fullWidth>
            <InputLabel sx={{ textAlign: "right" }}>{label}</InputLabel>
            <Select 
              value={value} 
              onChange={onChange} 
              label={label} 
              required 
              sx={{ textAlign: "right" }}
            >
              {options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {opt.hex && (
                      <Box 
                        width={20} 
                        height={20} 
                        borderRadius="50%" 
                        bgcolor={opt.hex}
                        border="1px solid #ddd"
                      />
                    )}
                    {opt.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    );
  };

  const renderFeatures = () => {
    if (!apiData?.features || apiData.features.length === 0) {
      return null;
    }

    return (
      <Box display="flex" gap={2} alignItems="flex-start" mb={3}>
        <Box flex={1}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="subtitle1" color="text.secondary" fontWeight="bold" sx={{ color: "#344" }}>
              الخصائص
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            اختر الخصائص المطلوبة
          </Typography>
        </Box>

        <Box flex={2}>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {apiData.features.map((feature: any) => (
              <Chip
                key={feature.name}
                label={`${feature.name}: ${feature.value}`}
                onClick={() => handleFeatureToggle(`${feature.name}: ${feature.value}`)}
                color={selectedFeatures.includes(`${feature.name}: ${feature.value}`) ? "primary" : "default"}
                variant={selectedFeatures.includes(`${feature.name}: ${feature.value}`) ? "filled" : "outlined"}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  if (loading) return <p>جاري التحميل...</p>;
  if (!apiData) return <p>لا يوجد بيانات</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div>
        {/* 1) المقاسات جاية من الـ API */}
        {apiData?.sizes && apiData.sizes.length > 0 && renderSelect(
          "المقاس",
          size,
          (e) => handleChange(setSize, e.target.value),
          apiData.sizes.map((s: any) => ({
            value: s.name,
            label: s.name,
          }))
        )}

        {/* 2) الألوان جاية من الـ API */}
        {apiData?.colors && apiData.colors.length > 0 && renderSelect(
          "اللون",
          color,
          (e) => handleChange(setColor, e.target.value),
          apiData.colors.map((c: any) => ({
            value: c.name,
            label: c.name,
            hex: c.hex_code,
          }))
        )}

        {/* 3) الخامات جاية من الـ API */}
        {apiData?.materials && apiData.materials.length > 0 && renderSelect(
          "الخامة",
          material,
          (e) => handleChange(setMaterial, e.target.value),
          apiData.materials.map((m: any) => ({
            value: m.name,
            label: m.name,
          }))
        )}

        {/* 4) الخصائص */}
        {renderFeatures()}

        {/* 5) خدمة التصميم — ثابتة */}
        {renderSelect(
          "خدمة التصميم",
          designService,
          (e) => handleChange(setDesignService, e.target.value),
          [
            { value: "basic", label: "أساسية" },
            { value: "premium", label: "مميزة" },
          ]
        )}

        {/* 6) طبقة الحماية — ثابتة */}
        {renderSelect(
          "طبقة الحماية",
          protectionLayer,
          (e) => handleChange(setProtectionLayer, e.target.value),
          [
            { value: "laminate", label: "لامينيت" },
            { value: "glossy", label: "لمعان" },
          ]
        )}

        {/* 7) شكل الاستلام — ثابت */}
        {renderSelect(
          "شكل استلامك للاستيكر",
          deliveryMethod,
          (e) => handleChange(setDeliveryMethod, e.target.value),
          [
            { value: "pickup", label: "استلام شخصي" },
            { value: "delivery", label: "توصيل" },
          ]
        )}

        {/* 8) مدة التنفيذ — ثابت */}
        {renderSelect(
          "مدة التنفيذ للمنتج",
          executionTime,
          (e) => handleChange(setExecutionTime, e.target.value),
          [
            { value: "1day", label: "يوم" },
            { value: "3days", label: "٣ أيام" },
            { value: "1week", label: "أسبوع" },
          ]
        )}

        {/* 9) تصوير عينة — ثابت */}
        {renderSelect(
          "هل تريد تصوير عينة قبل الطباعة",
          samplePhoto,
          (e) => handleChange(setSamplePhoto, e.target.value),
          [
            { value: "yes", label: "نعم" },
            { value: "no", label: "لا" },
          ]
        )}
      </div>
    </motion.div>
  );
}