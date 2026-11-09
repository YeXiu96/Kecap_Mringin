export type VariantType = "Manis" | "Asin" | "Inggris";
export interface Product {
  readonly id: string;
  name: string;
  price: number;
  variant: VariantType;
  inStock: boolean;
  stock: number;
  sizeMl?: number;
}
