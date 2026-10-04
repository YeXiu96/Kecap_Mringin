export type VariantType = "Manis" | "Asin" | "Inggris";
export interface Product {
  readonly id: string;
  name: string;
  price: number;
  variant: VariantType;
  inStock: boolean;
  sizeMl?: number;
}
