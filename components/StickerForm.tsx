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
  productData?: any;
  cartItemData?: any;
}

export const validateStickerForm = ({
  size,
  color,
  material,
  selectedOptions,
  apiData,
}: any) => {
  if (!apiData) return true; // لو مفيش بيانات من API اعتبره صحيح

  let missingFields = [];

  // ─── المقاس ───
  if (apiData.sizes?.length > 0) {
    if (!size || size === "اختر") missingFields.push("المقاس");
  }

  
  if (apiData.colors?.length > 0) {
    if (!color || color === "اختر") missingFields.push("اللون");
  }

 
  if (apiData.materials?.length > 0) {
    if (!material || material === "اختر") missingFields.push("الخامة");
  }

 
  if (apiData.features?.length > 0) {
    apiData.features.forEach((feature: any) => {
      const featureHasValues =
        feature.value || (feature.values && feature.values.length > 0);

      if (featureHasValues) {
        const selectedValue = selectedOptions?.find(
          (opt: any) =>
            opt.option_name === "خاصية" &&
            opt.option_value.startsWith(`${feature.name}:`)
        );

        if (!selectedValue || selectedValue.option_value.endsWith(": اختر")) {
          missingFields.push(feature.name);
        }
      }
    });
  }

  return missingFields.length === 0;
};

export default function StickerForm({
  cartItemId,
  productId,
  productData,
  cartItemData,
}: StickerFormProps) {
  const { updateCartItem, cart } = useCart();

  const [size, setSize] = useState("اختر");
  const [color, setColor] = useState("اختر");
  const [material, setMaterial] = useState("اختر");
  const [selectedFeatures, setSelectedFeatures] = useState<{
    [key: string]: string;
  }>({});

  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
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

  
  useEffect(() => {
    if (!cartItemId || !apiData || initialized) return;

    const cartItem = cart.find((item) => item.cart_item_id === cartItemId);
    if (!cartItem) return;

    console.log("=== LOADING CART ITEM DATA ===");
    console.log("Cart item:", cartItem);

   
    const sizeFromOptions = cartItem.selected_options?.find(
      (opt: any) => opt.option_name === "المقاس"
    )?.option_value;
    const colorFromOptions = cartItem.selected_options?.find(
      (opt: any) => opt.option_name === "اللون"
    )?.option_value;
    const materialFromOptions = cartItem.selected_options?.find(
      (opt: any) => opt.option_name === "الخامة"
    )?.option_value;

    
    if (cartItem.size && cartItem.size !== "اختر") {
      setSize(cartItem.size);
    } else if (sizeFromOptions && sizeFromOptions !== "اختر") {
      setSize(sizeFromOptions);
    } else if (apiData.sizes?.length > 0) {
      setSize("اختر");
    }

    if (cartItem.color?.name && cartItem.color.name !== "اختر") {
      setColor(cartItem.color.name);
    } else if (colorFromOptions && colorFromOptions !== "اختر") {
      setColor(colorFromOptions);
    } else if (apiData.colors?.length > 0) {
      setColor("اختر");
    }

    if (cartItem.material && cartItem.material !== "اختر") {
      setMaterial(cartItem.material);
    } else if (materialFromOptions && materialFromOptions !== "اختر") {
      setMaterial(materialFromOptions);
    } else if (apiData.materials?.length > 0) {
      setMaterial("اختر");
    }

   
    const featuresFromOptions: { [key: string]: string } = {};

    if (cartItem.selected_options && cartItem.selected_options.length > 0) {
      console.log("Found selected_options:", cartItem.selected_options);
      cartItem.selected_options.forEach((opt: any) => {
        if (opt.option_name === "خاصية") {
          const [name, value] = opt.option_value.split(": ");
          if (name && value && value !== "اختر") {
            featuresFromOptions[name.trim()] = value.trim();
          }
        }
      });
    }

  
    if (apiData?.features) {
      apiData.features.forEach((feature: any) => {
        if (!featuresFromOptions[feature.name]) {
         
          featuresFromOptions[feature.name] = "اختر";
        }
      });
    }

    console.log("Final features to set:", featuresFromOptions);
    setSelectedFeatures(featuresFromOptions);
    setInitialized(true);
  }, [cartItemId, cart, apiData, initialized]);

  const handleChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
  
    if (value === "اختر") {
      return;
    }
    console.log("Setting value:", value);
    setter(value);
    setHasChanges(true);
  };

  const handleFeatureChange = (featureName: string, value: string) => {
    
    if (value === "اختر") {
      return;
    }
    console.log("Setting feature:", featureName, value);
    setSelectedFeatures((prev) => ({ ...prev, [featureName]: value }));
    setHasChanges(true);
  };

  const handleUpdateCart = useCallback(async () => {
    if (!cartItemId || !apiData || !initialized || !hasChanges) return;

    if (
      (apiData.sizes?.length > 0 && size === "اختر") ||
      (apiData.colors?.length > 0 && color === "اختر") ||
      (apiData.materials?.length > 0 && material === "اختر")
    ) {
      return;
    }

  
    const hasInvalidFeatures = Object.entries(selectedFeatures).some(
      ([name, value]) => {
        const feature = apiData.features?.find((f: any) => f.name === name);
        return (
          feature &&
          (feature.value || feature.values?.length > 0) &&
          value === "اختر"
        );
      }
    );

    if (hasInvalidFeatures) {
      return;
    }

    const updates: any = {};

    
    if (apiData.sizes?.length > 0 && size && size !== "اختر") {
      const selectedSize = apiData.sizes.find((s: any) => s.name === size);
      updates.size_id = selectedSize?.id || null;
      updates.size = size;
    }

    if (apiData.colors?.length > 0 && color && color !== "اختر") {
      const selectedColor = apiData.colors.find((c: any) => c.name === color);
      updates.color_id = selectedColor?.id || null;
      updates.color = selectedColor || null;
    }

    if (apiData.materials?.length > 0 && material && material !== "اختر") {
      const selectedMaterial = apiData.materials.find(
        (m: any) => m.name === material
      );
      updates.material_id = selectedMaterial?.id || null;
      updates.material = material;
    }


    const selectedOptions: any[] = [];

   
    Object.entries(selectedFeatures).forEach(([name, value]) => {
      if (name && value && value !== "اختر") {
        selectedOptions.push({
          option_name: "خاصية",
          option_value: `${name}: ${value}`,
        });
      }
    });

  
    if (size && size !== "اختر" && apiData.sizes?.length > 0) {
      selectedOptions.push({
        option_name: "المقاس",
        option_value: size,
      });
    }

    if (color && color !== "اختر" && apiData.colors?.length > 0) {
      selectedOptions.push({
        option_name: "اللون",
        option_value: color,
      });
    }

    if (material && material !== "اختر" && apiData.materials?.length > 0) {
      selectedOptions.push({
        option_name: "الخامة",
        option_value: material,
      });
    }

    updates.selected_options = selectedOptions;

 
    if (Object.keys(updates).length > 0) {
      try {
        await updateCartItem(cartItemId, updates);
   
        setHasChanges(false);
      } catch (error) {
       
      }
    }
  }, [
    size,
    color,
    material,
    selectedFeatures,
    cartItemId,
    updateCartItem,
    apiData,
    initialized,
    hasChanges,
  ]);

  useEffect(() => {
    if (!initialized || !hasChanges) return;

    const timeoutId = setTimeout(() => {
      if (cartItemId) {
        console.log("=== AUTO-UPDATING CART ===");
        handleUpdateCart();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [handleUpdateCart, cartItemId, initialized, hasChanges]);


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
        <Box flex={2}>
          <FormControl
            fullWidth
            required={apiData.sizes.length > 0}
            size="small"
            error={size === "اختر"}
          >
            <InputLabel>المقاس</InputLabel>
            <Select
              value={size}
              onChange={(e) => handleChange(setSize, e.target.value)}
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
        <Box flex={2}>
          <FormControl
            fullWidth
            required={apiData.colors.length > 0}
            size="small"
            error={color === "اختر"}
          >
            <InputLabel>اللون</InputLabel>
            <Select
              value={color}
              onChange={(e) => handleChange(setColor, e.target.value)}
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
        <Box flex={2}>
          <FormControl
            fullWidth
            required={apiData.materials.length > 0}
            size="small"
            error={material === "اختر"}
          >
            <InputLabel>الخامة</InputLabel>
            <Select
              value={material}
              onChange={(e) => handleChange(setMaterial, e.target.value)}
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
          <Box flex={2}>
            <FormControl
              fullWidth
              required={hasValues}
              size="small"
              error={currentValue === "اختر"}
            >
              <InputLabel>{feature.name}</InputLabel>
              <Select
                value={currentValue}
                onChange={(e) =>
                  handleFeatureChange(feature.name, e.target.value)
                }
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
          </Box>
        </Box>
      );
    });
  };

  if (loading) return <Loading />;
  if (!apiData)
    return <p className="text-gray-600 text-center p-4">لا توجد بيانات</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-t border-gray-100 pt-4 mt-4"
    >
      <div className="space-y-4">
        {renderSizesSelect()}

        {renderColorsSelect()}

        {renderMaterialsSelect()}

        {renderFeaturesSelects()}
      </div>
    </motion.div>
  );
}
