// app/index.tsx

// 1. Menerapkan Type & Interface
type VariantType = "Manis" | "Asin" | "Inggris";

interface Product {
  id: string;
  name: string;
  price: number;
  variant: VariantType;
  inStock: boolean;
}

// 2. Menerapkan Array of Objects
const productList: Product[] = [
  {
    id: "1",
    name: "Kecap Mringin Manis",
    price: 15000,
    variant: "Manis",
    inStock: true,
  },
  {
    id: "2",
    name: "Kecap Mringin Asin",
    price: 14000,
    variant: "Asin",
    inStock: true,
  },
  {
    id: "3",
    name: "Kecap Inggris Mringin",
    price: 20000,
    variant: "Inggris",
    inStock: false,
  },
  {
    id: "4",
    name: "Kecap Mringin Pedas",
    price: 16000,
    variant: "Manis",
    inStock: true,
  },
];
