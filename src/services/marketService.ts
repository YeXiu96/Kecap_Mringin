import { ApifyProductItem, MarketProduct } from "@/types/marketProduct";

const BASE_URL = "https://api.apify.com/v2";
const ACTOR_ID = "zOiLZ2YwWpoBjhddk";
const TOKEN = process.env.EXPO_PUBLIC_APIFY_TOKEN;

function mapToMarketProduct(item: ApifyProductItem): MarketProduct {
  const p = item.price_instructions;
  return {
    id: String(item.id),
    name: item.display_name,
    imageUrl: item.thumbnail,
    packaging: item.packaging,
    priceEur: Number(p.unit_price),        
    pricePerLiterEur: Number(p.bulk_price),
    sizeMl: Math.round(p.unit_size * 1000), 
    link: item.share_url,
  };
}

export async function fetchMarketProducts(): Promise<MarketProduct[]> {
  if (!TOKEN) {
    throw new Error("Token Apify belum diisi di file .env");
  }

  // Endpoint: item dataset milik run TERAKHIR yang BERHASIL dari Actor ini
  const url = `${BASE_URL}/acts/${ACTOR_ID}/runs/last/dataset/items?status=SUCCEEDED&clean=true&format=json`;

  let response = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` }, // token dikirim lewat header
  });

  // Jika run terakhir sudah kedaluwarsa/terhapus (HTTP 404), jalankan ulang Actor secara otomatis
  if (response.status === 404) {
    const syncRunUrl = `${BASE_URL}/acts/${ACTOR_ID}/run-sync-get-dataset-items?clean=true&format=json`;
    response = await fetch(syncRunUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language: "en", query: "soy sauce" }),
    });
  }

  // fetch() tidak otomatis error untuk status 401/404/500, jadi dicek manual
  if (response.status === 401) {
    throw new Error("Token Apify tidak valid atau sudah dihapus");
  }
  if (!response.ok) {
    throw new Error(`Gagal mengambil data (HTTP ${response.status})`);
  }

  // Response berupa ARRAY langsung -> diberi tipe ApifyProductItem[]
  const data: ApifyProductItem[] = await response.json();

  return data
    .filter((item) => item.published) // hanya produk yang masih dijual
    .map(mapToMarketProduct);         // ApifyProductItem[] -> MarketProduct[]
}