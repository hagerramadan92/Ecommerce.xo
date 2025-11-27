"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  FormHelperText,
} from "@mui/material";
import { motion } from "framer-motion";
import { useCart } from "@/src/context/CartContext";
import Loading from "@/app/loading";

interface StickerFormProps {
  cartItemId?: number;
  productId: number;
}

export const validateStickerForm = ({
  size,
  color,
  material,
  selectedFeatures,
  apiData, // اضفنا apiData عشان نعرف أي الحقول موجودة
}: any) => {
  // التحقق من الحقول اللي موجودة في apiData فقط
  if (apiData?.sizes?.length && !size) return false;
  if (apiData?.colors?.length && !color) return false;
  if (apiData?.materials?.length && !material) return false;

  // التحقق من الخصائص فقط لو موجودة
  if (apiData?.features?.length) {
    for (const feature of apiData.features) {
      const name = feature.name;
      if (feature.values?.length && !selectedFeatures[name]) return false;
    }
  }

  return true; // كل شيء تمام
};


export default function StickerForm({ cartItemId, productId }: StickerFormProps) {
  const { updateCartItem, cart } = useCart();

  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [designService, setDesignService] = useState("");
  const [protectionLayer, setProtectionLayer] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [executionTime, setExecutionTime] = useState("");
  const [samplePhoto, setSamplePhoto] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<{ [key: string]: string }>({});

  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${baseUrl}/products/${productId}`);
        const data = await res.json();
        setApiData(data.data);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  // Load selected features from cart
  useEffect(() => {
    if (!cartItemId || cart.length === 0) return;
    const cartItem = cart.find(item => item.cart_item_id === cartItemId);
    if (!cartItem) return;

    if (cartItem.size) setSize(cartItem.size);
    if (cartItem.color?.name) setColor(cartItem.color.name);
    // if (cartItem.material) setMaterial(cartItem.material);
    if (cartItem.design_service) setDesignService(cartItem.design_service);
    // if (cartItem.protection_layer) setProtectionLayer(cartItem.protection_layer);

    if (cartItem.selected_options) {
      const featuresFromCart: { [key: string]: string } = {};
      cartItem.selected_options.forEach((opt: any) => {
        if (opt.option_name === "خاصية") {
          const [name, value] = opt.option_value.split(": ").length === 2
            ? opt.option_value.split(": ")
            : [opt.option_value, opt.option_value];
          featuresFromCart[name] = value;
        }
        // if (opt.option_name === "شكل الاستلام") setDeliveryMethod(opt.option_value);
        // if (opt.option_name === "مدة التنفيذ") setExecutionTime(opt.option_value);
        // if (opt.option_name === "تصوير عينة") setSamplePhoto(opt.option_value);
      });
      setSelectedFeatures(featuresFromCart);
    }
  }, [cartItemId, cart]);

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
  };

  const handleFeatureChange = (featureName: string, value: string) => {
    setSelectedFeatures((prev) => ({ ...prev, [featureName]: value }));
  };

  const handleUpdateCart = useCallback(async () => {
    if (!cartItemId || !apiData) return;

    const updates: any = {};

    updates.size_id = apiData.sizes.find((s: any) => s.name === size)?.id || 1;
    updates.color_id = apiData.colors.find((c: any) => c.name === color)?.id || 1;
    updates.material_id = apiData.materials.find((m: any) => m.name === material)?.id || 1;
    updates.design_service_id = designService === "premium" ? 2 : 1;
    updates.protection_layer_id = protectionLayer === "laminate" ? 1 : 2;

    const selectedOptions: any[] = [];
    Object.entries(selectedFeatures).forEach(([name, value]) => {
      selectedOptions.push({ option_name: "خاصية", option_value: `${name}: ${value}` });
    });
    if (deliveryMethod) selectedOptions.push({ option_name: "شكل الاستلام", option_value: deliveryMethod });
    if (executionTime) selectedOptions.push({ option_name: "مدة التنفيذ", option_value: executionTime });
    if (samplePhoto) selectedOptions.push({ option_name: "تصوير عينة", option_value: samplePhoto });

    updates.selected_options = selectedOptions;

    if (Object.keys(updates).length > 0) {
      await updateCartItem(cartItemId, updates);
    }
  }, [
    size,
    color,
    material,
    designService,
    protectionLayer,
    deliveryMethod,
    executionTime,
    samplePhoto,
    selectedFeatures,
    cartItemId,
    updateCartItem,
    apiData,
  ]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (cartItemId) handleUpdateCart();
    }, 800);
    return () => clearTimeout(timeoutId);
  }, [handleUpdateCart, cartItemId]);

  const renderSelect = (
  label: string,
  value: string,
  onChange: (e: any) => void,
  options: { value: string; label: string; hex?: string }[]
) => {
  if (!options || options.length === 0) return null; // لو مفيش خيارات، ما نعرضش
  return (
    <Box display="flex" gap={2} alignItems="center" mb={3}>
      <Box flex={1}>
        <Typography variant="subtitle1" fontWeight="bold">
          {label} <span style={{ color: "red" }}>*</span>
        </Typography>
      </Box>
      <Box flex={2}>
        <FormControl fullWidth required>
          <InputLabel>{label}</InputLabel>
          <Select value={value} onChange={onChange} label={label} required>
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.hex && <Box width={20} height={20} borderRadius="50%" bgcolor={opt.hex} mr={1} />}
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          {!value && <FormHelperText>هذا الحقل مطلوب</FormHelperText>}
        </FormControl>
      </Box>
    </Box>
  );
};


 const renderFeatureSelects = () => {
  if (!apiData?.features || apiData.features.length === 0) return null;

  return apiData.features.map((feature: any) => {
    // لو القيمة فارغة ومافيش خيارات، ما نعرضش
    if (!feature.values || feature.values.length === 0) return null;

    return (
      <Box key={feature.name} display="flex" gap={2} alignItems="center" mb={3}>
        <Box flex={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            {feature.name} <span style={{ color: "red" }}>*</span>
          </Typography>
        </Box>
        <Box flex={2}>
          <FormControl fullWidth required>
            <InputLabel>{feature.name}</InputLabel>
            <Select
              value={selectedFeatures[feature.name] || ""}
              onChange={(e) => handleFeatureChange(feature.name, e.target.value)}
              label={feature.name}
              required
            >
              {feature.values.map((val: string) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
            {!selectedFeatures[feature.name] && <FormHelperText>هذا الحقل مطلوب</FormHelperText>}
          </FormControl>
        </Box>
      </Box>
    );
  });
};


  if (loading) return <Loading />;
  if (!apiData) return <p>لا توجد بيانات</p>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div>
        {apiData?.sizes &&
          renderSelect(
            "المقاس",
            size,
            (e) => handleChange(setSize, e.target.value),
            apiData.sizes.map((s: any) => ({ value: s.name, label: s.name }))
          )}
        {apiData?.colors &&
          renderSelect(
            "اللون",
            color,
            (e) => handleChange(setColor, e.target.value),
            apiData.colors.map((c: any) => ({ value: c.name, label: c.name, hex: c.hex_code }))
          )}
        {apiData?.materials &&
          renderSelect(
            "الخامة",
            material,
            (e) => handleChange(setMaterial, e.target.value),
            apiData.materials.map((m: any) => ({ value: m.name, label: m.name }))
          )}
        {renderFeatureSelects()}
      </div>
    </motion.div>
  );
}
