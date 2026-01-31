import { Head, Link, router } from '@inertiajs/react';
import { Calendar, ClipboardList, Trash2, User, TrendingUp } from 'lucide-react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import type { BreadcrumbItem } from '@/types';
import type { Penugasan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Kolektor', href: '/petugas/dashboard' },
];

type NotifikasiItem = {
    id: number;
    judul: string;
    pesan: string;
};

interface Props {
    penugasan_hari_ini: Penugasan[];
    penugasan_mendatang: Penugasan[];
    stats: { total_penugasan_aktif: number; penugasan_selesai: number };
    jumlah_tugas: number;
    sampah_terkumpul: number;
    performa: {
        menunggu: number;
        diproses: number;
        dalam_perjalanan: number;
        selesai: number;
        gagal: number;
    };
    chart_7_hari: Array<{ date: string; label: string; selesai: number; gagal: number }>;
    notifikasi: NotifikasiItem[];
}

export default function PetugasDashboard({
    penugasan_hari_ini,
    penugasan_mendatang,
    jumlah_tugas,
    sampah_terkumpul,
    performa,
    chart_7_hari,
    notifikasi,
}: Props) {
    const dismissNotifikasi = (id: number) => {
        router.patch(`/petugas/notifikasi/${id}/read`, {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Kolektor" />
            <div className="flex h-full flex-1 flex-col gap-6">
                <h1 className="text-center text-2xl font-bold text-green-700">Dashboard Kolektor</h1>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="rounded-xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2">
                                <ClipboardList className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-green-700">Jumlah Tugas</p>
                                <p className="text-3xl font-bold text-orange-500">{jumlah_tugas}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="rounded-xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2">
                                <Trash2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-green-700">Sampah Terkumpul</p>
                                <p className="text-3xl font-bold text-green-600">{sampah_terkumpul} Kg</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Performa Petugas */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700">
                            <User className="h-5 w-5" />
                            Performa Petugas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-orange-500">{performa.menunggu}</p>
                                <p className="text-sm text-muted-foreground">Menunggu</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-500">{performa.diproses}</p>
                                <p className="text-sm text-muted-foreground">Diproses</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-500">{performa.dalam_perjalanan}</p>
                                <p className="text-sm text-muted-foreground">Dalam Perjalanan</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{performa.selesai}</p>
                                <p className="text-sm text-muted-foreground">Selesai</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-500">{performa.gagal}</p>
                                <p className="text-sm text-muted-foreground">Gagal</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Chart + Notifikasi */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700">
                                <TrendingUp className="h-5 w-5" />
                                Penyelesaian Tugas 7 Hari Terakhir
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chart_7_hari}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="selesai"
                                            name="Tugas Selesai"
                                            stroke="#22c55e"
                                            fill="#22c55e"
                                            fillOpacity={0.3}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="gagal"
                                            name="Tugas Gagal"
                                            stroke="#ef4444"
                                            fill="#ef4444"
                                            fillOpacity={0.3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifikasi Admin */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                </svg>
                                Notifikasi Admin
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {notifikasi.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Tidak ada notifikasi</p>
                            ) : (
                                notifikasi.map((n) => (
                                    <div
                                        key={n.id}
                                        className="relative rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => dismissNotifikasi(n.id)}
                                            className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                                            aria-label="Tutup"
                                        >
                                            <span className="text-lg">&times;</span>
                                        </button>
                                        <p className="font-semibold text-amber-900 dark:text-amber-100">
                                            {n.judul}
                                        </p>
                                        <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                                            {n.pesan}
                                        </p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Penugasan Hari Ini - compact */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Penugasan Hari Ini ({penugasan_hari_ini.length})
                            </CardTitle>
                            <Link href="/petugas/penugasan">
                                <Button variant="outline" size="sm">
                                    Lihat Semua
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {penugasan_hari_ini.length > 0 ? (
                            <div className="space-y-2">
                                {penugasan_hari_ini.slice(0, 3).map((p) => (
                                    <Link
                                        key={p.id}
                                        href={`/petugas/penugasan/${p.id}`}
                                        className="block rounded-lg border p-3 transition-colors hover:bg-muted"
                                    >
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                {p.pengajuan_pengangkutan?.alamat_lengkap}
                                            </span>
                                            <StatusBadge status={p.status} />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {p.pengajuan_pengangkutan?.user?.name ?? p.pengajuan_pengangkutan?.nama_pemohon ?? '-'}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Tidak ada penugasan hari ini</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
