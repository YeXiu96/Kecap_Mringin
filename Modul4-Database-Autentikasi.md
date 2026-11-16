# PEMROGRAMAN MOBILE — MODUL 4: DATABASE & AUTENTIKASI

**Versi:** 3.0 — Agustus 2026
**Penulis:** Eko Felix Nur Noftianto, M.Kom. · Fatahillah Al-Fatih · Wira Yudha Aji Pratama
**Laboratorium Informatika — Universitas Muhammadiyah Malang**

---

## PENDAHULUAN

### 1. Tujuan
1. Memahami mekanisme penyimpanan di sisi klien dan kompromi keamanan spesifik pada perangkat seluler.
2. Menguasai siklus hidup otentikasi (pendaftaran, login, sesi persisten, logout) di React Native.
3. Menghubungkan klien seluler Expo ke basis data cloud (PostgreSQL/Supabase) dengan Row Level Security (RLS) yang ketat.
4. Mengimplementasikan otentikasi yang secara dinamis melindungi rute menggunakan Expo Router.

### 2. Target Modul
1. Mampu menyimpan token dan kredensial sensitif dengan aman di iOS/Android menggunakan `expo-secure-store`.
2. Mampu melakukan kueri CRUD asinkron yang aman secara tipe terhadap basis data cloud jarak jauh.
3. Mampu membangun `AuthContext` global yang secara otomatis memulihkan sesi saat aplikasi diluncurkan dan menangani perlindungan rute.

### 3. Persiapan
1. Node.js LTS dan Expo CLI (kompatibel dengan SDK 54).
2. Instan proyek Supabase yang telah dikonfigurasi (URL dan Anon Key).
3. Perangkat seluler aktif atau emulator yang menjalankan Expo Go.
4. Proyek Modul 3 telah diselesaikan menggunakan Expo Router dan TypeScript.

### 4. Kata Kunci
`AsyncStorage`, `Expo SecureStore`, `Expo SQLite`, `Cloud Database`, `Supabase`, `Row Level Security (RLS)`, `Sesi JWT`, `AuthContext`, `Rute yang Dilindungi`.

---

## MATERI

Modul ini menambahkan **peningkatan memori** dan **keamanan tingkat perusahaan** pada aplikasi:
1. Menyimpan token rahasia dengan aman di brankas yang dienkripsi secara hardware.
2. Menghubungkan aplikasi ke database PostgreSQL cloud melalui Supabase.
3. Mengelola otentikasi JWT.
4. Menyiapkan pengaman rute (route guard) agar pengguna belum terautentikasi tidak bisa masuk ke layar privat.

---

### 1. Penyimpanan Lokal & Keamanan Perangkat

#### 1.1 Penyimpanan Async vs Expo SecureStore

| Jenis Penyimpanan | Di Balik Layar | Tingkat Keamanan | Paling Cocok Digunakan Untuk |
|---|---|---|---|
| **AsyncStorage** | Kunci-Nilai Tanpa Enkripsi SQLite | Teks Biasa | Tema UI, teks draf, cache pencarian |
| **Expo SecureStore** | Keychain iOS & Keystore Android | Terkunci Perangkat Keras | Token akses JWT, kunci pribadi, kata sandi pengguna |
| **Expo SQLite** | Database Relasional Lokal SQLite | File Terstruktur | Database offline besar, riwayat misi di cache |

> **Aturan Praktis Penting:** Jangan pernah menyimpan token otentikasi atau kata sandi di `AsyncStorage`. Selalu gunakan `expo-secure-store` untuk data sensitif.

#### 1.2 Penyimpanan Kredensial Aman (Expo SecureStore)

```ts
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "hiro_user_token";

// 1. Save an encrypted token
export async function saveAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

// 2. Retrieve the token on app startup
export async function getAuthToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

// 3. Remove on logout
export async function deleteAuthToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
```

#### 1.3 Penyimpanan Offline Terstruktur (Expo SQLite)

```ts
import * as SQLite from "expo-sqlite";

// 1. Open or create the local tactical SQLite database
const db = SQLite.openDatabaseSync("hiro_offline.db");

// 2. Initialize offline missions table
export function initLocalDatabase(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS cached_missions (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      reward INTEGER NOT NULL,
      status TEXT NOT NULL
    );
  `);
}

// 3. Insert or replace offline mission
export function cacheMission(
  id: string,
  title: string,
  reward: number,
  status: string
): void {
  db.runSync(
    "INSERT OR REPLACE INTO cached_missions (id, title, reward, status) VALUES (?, ?, ?, ?)",
    [id, title, reward, status]
  );
}
```

---

### CODELAB 1: Brankas Terenkripsi (Penyimpanan Token Persisten)

**Tujuan:** Buat komponen pengelola kredensial aman untuk menyimpan, mengambil, dan menghapus Token Lisensi Hero yang terenkripsi saat aplikasi dimuat ulang.

**Langkah Manual:**
1. Instal paket: `npx expo install expo-secure-store`
2. Buat komponen `asset/SecureVaultDemo.tsx` dari template yang disediakan, lengkapi metode `expo-secure-store` yang belum ada.
3. Terapkan metode save / load / delete token.

**Verifikasi:**
- Save Token → muncul value tersimpan.
- Load Token → value yang sama muncul kembali dari storage.
- Wipe Token → status "No token found in storage".

**Langkah Vibe Code (opsional, pakai AI):**
1. Install dependency yang sama.
2. Gunakan template `SecureVaultDemo.tsx` yang sama — jangan minta AI membuat ulang dari nol.
3. Buat Prompt Specification Document (PSD) sebelum prompting AI, contoh:
   - FEATURE: Secure Token Storage
   - FILE: `asset/SecureVaultDemo.tsx`
   - OBJECTIVE: lengkapi fungsi save/get/delete token via `expo-secure-store`
   - REQUIREMENTS: token aman, dapat disimpan/diambil/dihapus, tetap ada setelah reload, tidak boleh pakai AsyncStorage
   - EXISTING CODE: jangan ubah struktur template kecuali untuk melengkapi fungsi kosong
4. **Audit hasil AI** — periksa:
   - [ ] Menggunakan `expo-secure-store`
   - [ ] Token dapat disimpan
   - [ ] Token dapat diambil
   - [ ] Token dapat dihapus
   - [ ] Tidak menggunakan `AsyncStorage`
   - [ ] Struktur kode sesuai template
5. Uji dengan skenario verifikasi yang sama seperti metode manual.

---

### 2. Database Cloud & Backend Real-Time

#### 2.1 PostgreSQL untuk Mobile
Supabase = alternatif open-source Firebase di atas PostgreSQL: API RESTful instan, otentikasi bawaan, WebSocket real-time, tanpa membangun backend sendiri.

#### 2.2 Membangun Adapter Penyimpanan
SDK `@supabase/supabase-js` awalnya dibuat untuk browser (`window.localStorage`), yang tidak tersedia di React Native. Solusinya: adaptor kustom ke `expo-secure-store`.

```ts
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) =>
    SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};
```

---

### CODELAB 2: Cloud Bridge & Pemeriksaan Kesehatan Sistem

**Tujuan:** Konfigurasikan singleton klien Supabase di `lib/supabase.ts`, verifikasi konektivitas ke cloud.

**Langkah Manual:**
1. Instal dependensi: `npx expo install @supabase/supabase-js expo-secure-store`
2. Buat file `.env` di root proyek:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Dapatkan URL & Anon Key dari dashboard Supabase project kamu sendiri (jangan di-generate/ditebak AI).
4. Buat `lib/supabase.ts` dengan klien singleton Supabase, pakai `ExpoSecureStoreAdapter` untuk session storage.

**Verifikasi:** Di `app/index.tsx`, `console.log("Supabase URL:", supabase.supabaseUrl)`. URL muncul tanpa error → sudah terhubung.

**Langkah Vibe Code — PSD contoh:**
```
FEATURE: Supabase Cloud Client
FILE: lib/supabase.ts
OBJECTIVE: Membuat centralized/singleton Supabase client untuk aplikasi Expo.
DEPENDENCIES: @supabase/supabase-js, expo-secure-store
CONFIGURATION: URL & Anon Key dari environment variable
REQUIREMENTS:
1. Gunakan environment variable.
2. Satu client dipakai di seluruh aplikasi.
3. Gunakan SecureStore untuk session.
4. Jangan hardcode credential.
5. Pertahankan struktur template.
VERIFICATION: Supabase URL dapat diakses dari aplikasi tanpa error.
```

**Audit hasil AI:**
- [ ] Dependency benar
- [ ] `.env` digunakan
- [ ] URL tidak hardcode
- [ ] Anon Key tidak hardcode
- [ ] Supabase client terpusat (singleton)
- [ ] SecureStore digunakan sesuai kebutuhan
- [ ] Tidak membuat backend tambahan
- [ ] Verifikasi ulang dengan skenario manual

---

### 3. Autentikasi & Identitas Pengguna

Mobile menggunakan **JWT** (bukan cookie browser):
- **Token Akses (JWT):** kredensial berumur pendek untuk membuktikan identitas per-request.
- **Token Refresh:** kredensial jangka panjang disimpan aman di perangkat, untuk meminta token akses baru tanpa login ulang.

#### 3.1 Alur Pendaftaran vs Masuk

**A. Pendaftaran (Sign Up)**
```ts
const { data, error } = await supabase.auth.signUp({
  email: "shadow.operative@hiro.command",
  password: "TacticalPassword2026!",
  options: {
    data: {
      callsign: "Shadow operative",
      role: "hero", // 'hero' | 'citizen'
    },
  },
});
```
> Default: Supabase mengirim email konfirmasi. Untuk lab/testing, matikan "Confirm email" di Dashboard Supabase → Authentication → Sign In/Providers → Email.

**B. Masuk (Sign In)**
```ts
const { data, error } = await supabase.auth.signInWithPassword({
  email: "shadow.operative@hiro.command",
  password: "TacticalPassword2026!",
});

if (error) {
  console.error("Access Denied:", error.message);
} else {
  console.log("Authenticated User ID:", data.user.id);
  console.log("Active Session Token:", data.session.access_token);
}
```

**C. Keluar (Sign Out)**
```ts
await supabase.auth.signOut();
```

#### 3.2 Validasi Formulir & UX

Tiga aturan emas form otentikasi React Native:
1. **`.trim()` email/username** — hilangkan spasi tak terlihat dari autocomplete keyboard.
   ```ts
   const cleanEmail = email.trim();
   ```
2. **Atur keyboard** — `keyboardType="email-address"`, `autoCapitalize="none"`, `autoCorrect={false}`.
3. **Loading state UX** — pasangkan tombol dengan `<ActivityIndicator />` dan nonaktifkan interaksi saat `loading === true` untuk mencegah submit ganda.

---

### CODELAB 3: Perekrutan Pahlawan (Alur Pendaftaran & Masuk)

**Tujuan:** Hubungkan `app/(auth)/login.tsx` ke endpoint Supabase Auth. Implementasikan alur ganda (daftar vs masuk), sanitasi input, metadata `callsign`, dan error handling.

**Persiapan (matikan email confirmation untuk testing):**
1. Dashboard Supabase → Authentication → Sign In / Providers.
2. Matikan toggle "Confirm email" → Save changes.
3. User baru bisa langsung login tanpa menunggu email.

**Langkah Manual:**
1. Buka `app/(auth)/login.tsx` — UI, styling, dan state hooks (`email`, `password`, `callsign`, `isRegistering`) sudah tersedia di template.
2. Lengkapi logika inti di dalam `handleAuth` — isi bagian `/* ??? */` dengan pemanggilan Supabase Auth yang sesuai.

**Langkah Vibe Code:**
1. Gunakan template yang sama, jangan ganti seluruh halaman login dengan hasil AI baru.
2. Analisis relasi state `isRegistering` → `true` = Register (signUp), `false` = Login (signInWithPassword).
3. Buat PSD untuk `handleAuth`, contoh struktur:
   ```
   FEATURE: Supabase Authentication
   FILE: app/(auth)/login.tsx
   FUNCTION: handleAuth
   AVAILABLE STATE: email, password, callsign, isRegistering

   REGISTER MODE: gunakan email, password, callsign (metadata) → signUp
   LOGIN MODE: gunakan email, password → signInWithPassword

   ERROR: tangani error dari Supabase, tampilkan ke user, jangan crash
   UX: tampilkan loading saat request, cegah multiple submission
   SUCCESS: user authenticated → arahkan ke Command Center

   CONSTRAINT: gunakan template yang tersedia, jangan ubah UI, implementasikan logic hanya di handleAuth
   ```
4. Minta AI: analisis state → implementasikan logic → jelaskan bagian yang diubah.

**Audit hasil (checklist):**
- [ ] Register menggunakan `signUp`
- [ ] Login menggunakan `signInWithPassword`
- [ ] `callsign` dikirim sebagai metadata
- [ ] Error ditangani (tidak crash)
- [ ] Loading state ditangani
- [ ] Multiple submission dicegah
- [ ] UI template tidak rusak/diubah
- [ ] Tidak ada password yang disimpan manual

**Pemeriksaan Verifikasi (uji di Expo Go / Web):**
1. **Uji Pendaftaran** — isi email, callsign (mis. `ShadowRunner`), password ≥6 karakter → "Daftar sebagai Pahlawan" → notifikasi berhasil.
2. **Uji Error Handling** — login dengan password salah → pesan "Kredensial login tidak valid" tanpa crash.
3. **Uji Login Berhasil** — kredensial benar → "Authenticate & Enter HQ" → masuk ke `app/(app)/index.tsx`.
4. Cek Dashboard Supabase → Authentication → Users: akun baru muncul.

---

### 4. Status Autentikasi Global & Rute Terlindung

Jika tiap layar mendekripsi SecureStore sendiri-sendiri → kode berantakan, kondisi balapan (race condition). Solusi: **React Context (`AuthContext`)** sebagai markas komando pusat:
1. **Rehidrasi otomatis saat startup** — cek token tersimpan via Supabase.
2. **Penyiar event real-time** — subscribe `supabase.auth.onAuthStateChange()`; broadcast ke seluruh app saat login/logout/token refresh.

#### 4.1 Mengelola Sesi dengan AuthContext
```ts
// Listening for live changes across the app
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth Event Fired:", event); // 'SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED'
  setUser(session?.user ?? null);
});
```

#### 4.2 Navigation Guards & Segmen Rute
Gunakan `useSegments()` dari Expo Router di `_layout.tsx` root sebagai pemindai keamanan:
- Belum login + coba akses layar privat → redirect ke `/(auth)/login`.
- Sudah login + masih di layar login → redirect ke `/` (Markas Taktis).
- Saat masih memeriksa sesi (`isLoading === true`) → tampilkan `<ActivityIndicator />`, jangan redirect dulu (hindari flicker).

---

### CODELAB 4: Penjaga Gerbang (AuthContext & Tata Letak Akar yang Dilindungi)

**Tujuan:** Bangun `AuthProvider` pusat untuk menyiarkan update sesi real-time, dan bangun route guard di `app/_layout.tsx`.

**Langkah Manual:**
1. **Selesaikan AuthContext** — lengkapi metode sinkronisasi sesi yang hilang (`/* ??? */`) pada template yang disediakan.
2. **Buat Route Guard di `app/_layout.tsx`** — bungkus app dengan `AuthProvider`, gunakan `useSegments()` untuk cek rute aktif.

**Langkah Vibe Code:**

PSD untuk AuthContext:
```
FEATURE: Global Authentication Context
FILE: AuthContext
EXISTING TEMPLATE: AuthContext sudah tersedia, beberapa bagian kosong.
REQUIREMENTS:
1. Periksa session ketika aplikasi pertama kali dijalankan.
2. Simpan status loading selama proses pemeriksaan.
3. Simpan informasi user ketika authenticated.
4. Tangani keadaan ketika user tidak authenticated.
5. Dengarkan perubahan authentication session.
6. Update state ketika session berubah.
EXPECTED STATE: loading, user, session
CONSTRAINT: gunakan template yang diberikan, jangan membuat sistem authentication baru, gunakan Supabase session
```

PSD untuk Route Guard:
```
FEATURE: Protected Navigation
FILE: app/_layout.tsx
AUTH STATE: loading, authenticated, unauthenticated
ROUTE: /(auth), /(app)

RULE 1: Jika masih loading → jangan redirect
RULE 2: Jika belum login & mencoba akses area aplikasi → arahkan ke /(auth)/login
RULE 3: Jika sudah login tapi berada di halaman login → arahkan ke /(app)
RULE 4: Jika logout → kembali ke /(auth)/login

REQUIREMENT: Gunakan AuthProvider dan useSegments()
CONSTRAINT: Gunakan template yang telah disediakan
```

**Audit hasil (checklist):**
- [ ] `AuthProvider` digunakan
- [ ] `useSegments()` digunakan
- [ ] Loading state ditangani
- [ ] User belum login tidak dapat masuk ke app
- [ ] User sudah login tidak kembali ke halaman login
- [ ] Logout mengunci kembali aplikasi (redirect ke login)

**Verifikasi:**
1. **Cold Start (belum terotentikasi)** — buka app → otomatis redirect ke `/auth/login`.
2. **Redirect otomatis ke Command HQ** — login sukses → otomatis masuk ke `/` tanpa navigasi manual.
3. **Uji Ketahanan Sesi** — refresh / reload app → tetap login (tidak kembali ke layar login), karena token tersimpan di secure storage.
4. **Uji Keamanan Keluar** — klik "Sign Out" → sesi terhapus, redirect otomatis ke `/(auth)/login`.

---

### 5. Operasi Cloud Langsung & Perlindungan di Sisi Server

#### 5.1 Berkomunikasi dengan Postgres Cloud

**A. Membaca Data (SELECT)**
```ts
// 1.1 Types & Interfaces
export interface Mission {
  id: string;
  user_id: string;
  title: string;
  reward_points: number;
  status: 'pending' | 'completed';
  created_at: string;
}

// 2.1 Fetch data from Supabase
const { data, error } = await supabase
  .from('missions')
  .select('*')
  .order('created_at', { ascending: false });

// 2.2 Error handling & logging
if (error) {
  console.log('Failed to fetch missions:', error.message);
} else {
  console.log('Missions loaded:', data); // typed as Mission[]
}
```

**B. Menulis Data (INSERT)**
```ts
// 1. Insert new mission into Supabase
const { data, error } = await supabase
  .from('missions')
  .insert([
    {
      title: 'Intercept Rogue Signal at Sector 7',
      reward_points: 150,
      user_id: user.id, // current authenticated hero ID
    },
  ])
  .select(); // return the newly created row immediately

// 2. Handle response & errors
if (error) {
  console.log('Failed to create mission:', error.message);
} else {
  console.log('Mission created successfully:', data);
}
```

#### 5.2 Keamanan Tingkat Baris (RLS): Penjaga Awan

Masalah: `EXPO_PUBLIC_SUPABASE_ANON_KEY` ada dalam teks biasa di `.env` / APK. **RLS (Row Level Security)** yang menyelamatkan — analogi apartemen:
- **Anon Key** = pintu kaca lobi (siapa saja bisa masuk).
- **Baris database** = kamar pribadi.
- **Kebijakan RLS** = pemindai biometrik di pintu kamar — hanya terbuka jika `auth.uid()` (JWT) cocok dengan pemilik baris.

Jika user tak berwenang `SELECT * FROM missions` → Postgres cek token → tolak → kembalikan array kosong `[]`. Tidak ada data bocor.

**Setup RLS:** Dashboard Supabase → SQL Editor → jalankan skrip pembuatan tabel `missions` + aktivasi RLS + policy isolasi per `user_id` (skrip disediakan terpisah oleh pengajar — lihat link "skrip" pada modul asli).

---

### CODELAB 5: Papan Misi Taktis (Mengambil & Membuat Misi Cloud)

**Tujuan:** Buat dasbor taktis di `app/(app)/index.tsx` dengan CRUD PostgreSQL lengkap, pull-to-refresh, Optimistic UI, dan isolasi data via RLS real-time.

**Langkah Manual:**

**Langkah 1 — Deploy Skema Database & RLS (SQL Editor Supabase):**
1. Buka Dashboard Supabase → pilih proyek.
2. Buka SQL Editor → "New query".
3. Tempel skrip SQL (dari materi/pengajar) yang mencakup:
   - `CREATE TABLE missions (...)` dengan `id`, `user_id REFERENCES auth.users`, `title`, `reward_points`, `status`, `created_at`.
   - `ALTER TABLE missions ENABLE ROW LEVEL SECURITY;`
   - Policy CRUD yang membatasi akses hanya untuk `auth.uid() = user_id`.
4. Klik **Run**.

**Langkah 2 — Implementasikan `app/(app)/index.tsx`:**
Lengkapi kueri CRUD Supabase yang masih kosong (`/* ??? */`): SELECT, INSERT, UPDATE, DELETE, pull-to-refresh, optimistic UI update, loading & error state.

**Langkah Vibe Code:**

1. **Deploy Database & RLS** — tetap dikerjakan manual (dilihat & dipahami langsung di Table → RLS Policy → Database Security), AI hanya boleh *menjelaskan* SQL, bukan menuliskannya. Contoh prompt penjelasan:
   ```
   Jelaskan SQL berikut.
   Saya ingin memahami:
   1. tabel apa yang dibuat;
   2. kolom apa saja yang tersedia;
   3. siapa yang boleh SELECT;
   4. siapa yang boleh INSERT;
   5. bagaimana auth.uid() digunakan;
   6. bagaimana RLS mengisolasi data antar-user.
   Jangan ubah SQL. Fokus hanya menjelaskan cara kerjanya.
   ```
2. **Implementasi dashboard** — buat PSD:
   ```
   FEATURE: Tactical Mission Dashboard
   FILE: app/(app)/index.tsx
   DATABASE: missions

   READ: ambil mission milik user yang sedang login
   CREATE: buat mission baru, user_id harus dari user yang authenticated
   REFRESH: dukung pull-to-refresh
   OPTIMISTIC UI: update UI dulu, rollback/error handling jika gagal
   SECURITY: ikuti RLS, user tidak boleh lihat mission user lain
   ERROR: tampilkan kondisi error, aplikasi tidak boleh crash
   LOADING: tampilkan loading state saat fetch

   CONSTRAINT: gunakan template index.tsx, gunakan Supabase, jangan buat backend baru
   ```

**Audit hasil vibe coding (checklist sebelum verifikasi):**
- Database
  - [ ] Table `missions` digunakan
  - [ ] Supabase digunakan
- Authentication
  - [ ] User yang sedang login digunakan
  - [ ] Data dikaitkan dengan `user_id` yang benar
- CRUD
  - [ ] SELECT bekerja
  - [ ] INSERT bekerja
  - [ ] UPDATE bekerja (jika tersedia)
  - [ ] DELETE bekerja (jika tersedia)
- UX
  - [ ] Loading state
  - [ ] Error handling
  - [ ] Pull-to-refresh
- Optimistic UI
  - [ ] UI merespons cepat
  - [ ] Kegagalan operasi ditangani (rollback)
- Security
  - [ ] RLS aktif
  - [ ] User A tidak dapat melihat data User B

**Uji Verifikasi Multi-Akun:**
1. **Buat misi di Akun A** — login akun utama (mis. `shadow@hiro.command`), buat 2 misi ("Patrol Perimeter Node", "Deliver Field Supplies"), lihat muncul dengan status pending.
2. **Keluar & daftar Akun B** — logout, daftar agen baru (`cyber_hawk@hiro.command`, callsign `CyberHawk`), login.
3. **Verifikasi isolasi data penuh** — pastikan misi Akun A **tidak** muncul di Akun B (array kosong). Tambah misi baru untuk Akun B ("Kalibrasi Piringan Radar"). Logout → login kembali ke Akun A → pastikan data kedua akun tetap terpisah sepenuhnya.

Jika lolos pengujian ini → Multitenancy tingkat perusahaan dengan Row Level Security berhasil diterapkan pada aplikasi mobile.

---

## TUGAS MINGGU DEMO

### 1. Deskripsi
1. **Bentuk kelompok & pilih tema**
   - Kelompok 3 anggota, pilih tema proyek unik (first-come-first-served per kelas) lewat tautan pendaftaran dari pengajar.
   - Proyek dikembangkan bersama di rumah berdasarkan tema tersebut.
   - Wajib pakai GitHub agar kontribusi tiap anggota (distribusi beban kerja) dapat dicek.
   - Tugas ini berlanjut dari Modul 1–6; proyek modul sebelumnya harus tetap berfungsi (akan dicek ulang di akhir kursus).
2. **Buat aplikasi bersama-sama**
   - Terapkan semua materi Modul 4 ke dalam satu aplikasi berfungsi sesuai tema kelompok.
   - Implementasi bebas ditempatkan di mana saja dalam kode, asal masuk akal dan benar.
   - Tidak wajib build — boleh pakai Expo Go (`npx expo start --go`).
3. **Saat demo nanti**
   - Tunjukkan hasil kerja ke asisten lab (individual).
   - Jawab pertanyaan dari asisten lab.
   - Modifikasi kode secara langsung sesuai permintaan asisten lab (live coding).

### 2. Kriteria Penilaian

| Assessment Criteria | Weight |
|---|---|
| **Codelab 1–5** | 40% |
| **Assignment** | 60% |
| — Secure Token Storage | 5% |
| — Supabase Auth Flow (Sign Up, Sign In, Sign Out, Loading States) | 10% |
| — Global AuthContext & Real-time Session Subscription | 5% |
| — Route Protection Guards | 5% |
| — Answer Question | 15% |
| — Completing Challenge (live code 5-min) | 20% |
| **TOTAL** | **100%** |

### 3. Rentang Penilaian
Skala 0–100: **0 = Zonk** (not learning, not good) · **25** · **50 = Half** (half of a half) · **75 = Ok** · **100 = Well done!** (learning, good).

---

## Kesimpulan Modul
Modul 4 mencakup: penyimpanan lokal aman vs tidak aman (SecureStore vs AsyncStorage vs SQLite), koneksi aplikasi Expo ke database cloud PostgreSQL via Supabase, siklus otentikasi JWT penuh (sign up/in/out), `AuthContext` global dengan rehidrasi sesi otomatis, route guard berbasis segmen navigasi, operasi CRUD langsung ke Postgres, dan keamanan Row Level Security untuk isolasi data antar-pengguna.
