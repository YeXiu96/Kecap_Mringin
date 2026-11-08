export interface OrderRequest {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  promoCode?: string;
  simulateFailure?: boolean;
}

export interface OrderReceipt {
  orderId: string;
  productName: string;
  quantity: number;
  subtotal: number;
  discountAmount: number;
  finalPrice: number;
  status: "CONFIRMED" | "FAILED";
  timestamp: string;
}

export interface PromoDiscount {
  code: string;
  discountPercent: number;
  description: string;
}

