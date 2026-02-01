import type { User } from './auth';

export type Wilayah = {
    id: number;
    nama_wilayah: string;
    kecamatan: string;
    geojson: string | null;
    latitude?: number | null;
    longitude?: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    kampung?: Kampung[];
};

export type Kampung = {
    id: number;
    wilayah_id: number;
    nama_kampung: string;
    latitude?: number | null;
    longitude?: number | null;
    urutan_rute?: number;
    status: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export type Armada = {
    id: number;
    petugas_id?: number | null;
    wilayah_id?: number | null;
    kode_armada: string;
    jenis_kendaraan: string;
    plat_nomor: string;
    kapasitas: number;
    status: 'aktif' | 'perbaikan' | 'nonaktif';
    tahun_pembuatan?: number | null;
    merk?: string | null;
    nomor_rangka?: string | null;
    nomor_mesin?: string | null;
    tanggal_stnk?: string | null;
    tanggal_keur?: string | null;
    bahan_bakar?: string | null;
    konsumsi_bahan_bakar?: number | null;
    lokasi_parkir?: string | null;
    asuransi?: string | null;
    kontrak_sewa?: string | null;
    keterangan?: string | null;
    is_available?: boolean;
    created_at: string;
    updated_at: string;
    leader?: Petugas;
};

export type JadwalRutinItem = {
    id: number;
    armada_id: number;
    hari: number;
    kampung?: Kampung[];
};

export type ArmadaAnggota = {
    id: number;
    armada_id: number;
    nama: string;
    no_hp?: string | null;
    urutan?: number;
};

export type Petugas = {
    id: number;
    user_id: number;
    wilayah_id: number | null;
    is_available: boolean;
    hari_libur?: number[] | null;
    created_at: string;
    updated_at: string;
    user?: User;
    armada?: Armada & { jadwal_rutin?: JadwalRutinItem[]; jadwalRutin?: JadwalRutinItem[] };
    wilayah?: Wilayah;
};

export type PengajuanPengangkutan = {
    kampung_id?: number | null;
    id: number;
    user_id: number | null;
    nama_pemohon?: string | null;
    no_telepon?: string | null;
    email?: string | null;
    ip_address?: string | null;
    wilayah_id: number | null;
    alamat_lengkap: string;
    latitude: number | null;
    longitude: number | null;
    estimasi_volume: string | null;
    foto_sampah: string | null;
    status: 'diajukan' | 'diverifikasi' | 'dijadwalkan' | 'diangkut' | 'selesai' | 'ditolak';
    created_at: string;
    updated_at: string;
    user?: User;
    wilayah?: Wilayah;
    kampung?: Kampung;
    penugasan?: Penugasan[];
    riwayat_status?: RiwayatStatus[];
    lampiran?: Lampiran[];
};

export type Aduan = {
    id: number;
    user_id: number;
    kategori: string;
    deskripsi: string;
    foto_bukti: string | null;
    latitude: number | null;
    longitude: number | null;
    status: 'masuk' | 'diproses' | 'ditindak' | 'selesai' | 'ditolak';
    tindak_lanjut?: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    riwayat_status?: RiwayatStatus[];
    lampiran?: Lampiran[];
};

export type Penugasan = {
    id: number;
    pengajuan_id: number;
    petugas_id: number;
    armada_id: number | null;
    jadwal_angkut: string;
    status: 'aktif' | 'selesai' | 'batal';
    tindak_lanjut?: string | null;
    total_sampah_terangkut?: number | null;
    created_at: string;
    updated_at: string;
    pengajuan_pengangkutan?: PengajuanPengangkutan;
    petugas?: Petugas;
    armada?: Armada;
};

export type RiwayatStatus = {
    id: number;
    ref_type: 'pengajuan' | 'aduan';
    ref_id: number;
    status: string;
    keterangan: string | null;
    changed_by: number;
    created_at: string;
    updated_at: string;
    changed_by_user?: User;
};

export type Notifikasi = {
    id: number;
    user_id: number;
    judul: string;
    pesan: string;
    channel: 'web' | 'email' | 'wa' | 'push';
    is_read: boolean;
    created_at: string;
    updated_at: string;
};

export type Lampiran = {
    id: number;
    ref_type: 'pengajuan' | 'aduan';
    ref_id: number;
    file_path: string;
    file_type: string | null;
    uploaded_at: string;
};
