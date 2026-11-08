export interface ApifyProductItem {
  id: string | number;
  display_name: string;
  thumbnail: string;
  packaging: string;
  share_url: string;
  published: boolean;
  price_instructions: {
    unit_price: string | number; 
    bulk_price: string | number; 
    size_format: string;         
    unit_size: number;           
  };
}

export interface MarketProduct {
  readonly id: string;
  name: string;
  imageUrl: string;
  packaging: string;
  priceEur: number;
  pricePerLiterEur: number;
  sizeMl: number;
  link: string;
}