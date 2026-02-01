# PUPUT - Pusat Pengelolaan Sampah Terpadu

Sistem manajemen pengangkutan sampah berbasis web untuk Kabupaten Tasikmalaya. Aplikasi ini memfasilitasi koordinasi antara warga, petugas lapangan, dan administrator dalam pengelolaan sampah yang efisien dan terstruktur.

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2.0-9553E9?style=flat-square&logo=inertia&logoColor=white)

---

## Daftar Isi

- [Tech Stack](#tech-stack)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Fitur per Role](#fitur-per-role)
- [Alur Kerja Utama](#alur-kerja-utama)
- [Database Schema](#database-schema)
- [Sistem Notifikasi](#sistem-notifikasi)
- [Instalasi](#instalasi)
- [Struktur Folder](#struktur-folder)
- [Testing](#testing)

---

## Tech Stack

### Backend

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| PHP | 8.2+ | Runtime |
| Laravel | 12 | Framework utama |
| Laravel Fortify | 1.x | Authentication + Two-Factor Auth |
| Inertia.js | 2.0 | Server-driven SPA adapter |
| Laravel Wayfinder | 0.1.x | TypeScript route generation |
| Laravel Queue | - | Asynchronous job processing (email) |
| DomPDF | 3.x | PDF generation |
| Maatwebsite Excel | 3.x | Excel export |

### Frontend

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| React | 19 | UI library |
| TypeScript | 5.7 | Type-safe JavaScript |
| Tailwind CSS | 4.0 | Utility-first CSS |
| Radix UI | - | Accessible UI primitives |
| Recharts | 3.x | Data visualization |
| Leaflet | 1.9 | Interactive maps |
| Lucide React | - | Icon library |
| Framer Motion | 12.x | Animations |

---

## Arsitektur Sistem

### Role-Based Access Control

```
┌─────────────────────────────────────────────────────────────────┐
│                         PUPUT System                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────┐   ┌──────────┐   ┌─────────┐   ┌─────────┐       │
│   │  Admin  │   │ Petugas  │   │  Warga  │   │  Guest  │       │
│   └────┬────┘   └────┬─────┘   └────┬────┘   └────┬────┘       │
│        │             │              │             │             │
│        ▼             ▼              ▼             ▼             │
│   ┌─────────────────────────────────────────────────────┐      │
│   │              Laravel + Inertia.js                   │      │
│   │         (Authentication & Authorization)            │      │
│   └─────────────────────────────────────────────────────┘      │
│        │             │              │             │             │
│        ▼             ▼              ▼             ▼             │
│   ┌─────────────────────────────────────────────────────┐      │
│   │                  React Frontend                     │      │
│   │          (Role-based UI & Components)               │      │
│   └─────────────────────────────────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Alur Data Pengajuan Sampah

```
┌──────────────┐     ┌─────────────────┐     ┌───────────────┐
│ Warga/Guest  │────▶│   Pengajuan     │────▶│  Auto-Assign  │
│   Submit     │     │   Dibuat        │     │   Service     │
└──────────────┘     └─────────────────┘     └───────┬───────┘
                                                     │
                     ┌───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Cocok Jadwal Rutin?   │
        └───────────┬────────────┘
                    │
           ┌────────┴────────┐
           │ Ya              │ Tidak
           ▼                 ▼
    ┌─────────────┐   ┌─────────────┐
    │ Auto-Assign │   │   Manual    │
    │  Petugas    │   │   Assign    │
    └──────┬──────┘   └──────┬──────┘
           │                 │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │    Penugasan    │
           │    Dibuat       │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │ Petugas Update  │
           │    Status       │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │    Selesai /    │
           │    Ditolak      │
           └─────────────────┘
```

---

## Fitur per Role

### Admin

| Modul | Fitur |
|-------|-------|
| **Dashboard** | Analytics, grafik performa, statistik harian/mingguan/bulanan, laporan |
| **Wilayah** | CRUD wilayah/desa, GeoJSON boundary, koordinat pusat |
| **Kampung** | CRUD kampung/dusun per wilayah, urutan rute |
| **Petugas** | CRUD petugas, assign wilayah, atur hari libur, buat akun user |
| **Armada** | CRUD armada/kendaraan, assign leader petugas, kelola anggota |
| **Jadwal Rutin** | Atur jadwal pengangkutan rutin per armada per hari per kampung |
| **Pengajuan** | List pengajuan, verifikasi, assign petugas manual, update status |
| **Aduan** | List aduan, proses, update status, catat tindak lanjut |
| **Notifikasi** | Terima notifikasi pengajuan/aduan baru |
| **Export** | Export data ke Excel, PDF, CSV |

### Petugas

| Modul | Fitur |
|-------|-------|
| **Dashboard** | KPI (tugas aktif, sampah terkumpul, completion rate), jadwal rutin, tugas hari ini |
| **Penugasan** | List tugas, filter status/tanggal/wilayah, update status |
| **Peta** | Visualisasi lokasi tugas, rute pengangkutan |
| **Update Status** | Quick update status pengajuan |
| **Riwayat** | Histori tugas selesai/batal |
| **Pengajuan** | View pengajuan di wilayah kerja |
| **Aduan** | View aduan terkait kinerja |
| **Notifikasi** | Terima notifikasi penugasan baru |

### Warga

| Modul | Fitur |
|-------|-------|
| **Dashboard** | Ringkasan pengajuan & aduan, statistik personal |
| **Pengajuan** | Buat pengajuan baru, pilih lokasi di peta, upload foto, tracking status |
| **Aduan** | Buat aduan/keluhan, pilih kategori, tracking status |
| **Notifikasi** | Terima notifikasi update status |

### Guest (Tanpa Login)

| Fitur |
|-------|
| Submit pengajuan pengangkutan sampah |
| Isi data: nama, telepon, email, alamat, lokasi, estimasi volume, foto |
| Terima notifikasi via email (jika email diisi) |

---

## Alur Kerja Utama

### Alur Pengajuan Pengangkutan Sampah

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      ALUR PENGAJUAN PENGANGKUTAN                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [Warga/Guest]          [Sistem]              [Admin]      [Petugas]   │
│       │                    │                     │             │        │
│       │  Submit Form       │                     │             │        │
│       │───────────────────▶│                     │             │        │
│       │                    │                     │             │        │
│       │                    │  Auto-Assign?       │             │        │
│       │                    │◄───────────────────▶│             │        │
│       │                    │                     │             │        │
│       │                    │    Notifikasi       │             │        │
│       │                    │────────────────────▶│             │        │
│       │                    │                     │             │        │
│       │                    │    Notifikasi       │             │        │
│       │                    │────────────────────────────────▶│        │
│       │                    │                     │             │        │
│       │                    │                     │  Assign     │        │
│       │                    │                     │  Petugas    │        │
│       │                    │◄────────────────────│             │        │
│       │                    │                     │             │        │
│       │                    │    Notifikasi       │             │        │
│       │                    │────────────────────────────────▶│        │
│       │                    │                     │             │        │
│       │                    │                     │   Update    │        │
│       │                    │                     │   Status    │        │
│       │                    │◄───────────────────────────────│        │
│       │                    │                     │             │        │
│       │    Notifikasi      │                     │             │        │
│       │◄───────────────────│                     │             │        │
│       │                    │                     │             │        │
│       ▼                    ▼                     ▼             ▼        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Status Pengajuan

| Status | Deskripsi | Warna |
|--------|-----------|-------|
| `diajukan` | Pengajuan baru masuk | Biru |
| `diverifikasi` | Admin telah memverifikasi | Cyan |
| `dijadwalkan` | Petugas sudah di-assign | Indigo |
| `diangkut` | Proses pengangkutan berlangsung | Kuning |
| `selesai` | Pengangkutan selesai | Hijau |
| `ditolak` | Pengajuan ditolak | Merah |

### Alur Aduan

```
[Warga Submit] → [Admin Ternotifikasi] → [Admin Proses] → [Update Status] → [Warga Ternotifikasi] → [Selesai]
```

### Status Aduan

| Status | Deskripsi | Warna |
|--------|-----------|-------|
| `masuk` | Aduan baru masuk | Orange |
| `diproses` | Sedang ditangani | Biru |
| `ditindak` | Sudah ada tindakan | Indigo |
| `selesai` | Aduan selesai | Hijau |
| `ditolak` | Aduan ditolak | Merah |

### Kategori Aduan

- Sampah Menumpuk
- Bau Tidak Sedap
- Lokasi Tidak Terjangkau
- Kinerja Petugas
- Keterlambatan Pengangkutan
- Layanan Aplikasi
- Lainnya

---

## Database Schema

### Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATABASE SCHEMA                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐         ┌───────────┐         ┌──────────────┐           │
│  │  User    │────────▶│  Petugas  │────────▶│   Armada     │           │
│  │          │   1:1   │           │   1:1   │              │           │
│  └────┬─────┘         └─────┬─────┘         └──────┬───────┘           │
│       │                     │                      │                    │
│       │ 1:N                 │ N:1                  │ 1:N                │
│       ▼                     ▼                      ▼                    │
│  ┌──────────┐         ┌───────────┐         ┌──────────────┐           │
│  │Notifikasi│         │  Wilayah  │◀────────│ JadwalRutin  │           │
│  └──────────┘         └─────┬─────┘         └──────┬───────┘           │
│                             │                      │                    │
│       │ 1:N                 │ 1:N                  │ N:M                │
│       ▼                     ▼                      ▼                    │
│  ┌──────────────────┐ ┌───────────┐         ┌──────────────┐           │
│  │    Pengajuan     │ │  Kampung  │◀────────│JadwalRutin   │           │
│  │  Pengangkutan    │ │           │         │   Kampung    │           │
│  └────────┬─────────┘ └───────────┘         └──────────────┘           │
│           │                                                             │
│           │ 1:N                                                         │
│           ▼                                                             │
│  ┌──────────────────┐         ┌───────────────────┐                    │
│  │    Penugasan     │         │    RiwayatStatus  │                    │
│  │                  │         │    (Polymorphic)  │                    │
│  └──────────────────┘         └───────────────────┘                    │
│                                                                         │
│  ┌──────────────────┐         ┌───────────────────┐                    │
│  │      Aduan       │────────▶│     Lampiran      │                    │
│  │                  │         │    (Polymorphic)  │                    │
│  └──────────────────┘         └───────────────────┘                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Tabel Utama

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Data user dengan role (admin/petugas/warga) |
| `wilayah` | Data wilayah/desa dengan GeoJSON boundary |
| `kampung` | Data kampung/dusun per wilayah |
| `petugas` | Data petugas dengan relasi ke user dan wilayah |
| `armada` | Data armada/kendaraan dengan leader petugas |
| `armada_anggota` | Anggota armada (selain leader) |
| `jadwal_rutin` | Jadwal pengangkutan rutin per armada per hari |
| `jadwal_rutin_kampung` | Pivot: kampung mana yang dikunjungi per jadwal |
| `pengajuan_pengangkutan` | Data pengajuan dari warga/guest |
| `penugasan` | Assignment petugas ke pengajuan |
| `aduan` | Data aduan/keluhan dari warga |
| `notifikasi` | Notifikasi untuk user |
| `riwayat_status` | Histori perubahan status (polymorphic) |
| `lampiran` | File lampiran (polymorphic) |

---

## Sistem Notifikasi

### Trigger Notifikasi

| Event | Penerima | Channel | Deskripsi |
|-------|----------|---------|-----------|
| Pengajuan baru (warga) | Admin + Petugas di wilayah | Web | Notifikasi di dashboard |
| Pengajuan baru (guest) | Admin + Petugas di wilayah | Web | Notifikasi di dashboard |
| Aduan baru | Admin | Web | Notifikasi di dashboard |
| Status pengajuan berubah | Warga pemilik | Web | Jika punya akun |
| Status pengajuan berubah | Guest | Email | Jika ada email |
| Status aduan berubah | Warga pemilik | Web | Notifikasi di dashboard |
| Penugasan diberikan | Petugas | Web | Notifikasi tugas baru |

### Komponen Notifikasi

```
app/
├── Services/
│   └── NotificationService.php    # Service utama
├── Jobs/
│   └── SendEmailNotificationJob.php    # Queue job untuk email
├── Mail/
│   └── StatusUpdateMail.php    # Mailable
└── resources/views/mail/
    └── status-update.blade.php    # Template email
```

### Polling

Frontend menggunakan polling setiap 30 detik untuk mengecek notifikasi baru tanpa WebSocket.

---

## Instalasi

### Prerequisites

- PHP 8.2+
- Composer 2.x
- Node.js 18+
- npm/pnpm
- MySQL/PostgreSQL/SQLite

### Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd puput

# 2. Install PHP dependencies
composer install

# 3. Install Node dependencies
npm install

# 4. Setup environment
cp .env.example .env
php artisan key:generate

# 5. Konfigurasi database di .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=puput
# DB_USERNAME=root
# DB_PASSWORD=

# 6. Konfigurasi email di .env (untuk notifikasi guest)
# MAIL_MAILER=smtp
# MAIL_HOST=smtp.gmail.com
# MAIL_PORT=587
# MAIL_USERNAME=your-email@gmail.com
# MAIL_PASSWORD=your-app-password
# MAIL_ENCRYPTION=tls

# 7. Jalankan migrasi dan seeder
php artisan migrate --seed

# 8. Build frontend assets
npm run build

# 9. Jalankan aplikasi
composer run dev
```

### Development Mode

```bash
# Jalankan server, queue worker, dan Vite secara bersamaan
composer run dev

# Atau jalankan terpisah:
php artisan serve          # Backend server
php artisan queue:listen   # Queue worker
npm run dev                # Vite dev server
```

---

## Struktur Folder

```
puput/
├── app/
│   ├── Enums/                    # Enum classes
│   ├── Exports/                  # Excel export classes
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/            # Admin controllers
│   │   │   ├── Petugas/          # Petugas controllers
│   │   │   ├── Warga/            # Warga controllers
│   │   │   └── Guest/            # Guest controllers
│   │   ├── Middleware/           # Custom middleware
│   │   └── Requests/             # Form request validation
│   │       ├── Admin/
│   │       ├── Warga/
│   │       └── Guest/
│   ├── Jobs/                     # Queue jobs
│   ├── Mail/                     # Mailable classes
│   ├── Models/                   # Eloquent models
│   ├── Providers/                # Service providers
│   └── Services/                 # Business logic services
│       ├── AutoAssignService.php
│       └── NotificationService.php
│
├── database/
│   ├── factories/                # Model factories
│   ├── migrations/               # Database migrations
│   └── seeders/                  # Database seeders
│
├── resources/
│   ├── js/
│   │   ├── actions/              # Wayfinder generated (controller routes)
│   │   ├── routes/               # Wayfinder generated (named routes)
│   │   ├── components/           # Reusable React components
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   └── map/              # Map components (Leaflet)
│   │   ├── layouts/              # Layout components
│   │   │   ├── app/              # App layouts
│   │   │   └── auth/             # Auth layouts
│   │   ├── pages/                # Page components (Inertia)
│   │   │   ├── admin/            # Admin pages
│   │   │   ├── petugas/          # Petugas pages
│   │   │   ├── warga/            # Warga pages
│   │   │   ├── auth/             # Auth pages
│   │   │   └── settings/         # Settings pages
│   │   └── types/                # TypeScript types
│   │       └── models.ts         # Model type definitions
│   └── views/
│       └── mail/                 # Email templates
│
├── routes/
│   ├── web.php                   # Web routes
│   └── settings.php              # Settings routes
│
├── tests/
│   └── Feature/                  # Feature tests
│
└── public/
    └── images/                   # Public images
```

---

## Testing

### Menjalankan Tests

```bash
# Jalankan semua tests
php artisan test

# Jalankan test spesifik
php artisan test --filter=NotificationTest

# Jalankan dengan output verbose
php artisan test --compact
```

### Test Coverage

| Test File | Deskripsi |
|-----------|-----------|
| `DashboardTest.php` | Test akses dashboard per role |
| `GuestPengajuanTest.php` | Test submit pengajuan tanpa login |
| `JadwalRutinTest.php` | Test CRUD jadwal rutin |
| `NotificationTest.php` | Test sistem notifikasi |
| `PetugasDashboardTest.php` | Test dashboard petugas |

---

## Scripts

```bash
# Development
composer run dev          # Jalankan semua services
npm run dev               # Vite development server
npm run build             # Build production assets

# Linting & Formatting
composer run lint         # PHP CS Fixer (Pint)
npm run lint              # ESLint
npm run format            # Prettier

# Testing
composer run test         # Lint + test
php artisan test          # PHPUnit/Pest tests

# Type Checking
npm run types             # TypeScript type check

# Route Generation
php artisan wayfinder:generate    # Generate TypeScript routes
```

---

## Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/nama-fitur`)
3. Commit perubahan (`git commit -m 'Menambah fitur X'`)
4. Push ke branch (`git push origin feature/nama-fitur`)
5. Buat Pull Request

---

## Lisensi

MIT License

---

## Kontak

Untuk pertanyaan atau dukungan, silakan hubungi tim pengembang.

---

**PUPUT** - Pusat Pengelolaan Sampah Terpadu  
Kabupaten Tasikmalaya
