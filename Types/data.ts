import { ProductIn } from "./ProductIn";

export const link = [
  { title: "منتجات بتصاميمك الخاصة", href: "/" },
  { title: "منتجات بدون طباعة", href: "/products-without-print" },
  { title: "مجموعة الكتب", href: "/books" },
  { title: "مجموعة الإبداع", href: "/designs" },
  { title: "الخدمات الإلكترونية", href: "/online-services" },
];

export const categories = [
  { title: "الأثاث", src: "/images/cat1.png" , slug: "furniture"},
  { title: "وحدات تخزين", src: "/images/cat1.png" , slug: "storage" },
  { title: "ديكورات منزلية", src: "/images/cat2.png", slug: "decor" },
  { title: "أثاث مكتبي", src: "/images/cat1.png" , slug: "office-furniture"},
  { title: "الاضاءة", src: "/images/cat1.png", slug: "lighting" },
  { title: "أقمشة و مفروشات", src: "/images/cat2.png", slug: "fabrics-bedding"  },
  { title: "المطبخ والحمام", src: "/images/cat1.png" , slug: "kitchen-bath"},
  { title: "الأجهزة المنزلية", src: "/images/cat1.png" , slug: "home-appliances" },
  { title: "أدوات منزلية", src: "/images/cat2.png", slug: "home-tools"  },
  { title: "الكترونيات", src: "/images/cat1.png", slug: "electronics" },
  { title: "أثاث خارجي", src: "/images/cat2.png" , slug: "outdoor-furniture"},
];


export interface Order {
  id: number;
  title: string;
  date: string;
  price: string;
  img: string;
  pId: number;
  years: number;
}

// orders
export const ordersData: Order[] = [
  {
    id: 1,
    title: "كرسي بذراعين خشب زان و قطيفه - بيج و أخضر",
    date: "٢ نوفمبر ٢٠٢٥",
    price: "2,345",
    img: "/images/o1.jpg",
    pId: 5,
    years: 2025,
  },
  {
    id: 2,
    title: "كرسي بذراعين خشب زان و قطيفه - بيج و أخضر",
    date: "٢ نوفمبر ٢٠٢٥",
    price: "2,345",
    img: "/images/o1.jpg",
    pId: 6,
    years: 2025,
  },
  {
    id: 3,
    title: "كرسي بذراعين خشب زان و قطيفه - بيج و أخضر",
    date: "٢ نوفمبر ٢٠٢٥",
    price: "2,345",
    img: "/images/o1.jpg",
    pId: 4,
    years: 2025,
  },
];


export const products:ProductIn [] = [
  {
    id: 1,
    image: "/images/o1.jpg",
    name: "كنبة رمادية",
    description: "كنبة مريحة 3 مقاعد من القماش المخملي.",
    price: "4200",
    oldPrice: "5000",
    discount: 16,
    categorySlug: "furniture",
    categoryName: "الأثاث",
    quantity:2
  },
   {
    id: 11,
    image: "/images/o1.jpg",
    name: "كنبة رمادية",
    description: "كنبة مريحة 3 مقاعد من القماش المخملي.",
    price: "4200",
    oldPrice: "5000",
    discount: 16,
    categorySlug: "furniture",
    categoryName: "الأثاث",
     quantity:2
  },
   {
    id: 21,
    image: "/images/o1.jpg",
    name: "كنبة رمادية",
    description: "كنبة مريحة 3 مقاعد من القماش المخملي.",
    price: "4200",
    oldPrice: "5000",
    discount: 16,
    categorySlug: "furniture",
    categoryName: "الأثاث",
     quantity:2
  },
   {
    id: 14,
    image: "/images/o1.jpg",
    name: "كنبة رمادية",
    description: "كنبة مريحة 3 مقاعد من القماش المخملي.",
    price: "4200",
    oldPrice: "5000",
    discount: 16,
    categorySlug: "furniture",
    categoryName: "الأثاث",
     quantity:2
  },
   {
    id: 122,
    image: "/images/o1.jpg",
    name: "كنبة رمادية",
    description: "كنبة مريحة 3 مقاعد من القماش المخملي.",
    price: "4200",
    oldPrice: "5000",
    discount: 16,
    categorySlug: "furniture",
    categoryName: "الأثاث",
     quantity:2
  },
   {
    id: 41,
    image: "/images/o1.jpg",
    name: "كنبة رمادية",
    description: "كنبة مريحة 3 مقاعد من القماش المخملي.",
    price: "4200",
    oldPrice: "5000",
    discount: 16,
    categorySlug: "furniture",
    categoryName: "الأثاث",
     quantity:2
  },
  {
    id: 2,
    image: "/images/o1.jpg",
    name: "ترابيزة مكتب خشب طبيعي",
    price: "950",
    categorySlug: "office-furniture",
    categoryName: "أثاث مكتبي",
     quantity:2
  },
  {
    id: 3,
    image: "/images/p1.jpg",
    name: "مصباح أرضي ذهبي",
    price: "250",
    categorySlug: "lighting",
    categoryName: "الاضاءة",
     quantity:0
  },
  {
    id: 4,
    image: "/images/p3.jpg",
    name: "طقم سرير قطني",
    price: "780",
    categorySlug: "fabrics-bedding",
    categoryName: "أقمشة و مفروشات",
     quantity:0
  },
  {
    id: 5,
    image: "/images/p4.jpg",
    name: "كرسي خارجي مقاوم للماء",
    price: "1500",
    categorySlug: "outdoor-furniture",
    categoryName: "أثاث خارجي",
     quantity:2
  },
];

export const categoryNames: Record<string, string> = {
  "furniture": "الأثاث",
  "storage-units": "وحدات تخزين",
  "home-decor": "ديكورات منزلية",
  "office-furniture": "أثاث مكتبي",
  "lighting": "الإضاءة",
  "fabrics": "أقمشة ومفروشات",
  "kitchen-bath": "المطبخ والحمام",
  "appliances": "الأجهزة المنزلية",
  "houseware": "أدوات منزلية",
  "electronics": "إلكترونيات",
  "outdoor-furniture": "أثاث خارجي",
};
