"use client";
import { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";

export default function StickerForm() {
  const [size, setSize] = useState("");
  const [designService, setDesignService] = useState("");
  const [type, setType] = useState("");
  const [protectionLayer, setProtectionLayer] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [executionTime, setExecutionTime] = useState("");
  const [samplePhoto, setSamplePhoto] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      size,
      designService,
      type,
      protectionLayer,
      deliveryMethod,
      executionTime,
      samplePhoto,
    };
    console.log("Form Data:", formData);
  };

  const renderSelect = (
    label: string,
    value: string,
    onChange: (e: any) => void,
    options: { value: string; label: string }[],
    description: string = "أختر"
  ) => (
    <Box display="flex" gap={2} alignItems="center" mb={3}>
      {/* Label Box: ثلث المساحة */}
      <Box flex={1}>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography variant="subtitle1" color="text.secondary" fontWeight="bold" sx={{color:"#344"}}>
            {label}
          </Typography>
          <Typography variant="subtitle1" color="orange" fontWeight="bold"  sx={{color:"red"}}>
            *
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {description}
        </Typography>
      </Box>

      {/* Select Box: باقي المساحة */}
      <Box flex={2}>
        <FormControl fullWidth>
          <InputLabel sx={{ textAlign: "right" }}>{label}</InputLabel>
          <Select value={value} onChange={onChange} label={label} required sx={{ textAlign: "right" }}>
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );

  return (
    <form onSubmit={handleSubmit}>
      {renderSelect(
        "المقاس",
        size,
        (e) => setSize(e.target.value),
        [
          { value: "small", label: "صغير" },
          { value: "medium", label: "متوسط" },
          { value: "large", label: "كبير" },
        ]
      )}

      {renderSelect(
        "خدمة التصميم",
        designService,
        (e) => setDesignService(e.target.value),
        [
          { value: "basic", label: "أساسية" },
          { value: "premium", label: "مميزة" },
        ]
      )}

      {renderSelect(
        "النوع",
        type,
        (e) => setType(e.target.value),
        [
          { value: "sticker", label: "ستيكر" },
          { value: "label", label: "ليبل" },
        ]
      )}

      {renderSelect(
        "طبقة الحماية",
        protectionLayer,
        (e) => setProtectionLayer(e.target.value),
        [
          { value: "laminate", label: "لامينيت" },
          { value: "glossy", label: "لمعان" },
        ]
      )}

      {renderSelect(
        "شكل استلامك للاستيكر",
        deliveryMethod,
        (e) => setDeliveryMethod(e.target.value),
        [
          { value: "pickup", label: "استلام شخصي" },
          { value: "delivery", label: "توصيل" },
        ]
      )}

      {renderSelect(
        "مدة التنفيذ للمنتج",
        executionTime,
        (e) => setExecutionTime(e.target.value),
        [
          { value: "1day", label: "يوم" },
          { value: "3days", label: "٣ أيام" },
          { value: "1week", label: "أسبوع" },
        ]
      )}

      {renderSelect(
        "هل تريد تصوير عينة قبل طباعة الكمية",
        samplePhoto,
        (e) => setSamplePhoto(e.target.value),
        [
          { value: "yes", label: "نعم" },
          { value: "no", label: "لا" },
        ]
      )}

    
    </form>
  );
}
