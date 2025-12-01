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
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useCart } from "@/src/context/CartContext";
import Loading from "@/app/loading";

interface StickerFormProps {
  cartItemId?: number;
  productId: number;
  productData?: any;
  cartItemData?: any;
}

export default function StickerForm({
  cartItemId,
  productId,
  cartItemData,
}: StickerFormProps) {
  const { updateCartItem, cart, fetchCartItemOptions, loadItemOptions } = useCart();

  const [size, setSize] = useState("اختر");
  const [color, setColor] = useState("اختر");
  const [material, setMaterial] = useState("اختر");
  const [selectedFeatures, setSelectedFeatures] = useState<{
    [key: string]: string;
  }>({});

  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // دالة لتحميل بيانات المنتج من API
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
  }, [productId, baseUrl]);

  // دالة لاستخراج القيمة من selected_options
  const extractValueFromOptions = useCallback((options: any[], optionName: string) => {
    if (!options || !Array.isArray(options)) return null;
    
    const option = options.find((opt: any) => opt.option_name === optionName);
    return option ? option.option_value : null;
  }, []);

  // دالة لتحميل القيم المحفوظة من السيرفر
  const loadSavedOptions = useCallback(async () => {
    if (!cartItemId) return;

    setFormLoading(true);
    try {
      // الحصول على أحدث البيانات من السيرفر
      const savedOptions = await fetchCartItemOptions(cartItemId);
      console.log("Loaded options from server:", savedOptions);

      if (savedOptions) {
        // استخراج القيم من selected_options
        const sizeFromOptions = extractValueFromOptions(savedOptions.selected_options, "المقاس");
        const colorFromOptions = extractValueFromOptions(savedOptions.selected_options, "اللون");
        const materialFromOptions = extractValueFromOptions(savedOptions.selected_options, "الخامة");

        // تحديد القيم مع الأولوية: selected_options > الحقول المباشرة
        const finalSize = sizeFromOptions || savedOptions.size || "اختر";
        const finalColor = colorFromOptions || (savedOptions.color?.name || savedOptions.color) || "اختر";
        const finalMaterial = materialFromOptions || savedOptions.material || "اختر";

        console.log("Final values to set:", {
          size: finalSize,
          color: finalColor,
          material: finalMaterial
        });

        // تحديث الـ state
        if (finalSize !== "اختر") setSize(finalSize);
        if (finalColor !== "اختر") setColor(finalColor);
        if (finalMaterial !== "اختر") setMaterial(finalMaterial);

        // معالجة الميزات
        const featuresFromOptions: { [key: string]: string } = {};
        if (savedOptions.selected_options && savedOptions.selected_options.length > 0) {
          savedOptions.selected_options.forEach((opt: any) => {
            if (opt.option_name === "خاصية") {
              const [name, value] = opt.option_value.split(": ");
              if (name && value && value !== "اختر") {
                featuresFromOptions[name.trim()] = value.trim();
              }
            }
          });
        }

        // إضافة القيم الافتراضية للميزات المطلوبة
        if (apiData?.features) {
          apiData.features.forEach((feature: any) => {
            const hasValues = feature.value || (feature.values && feature.values.length > 0);
            if (hasValues && !featuresFromOptions[feature.name]) {
              featuresFromOptions[feature.name] = "اختر";
            }
          });
        }

        console.log("Features to set:", featuresFromOptions);
        setSelectedFeatures(featuresFromOptions);
      }
    } catch (err) {
      console.error("Error loading saved options:", err);
    } finally {
      setFormLoading(false);
      setInitialized(true);
    }
  }, [cartItemId, fetchCartItemOptions, extractValueFromOptions, apiData]);

  // تحميل القيم عند التهيئة الأولى وعند تغيير cartItemId
  useEffect(() => {
    if (!cartItemId || !apiData) return;

    console.log("Initializing/updating form for cart item:", cartItemId);
    loadSavedOptions();
  }, [cartItemId, apiData, loadSavedOptions]);

  // دالة لتحديث السيرفر مع العرض المحلي أولاً
  const updateOptionWithFeedback = useCallback(async (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
    optionName: string,
    apiFieldName?: string
  ) => {
    if (!cartItemId || !apiData) return;

    console.log(`Updating ${optionName} to:`, value);
    
    // تحديث المحلي أولاً (تجربة مستخدم أفضل)
    setter(value);
    setSaving(true);

    // إعداد selected_options الكاملة مع التحديث الجديد
    const selectedOptions: any[] = [];

    // إضافة الحقول الأساسية
    const currentSize = optionName === "المقاس" ? value : size;
    const currentColor = optionName === "اللون" ? value : color;
    const currentMaterial = optionName === "الخامة" ? value : material;

    if (currentSize && currentSize !== "اختر" && apiData.sizes?.length > 0) {
      selectedOptions.push({
        option_name: "المقاس",
        option_value: currentSize,
      });
    }

    if (currentColor && currentColor !== "اختر" && apiData.colors?.length > 0) {
      selectedOptions.push({
        option_name: "اللون",
        option_value: currentColor,
      });
    }

    if (currentMaterial && currentMaterial !== "اختر" && apiData.materials?.length > 0) {
      selectedOptions.push({
        option_name: "الخامة",
        option_value: currentMaterial,
      });
    }

    // إضافة الميزات
    Object.entries(selectedFeatures).forEach(([name, val]) => {
      if (name && val && val !== "اختر") {
        selectedOptions.push({
          option_name: "خاصية",
          option_value: `${name}: ${val}`,
        });
      }
    });

    const updates: any = {
      selected_options: selectedOptions,
    };

    // إضافة الحقول الإضافية إذا كانت موجودة
    if (apiFieldName === "size" && value !== "اختر" && apiData.sizes?.length > 0) {
      const selectedSize = apiData.sizes.find((s: any) => s.name === value);
      if (selectedSize?.id) updates.size_id = selectedSize.id;
      updates.size = value;
    }

    if (apiFieldName === "color" && value !== "اختر" && apiData.colors?.length > 0) {
      const selectedColor = apiData.colors.find((c: any) => c.name === value);
      if (selectedColor?.id) updates.color_id = selectedColor.id;
      updates.color = selectedColor || { name: value };
    }

    if (apiFieldName === "material" && value !== "اختر" && apiData.materials?.length > 0) {
      const selectedMaterial = apiData.materials.find((m: any) => m.name === value);
      if (selectedMaterial?.id) updates.material_id = selectedMaterial.id;
      updates.material = value;
    }

    console.log("Sending update to server:", updates);

    try {
      const success = await updateCartItem(cartItemId, updates);
      if (success) {
        console.log("Update successful, refreshing options...");
        // إعادة تحميل البيانات من السيرفر للتأكد من المزامنة
        await loadSavedOptions();
      }
    } catch (error) {
      console.error("Failed to update option:", error);
    } finally {
      setSaving(false);
    }
  }, [cartItemId, apiData, size, color, material, selectedFeatures, updateCartItem, loadSavedOptions]);

  // معالجة تغيير المقاس
  const handleSizeChange = async (value: string) => {
    await updateOptionWithFeedback(setSize, value, "المقاس", "size");
  };

  // معالجة تغيير اللون
  const handleColorChange = async (value: string) => {
    await updateOptionWithFeedback(setColor, value, "اللون", "color");
  };

  // معالجة تغيير الخامة
  const handleMaterialChange = async (value: string) => {
    await updateOptionWithFeedback(setMaterial, value, "الخامة", "material");
  };

  // معالجة تغيير الميزات
  const handleFeatureChange = async (featureName: string, value: string) => {
    if (value === "اختر") return;
    
    console.log("Updating feature:", featureName, value);
    setSaving(true);
    
    // تحديث المحلي أولاً
    const newFeatures = { ...selectedFeatures, [featureName]: value };
    setSelectedFeatures(newFeatures);

    // إعداد selected_options الكاملة
    const selectedOptions: any[] = [];

    // إضافة الحقول الأساسية
    if (size && size !== "اختر" && apiData?.sizes?.length > 0) {
      selectedOptions.push({
        option_name: "المقاس",
        option_value: size,
      });
    }
    
    if (color && color !== "اختر" && apiData?.colors?.length > 0) {
      selectedOptions.push({
        option_name: "اللون",
        option_value: color,
      });
    }
    
    if (material && material !== "اختر" && apiData?.materials?.length > 0) {
      selectedOptions.push({
        option_name: "الخامة",
        option_value: material,
      });
    }
    
    // إضافة جميع الميزات
    Object.entries(newFeatures).forEach(([name, val]) => {
      if (name && val && val !== "اختر") {
        selectedOptions.push({
          option_name: "خاصية",
          option_value: `${name}: ${val}`,
        });
      }
    });
    
    const updates = { selected_options: selectedOptions };
    
    console.log("Updating feature on server:", updates);
    
    try {
      const success = await updateCartItem(cartItemId!, updates);
      if (success) {
        console.log("Feature update successful");
        await loadSavedOptions();
      }
    } catch (error) {
      console.error("Failed to update feature:", error);
    } finally {
      setSaving(false);
    }
  };

  // عرض Loader أثناء التحميل
  if (loading || formLoading) {
    return (
      <div className="border-t border-gray-100 pt-4 mt-4">
        <div className="flex justify-center items-center py-8">
          <CircularProgress size={24} />
          <span className="mr-2 text-gray-600">جاري تحميل الخيارات...</span>
        </div>
      </div>
    );
  }

  if (!apiData) {
    return (
      <div className="border-t border-gray-100 pt-4 mt-4">
        <p className="text-gray-600 text-center p-4">لا توجد بيانات للمنتج</p>
      </div>
    );
  }

  const renderSizesSelect = () => {
    if (!apiData?.sizes || apiData.sizes.length === 0) return null;

    const sizeOptions = apiData.sizes.map((sizeItem: any) => ({
      value: sizeItem.name,
      label: sizeItem.name,
    }));

    return (
      <Box display="flex" gap={2} alignItems="center" mb={3}>
        <Box flex={1}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            className="text-gray-800"
          >
            المقاس{" "}
            {apiData.sizes.length > 0 && (
              <span style={{ color: "red" }}>*</span>
            )}
          </Typography>
        </Box>
        <Box flex={2} position="relative">
          <FormControl
            fullWidth
            required={apiData.sizes.length > 0}
            size="small"
            error={apiData.sizes.length > 0 && size === "اختر"}
            disabled={saving}
          >
            <InputLabel>المقاس</InputLabel>
            <Select
              value={size}
              onChange={(e) => handleSizeChange(e.target.value)}
              label="المقاس"
              required={apiData.sizes.length > 0}
              className="bg-white"
            >
              <MenuItem value="اختر" disabled>
                <em className="text-gray-400">اختر</em>
              </MenuItem>
              {sizeOptions.map((opt: any) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            {apiData.sizes.length > 0 && size === "اختر" && (
              <FormHelperText className="text-red-500 text-xs">
                يجب اختيار المقاس
              </FormHelperText>
            )}
          </FormControl>
          {saving && (
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <CircularProgress size={16} />
            </div>
          )}
        </Box>
      </Box>
    );
  };

  const renderColorsSelect = () => {
    if (!apiData?.colors || apiData.colors.length === 0) return null;

    const colorOptions = apiData.colors.map((colorItem: any) => ({
      value: colorItem.name,
      label: colorItem.name,
      hex: colorItem.hex_code,
    }));

    return (
      <Box display="flex" gap={2} alignItems="center" mb={3}>
        <Box flex={1}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            className="text-gray-800"
          >
            اللون{" "}
            {apiData.colors.length > 0 && (
              <span style={{ color: "red" }}>*</span>
            )}
          </Typography>
        </Box>
        <Box flex={2} position="relative">
          <FormControl
            fullWidth
            required={apiData.colors.length > 0}
            size="small"
            error={apiData.colors.length > 0 && color === "اختر"}
            disabled={saving}
          >
            <InputLabel>اللون</InputLabel>
            <Select
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              label="اللون"
              required={apiData.colors.length > 0}
              className="bg-white"
            >
              <MenuItem value="اختر" disabled>
                <em className="text-gray-400">اختر</em>
              </MenuItem>
              {colorOptions.map((opt: any) => (
                <MenuItem key={opt.value} value={opt.value}>
                  <div className="flex items-center gap-2">
                    {opt.hex && (
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: opt.hex }}
                      />
                    )}
                    <span>{opt.label}</span>
                  </div>
                </MenuItem>
              ))}
            </Select>
            {apiData.colors.length > 0 && color === "اختر" && (
              <FormHelperText className="text-red-500 text-xs">
                يجب اختيار اللون
              </FormHelperText>
            )}
          </FormControl>
          {saving && (
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <CircularProgress size={16} />
            </div>
          )}
        </Box>
      </Box>
    );
  };

  const renderMaterialsSelect = () => {
    if (!apiData?.materials || apiData.materials.length === 0) return null;

    const materialOptions = apiData.materials.map((materialItem: any) => ({
      value: materialItem.name,
      label: materialItem.name,
    }));

    return (
      <Box display="flex" gap={2} alignItems="center" mb={3}>
        <Box flex={1}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            className="text-gray-800"
          >
            الخامة{" "}
            {apiData.materials.length > 0 && (
              <span style={{ color: "red" }}>*</span>
            )}
          </Typography>
        </Box>
        <Box flex={2} position="relative">
          <FormControl
            fullWidth
            required={apiData.materials.length > 0}
            size="small"
            error={apiData.materials.length > 0 && material === "اختر"}
            disabled={saving}
          >
            <InputLabel>الخامة</InputLabel>
            <Select
              value={material}
              onChange={(e) => handleMaterialChange(e.target.value)}
              label="الخامة"
              required={apiData.materials.length > 0}
              className="bg-white"
            >
              <MenuItem value="اختر" disabled>
                <em className="text-gray-400">اختر</em>
              </MenuItem>
              {materialOptions.map((opt: any) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            {apiData.materials.length > 0 && material === "اختر" && (
              <FormHelperText className="text-red-500 text-xs">
                يجب اختيار الخامة
              </FormHelperText>
            )}
          </FormControl>
          {saving && (
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <CircularProgress size={16} />
            </div>
          )}
        </Box>
      </Box>
    );
  };

  const renderFeaturesSelects = () => {
    if (!apiData?.features || apiData.features.length === 0) return null;

    return apiData.features.map((feature: any, index: number) => {
      let options: { value: string; label: string }[] = [];

      if (
        feature.values &&
        Array.isArray(feature.values) &&
        feature.values.length > 0
      ) {
        options = feature.values.map((val: string) => ({
          value: val,
          label: val,
        }));
      } else if (feature.value) {
        options = [
          {
            value: feature.value,
            label: feature.value,
          },
        ];
      } else {
        return null;
      }

      const currentValue = selectedFeatures[feature.name] || "اختر";
      const hasValues =
        feature.value || (feature.values && feature.values.length > 0);

      return (
        <Box key={index} display="flex" gap={2} alignItems="center" mb={3}>
          <Box flex={1}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              className="text-gray-800"
            >
              {feature.name}{" "}
              {hasValues && <span style={{ color: "red" }}>*</span>}
            </Typography>
          </Box>
          <Box flex={2} position="relative">
            <FormControl
              fullWidth
              required={hasValues}
              size="small"
              error={hasValues && currentValue === "اختر"}
              disabled={saving}
            >
              <InputLabel>{feature.name}</InputLabel>
              <Select
                value={currentValue}
                onChange={(e) => handleFeatureChange(feature.name, e.target.value)}
                label={feature.name}
                required={hasValues}
                className="bg-white"
              >
                <MenuItem value="اختر" disabled>
                  <em className="text-gray-600">اختر</em>
                </MenuItem>
                {options.map((opt: any) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              {hasValues && currentValue === "اختر" && (
                <FormHelperText className="text-red-500 text-xs">
                  يجب اختيار {feature.name}
                </FormHelperText>
              )}
            </FormControl>
            {saving && (
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <CircularProgress size={16} />
              </div>
            )}
          </Box>
        </Box>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-t border-gray-100 pt-4 mt-4"
    >
      {saving && (
        <div className="mb-4 p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center">
            <CircularProgress size={20} className="ml-2" />
            <span className="text-blue-600 text-sm">جاري حفظ التغييرات...</span>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {renderSizesSelect()}
        {renderColorsSelect()}
        {renderMaterialsSelect()}
        {renderFeaturesSelects()}
      </div>
    </motion.div>
  );
}