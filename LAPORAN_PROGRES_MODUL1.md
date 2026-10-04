# Laporan Progres & Riwayat Pengerjaan - Modul 1
**Aplikasi**: Katalog Produk "Kecap Mringin"  
**Framework**: React Native (Expo Router) + TypeScript  
**Cabang (Branch)**: `modul1`

---

## 👥 Kontributor & Pembagian Tugas

| Anggota / Git Author | Peran / Pembagian Tugas | File Terkait |
| :--- | :--- | :--- |
| **YeXiu96** | Inisialisasi Proyek & Base Structure Modul 1 | `src/app/index.tsx`, `src/constants/styles.ts`, konfigurasi Expo |
| **LeiXuanz1** | Custom Function & Komponen Render Card | `src/functions/productActions.ts`, `src/components/productCard.tsx` |
| **mdavaarya** | Type & Interface, Array of Objects, Integrasi Modular & Styling | `src/types/product.ts`, `src/app/index.tsx`, `src/components/productCard.tsx` |

---

## 📜 Riwayat Commit Kelompok

### 1. Commit `bee913c` — *"Modul1"*
* **Author**: YeXiu96
* **Deskripsi**:
  - Inisialisasi template proyek Expo dengan Expo Router.
  - Membuat implementasi dasar awal Modul 1 dalam satu file (`src/app/index.tsx`).
  - Menyiapkan stylesheet eksternal awal di `src/constants/styles.ts`.

---

### 2. Commit `9815a1b` — *"Add function productCard"*
* **Author**: LeiXuanz1
* **Deskripsi**:
  - Memisahkan komponen kartu produk ke file terpisah (`src/components/productCard.tsx`).
  - Mengarahkan `onPress` kartu produk ke fungsi handler `handlePressProduct`.

---

### 3. Commit `00f43f5` — *"function press product"*
* **Author**: LeiXuanz1
* **Deskripsi**:
  - Membuat modul `src/functions/productActions.ts`.
  - Mengimplementasikan **Custom Function** `handlePressProduct(productName, isAvailable)` yang menampilkan dialog `Alert.alert` berdasarkan status stok barang.

---

### 4. Commit `967d552` — *"flatlist for item"*
* **Author**: LeiXuanz1
* **Deskripsi**:
  - Melakukan perapian format data array `productList` pada `src/app/index.tsx`.
  - Mempersiapkan integrasi modularisasi rendering FlatList.

---

### 5. Commit Terbaru (Pekerjaan mdavaarya)
* **Author**: mdavaarya
* **Deskripsi**:
  - **Type & Interface Terpusat**: Membuat modul `src/types/product.ts` yang mendefinisikan `VariantType` (Union Type) dan interface `Product` (dengan `readonly id`, `sizeMl?`).
  - **Integrasi Modular**: Memperbaiki import di `productCard.tsx` dari `@/types/product`.
  - **Inline & External Styles**: Mengintegrasikan kembali badge varian & stok dinamis menggunakan Inline Styles pada `productCard.tsx`.
  - **Looping & Screen Utama**: Mengimplementasikan kembali `export default function Index()` pada `src/app/index.tsx` dengan `<FlatList>` yang merender `ProductCard`.
  - **Lint & Type Check**: Memastikan seluruh kode lulus `npx tsc --noEmit` dan `npx expo lint` tanpa error.

---

## 📊 Pemenuhan Kriteria Penilaian Modul 1

| Kriteria Penilaian | Bobot | Implementasi Kode | Status |
| :--- | :---: | :--- | :---: |
| **Menerapkan Type & Array of Objects** | 10% | Didefinisikan pada `src/types/product.ts` dan diimplementasikan pada `productList: Product[]` di `src/app/index.tsx`. |  **100%** |
| **Menerapkan Deklarasi Custom Function & Loop** | 10% | Custom function `handlePressProduct` di `src/functions/productActions.ts` dan loop `<FlatList>` di `src/app/index.tsx`. |  **100%** |
| **Menerapkan Inline & External Styles** | 10% | External styles dari `src/constants/styles.ts` dan Inline styles pada badge stok di `src/components/productCard.tsx`. |  **100%** |

---

## 📁 Struktur Direktori Terkini

```text
Kecap_Mringin/
├── src/
│   ├── app/
│   │   ├── _layout.tsx           # Layout navigasi Expo Router
│   │   ├── explore.tsx           # Layar Explore
│   │   └── index.tsx             # Layar Utama Katalog (FlatList + productList)
│   ├── components/
│   │   └── productCard.tsx       # Komponen Kartu Produk (External + Inline Style)
│   ├── constants/
│   │   ├── styles.ts             # External StyleSheet (Tema Kecap Mringin)
│   │   └── theme.ts              # Variabel tema & warna
│   ├── functions/
│   │   └── productActions.ts     # Custom Action Function (Alert handler)
│   └── types/
│       └── product.ts            # Type & Interface Product
├── package.json
└── tsconfig.json
```
