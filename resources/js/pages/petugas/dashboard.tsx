import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar, ClipboardList, Trash2, User, TrendingUp, Truck, MapPin, Clock,
    Bell, X, ChevronRight, Map, RefreshCw, CheckCircle, AlertCircle,
    Loader2, XCircle, Eye, ListTodo
} from 'lucide-react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/status-badge';
import { toast } from 'react-hot-toast';
import type { BreadcrumbItem } from '@/types';
import type { Penugasan, Armada, Petugas } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/petugas/dashboard' },
];

type NotifikasiItem = {
    id: number;
    judul: string;
    pesan: string;
};

type JadwalKampung = {
    nama: string;
    urutan: number;
};

type JadwalRutinData = {
    armada?: Armada;
    hari_ini?: {
        hari: string;
        kampung: JadwalKampung[];
    } | null;
    jadwal_mingguan: Record<number, {
        hari: string;
        hari_num: number;
        kampung: JadwalKampung[];
    }>;
};

interface Props {
    petugas?: Petugas & { user?: { name: string; email: string } };
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
    jadwal_rutin: JadwalRutinData;
}

export default function PetugasDashboard({
    petugas,
    penugasan_hari_ini,
    penugasan_mendatang,
    jumlah_tugas,
    sampah_terkumpul,
    performa,
    chart_7_hari,
    notifikasi,
    jadwal_rutin,
}: Props) {
    const dismissNotifikasi = (id: number) => {
        router.patch(`/petugas/notifikasi/${id}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Notifikasi ditandai sudah dibaca'),
        });
    };

    const totalPerforma = performa.menunggu + performa.diproses + performa.dalam_perjalanan + performa.selesai + performa.gagal;
    const completionRate = totalPerforma > 0 ? Math.round((performa.selesai / totalPerforma) * 100) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Kolektor" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-white/30">
                                    <AvatarFallback className="bg-white/20 text-white text-xl">
                                        {petugas?.user?.name?.charAt(0) || 'P'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">
                                        Selamat Datang, {petugas?.user?.name || 'Petugas'}!
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-2 mt-1 text-green-100">
                                        {jadwal_rutin.armada && (
                                            <Badge variant="secondary" className="bg-white/20 text-white border-0">
                                                <Truck className="h-3 w-3 mr-1" />
                                                {jadwal_rutin.armada.kode_armada}
                                            </Badge>
                                        )}
                                        {petugas?.wilayah && (
                                            <Badge variant="secondary" className="bg-white/20 text-white border-0">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {petugas.wilayah.nama_wilayah}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-2">
                                <Link href="/petugas/penugasan">
                                    <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                                        <ListTodo className="h-4 w-4 mr-2" />
                                        Daftar Tugas
                                    </Button>
                                </Link>
                                <Link href="/petugas/update-status">
                                    <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Update Status
                                    </Button>
                                </Link>
                                <Link href="/petugas/peta">
                                    <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                                        <Map className="h-4 w-4 mr-2" />
                                        Lihat Peta
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6 space-y-6">
                    {/* KPI Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-700">Tugas Aktif</p>
                                        <p className="text-3xl font-bold text-green-600">{jumlah_tugas}</p>
                                    </div>
                                    <div className="p-3 rounded-full bg-green-100">
                                        <ClipboardList className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center text-sm text-green-600">
                                    <Link href="/petugas/penugasan" className="hover:underline flex items-center">
                                        Lihat semua <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-700">Sampah Terkumpul</p>
                                        <p className="text-3xl font-bold text-blue-600">{sampah_terkumpul} <span className="text-lg">Kg</span></p>
                                    </div>
                                    <div className="p-3 rounded-full bg-blue-100">
                                        <Trash2 className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center text-sm text-blue-600">
                                    <Link href="/petugas/riwayat" className="hover:underline flex items-center">
                                        Lihat riwayat <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-orange-700">Tugas Hari Ini</p>
                                        <p className="text-3xl font-bold text-orange-600">{penugasan_hari_ini.length}</p>
                                    </div>
                                    <div className="p-3 rounded-full bg-orange-100">
                                        <Calendar className="h-6 w-6 text-orange-600" />
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center text-sm text-orange-600">
                                    {penugasan_hari_ini.length > 0 ? 'Ada tugas menunggu' : 'Tidak ada tugas'}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-700">Tingkat Penyelesaian</p>
                                        <p className="text-3xl font-bold text-purple-600">{completionRate}%</p>
                                    </div>
                                    <div className="p-3 rounded-full bg-purple-100">
                                        <TrendingUp className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500 rounded-full transition-all"
                                            style={{ width: `${completionRate}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Performa Petugas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700">
                                <User className="h-5 w-5" />
                                Performa Penugasan
                            </CardTitle>
                            <CardDescription>Ringkasan status semua penugasan Anda</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 text-center">
                                    <div className="flex justify-center mb-2">
                                        <AlertCircle className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <p className="text-2xl font-bold text-orange-600">{performa.menunggu}</p>
                                    <p className="text-sm text-orange-700">Menunggu</p>
                                </div>
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-center">
                                    <div className="flex justify-center mb-2">
                                        <Loader2 className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <p className="text-2xl font-bold text-blue-600">{performa.diproses}</p>
                                    <p className="text-sm text-blue-700">Diproses</p>
                                </div>
                                <div className="p-4 rounded-lg bg-cyan-50 border border-cyan-200 text-center">
                                    <div className="flex justify-center mb-2">
                                        <Truck className="h-5 w-5 text-cyan-500" />
                                    </div>
                                    <p className="text-2xl font-bold text-cyan-600">{performa.dalam_perjalanan}</p>
                                    <p className="text-sm text-cyan-700">Dalam Perjalanan</p>
                                </div>
                                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-center">
                                    <div className="flex justify-center mb-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    </div>
                                    <p className="text-2xl font-bold text-green-600">{performa.selesai}</p>
                                    <p className="text-sm text-green-700">Selesai</p>
                                </div>
                                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-center">
                                    <div className="flex justify-center mb-2">
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    </div>
                                    <p className="text-2xl font-bold text-red-600">{performa.gagal}</p>
                                    <p className="text-sm text-red-700">Gagal</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Grid: Chart + Jadwal */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-700">
                                    <TrendingUp className="h-5 w-5" />
                                    Aktivitas 7 Hari Terakhir
                                </CardTitle>
                                <CardDescription>Grafik penyelesaian tugas</CardDescription>
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
                                                name="Selesai"
                                                stroke="#22c55e"
                                                fill="#22c55e"
                                                fillOpacity={0.3}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="gagal"
                                                name="Gagal"
                                                stroke="#ef4444"
                                                fill="#ef4444"
                                                fillOpacity={0.3}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Jadwal Rutin */}
                        <Card className="border-green-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-700">
                                    <Clock className="h-5 w-5" />
                                    Jadwal Rutin
                                </CardTitle>
                                <CardDescription>Jadwal pengangkutan mingguan</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {jadwal_rutin && Object.keys(jadwal_rutin.jadwal_mingguan || {}).length > 0 ? (
                                    <div className="space-y-4">
                                        {jadwal_rutin.hari_ini ? (
                                            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Badge className="bg-green-600">Hari Ini</Badge>
                                                    <span className="font-medium">{jadwal_rutin.hari_ini.hari}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {jadwal_rutin.hari_ini.kampung.map((k, idx) => (
                                                        <Badge
                                                            key={idx}
                                                            variant="outline"
                                                            className="bg-white border-green-200"
                                                        >
                                                            <MapPin className="h-3 w-3 mr-1 text-green-600" />
                                                            {k.nama}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-center">
                                                <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500">Tidak ada jadwal rutin hari ini</p>
                                            </div>
                                        )}

                                        <Separator />

                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-3">Jadwal Minggu Ini:</p>
                                            <div className="grid grid-cols-7 gap-1">
                                                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, idx) => {
                                                    const hariNum = idx + 1;
                                                    const hasSchedule = jadwal_rutin.jadwal_mingguan[hariNum];
                                                    const isToday = new Date().getDay() === (idx === 6 ? 0 : idx + 1);
                                                    return (
                                                        <div
                                                            key={day}
                                                            className={`text-center p-2 rounded-lg transition-colors ${
                                                                hasSchedule
                                                                    ? isToday
                                                                        ? 'bg-green-600 text-white'
                                                                        : 'bg-green-100 text-green-700'
                                                                    : 'bg-gray-100 text-gray-400'
                                                            }`}
                                                            title={hasSchedule ? `${hasSchedule.kampung.length} kampung` : 'Tidak ada jadwal'}
                                                        >
                                                            <p className="text-xs font-medium">{day}</p>
                                                            {hasSchedule && (
                                                                <p className="text-xs mt-1">{hasSchedule.kampung.length}</p>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500">Belum ada jadwal rutin</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Grid: Notifikasi + Penugasan Hari Ini */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Notifikasi */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-700">
                                    <Bell className="h-5 w-5" />
                                    Notifikasi
                                    {notifikasi.length > 0 && (
                                        <Badge variant="destructive" className="ml-2">{notifikasi.length}</Badge>
                                    )}
                                </CardTitle>
                                <CardDescription>Pemberitahuan dari Admin</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {notifikasi.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500">Tidak ada notifikasi baru</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-80 overflow-y-auto">
                                        {notifikasi.map((n) => (
                                            <div
                                                key={n.id}
                                                className="relative p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => dismissNotifikasi(n.id)}
                                                    className="absolute right-2 top-2 p-1 rounded-full hover:bg-amber-200 transition-colors"
                                                    aria-label="Tandai sudah dibaca"
                                                >
                                                    <X className="h-4 w-4 text-amber-600" />
                                                </button>
                                                <p className="font-semibold text-amber-900 dark:text-amber-100 pr-6">
                                                    {n.judul}
                                                </p>
                                                <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                                                    {n.pesan}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Penugasan Hari Ini */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-green-700">
                                            <Calendar className="h-5 w-5" />
                                            Penugasan Hari Ini
                                        </CardTitle>
                                        <CardDescription>{penugasan_hari_ini.length} tugas</CardDescription>
                                    </div>
                                    <Link href="/petugas/penugasan">
                                        <Button variant="outline" size="sm">
                                            Lihat Semua
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {penugasan_hari_ini.length > 0 ? (
                                    <div className="space-y-3 max-h-80 overflow-y-auto">
                                        {penugasan_hari_ini.slice(0, 5).map((p) => (
                                            <Link
                                                key={p.id}
                                                href={`/petugas/penugasan/${p.id}`}
                                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-green-50 hover:border-green-200 transition-colors"
                                            >
                                                <Button variant="ghost" size="icon" className="shrink-0">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">
                                                        {p.pengajuan_pengangkutan?.user?.name ?? p.pengajuan_pengangkutan?.nama_pemohon ?? '-'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {p.pengajuan_pengangkutan?.alamat_lengkap}
                                                    </p>
                                                </div>
                                                <StatusBadge status={p.status} />
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <CheckCircle className="h-12 w-12 mx-auto text-green-300 mb-3" />
                                        <p className="text-gray-500">Tidak ada penugasan hari ini</p>
                                        <p className="text-sm text-gray-400 mt-1">Istirahat dulu ya!</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
