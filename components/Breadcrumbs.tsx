import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "next/link";

function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}
interface nameProps {
  proName: string;
}
export default function CustomSeparator({ proName }: nameProps) {
  const breadcrumbs = [
    <Link key="1" href="/">
      الرئيسية
    </Link>,
    <Link key="2" href="/product">
      المنتاجات
    </Link>,
    <Typography key="3" sx={{ color: "#000" }}>
      {proName}
    </Typography>,
  ];

  return (
    <Stack spacing={10}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
}
