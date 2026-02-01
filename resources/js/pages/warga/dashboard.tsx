import { Head, Link } from '@inertiajs/react';
import {
    Package, AlertCircle, CheckCircle, Clock, Plus,
    ChevronRight, FileText, TrendingUp, Eye, MapPin
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/status-badge';
import type { BreadcrumbItem, SharedData } from '@/types';
import type { PengajuanPengangkutan, Aduan } from '@/types/models';
import { usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/warga/dashboard' },
];

interface Stats {
    total_pengajuan: number;
    pengajuan_selesai: number;
    pengajuan_proses: number;
    total_aduan: number;
    aduan_selesai: number;
    aduan_proses: number;
}

export default function WargaDashboard({
    pengajuan_terbaru,
    aduan_terbaru,
    stats,
}: {
    pengajuan_terbaru: PengajuanPengangkutan[];
    aduan_terbaru: Aduan[];
    stats: Stats;
}) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const pengajuanProgress = stats.total_pengajuan > 0
        ? Math.round((stats.pengajuan_selesai / stats.total_pengajuan) * 100)
        : 0;

    const aduanProgress = stats.total_aduan > 0
        ? Math.round((stats.aduan_selesai / stats.total_aduan) * 100)
        : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Warga" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-white/30">
                                    <AvatarFallback className="bg-white/20 text-white text-xl">
                                        {user?.name?.charAt(0) || 'W'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">
                                        Selamat Datang, {user?.name || 'Warga'}!
                                    </h1>
                                    <p className="text-green-100 mt-1">
                                        Kelola pengajuan dan aduan Anda dengan mudah
                                    </p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-2">
                                <Link href="/warga/pengajuan/create">
                                    <Button className="bg-white text-green-700 hover:bg-green-50">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Buat Pengajuan
                                    </Button>
                                </Link>
                                <Link href="/warga/aduan/create">
                                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                                        <AlertCircle className="h-4 w-4 mr-2" />
                                        Buat Aduan
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6 space-y-6">
                    {/* KPI Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-700">Total Pengajuan</p>
                                        <p className="text-3xl font-bold text-blue-600">{stats.total_pengajuan}</p>
                                    </div>
                                    <div className="p-3 rounded-full bg-blue-100">
                                        <Package className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-blue-600">Selesai</span>
                                        <span className="text-blue-600">{pengajuanProgress}%</span>
                                    </div>
                                    <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all"
                                            style={{ width: `${pengajuanProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-700">Pengajuan Selesai</p>
                                        <p className="text-3xl font-bold text-green-600">{stats.pengajuan_selesai}</p>
                                    </div>
                                    <div className="p-3 rounded-full bg-green-100">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center text-sm text-green-600">
                                    <Link href="/warga/pengajuan" className="hover:underline flex items-center">
                                        Lihat semua <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-orange-700">Total Aduan</p>
                                        <p className="text-3xl font-bold text-orange-600">{stats.total_aduan}</p>
                                    </div>
                                    <div className="p-3 rounded-full bg-orange-100">
                                        <AlertCircle className="h-6 w-6 text-orange-600" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-orange-600">Selesai</span>
                                        <span className="text-orange-600">{aduanProgress}%</span>
                                    </div>
                                    <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-500 rounded-full transition-all"
                                            style={{ width: `${aduanProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-700">Aduan Selesai</p>
                                        <p className="text-3xl font-bold text-purple-600">{stats.aduan_selesai}</p>
                                    </div>
                                    <div className="p-3 rounded-full bg-purple-100">
                                        <CheckCircle className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center text-sm text-purple-600">
                                    <Link href="/warga/aduan" className="hover:underline flex items-center">
                                        Lihat semua <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Items Grid */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Pengajuan Terbaru */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-green-700">
                                            <Package className="h-5 w-5" />
                                            Pengajuan Terbaru
                                        </CardTitle>
                                        <CardDescription>
                                            {pengajuan_terbaru.length} pengajuan terakhir
                                        </CardDescription>
                                    </div>
                                    <Link href="/warga/pengajuan">
                                        <Button variant="outline" size="sm">
                                            Lihat Semua
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {pengajuan_terbaru.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500">Belum ada pengajuan</p>
                                        <Link href="/warga/pengajuan/create" className="mt-4 inline-block">
                                            <Button size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Buat Pengajuan
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {pengajuan_terbaru.map((p) => (
                                            <Link
                                                key={p.id}
                                                href={`/warga/pengajuan/${p.id}`}
                                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-green-50 hover:border-green-200 transition-colors"
                                            >
                                                <Button variant="ghost" size="icon" className="shrink-0">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">
                                                        {p.alamat_lengkap || 'Alamat tidak tersedia'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {p.wilayah?.nama_wilayah || '-'}
                                                    </p>
                                                </div>
                                                <StatusBadge status={p.status} />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Aduan Terbaru */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-orange-700">
                                            <AlertCircle className="h-5 w-5" />
                                            Aduan Terbaru
                                        </CardTitle>
                                        <CardDescription>
                                            {aduan_terbaru.length} aduan terakhir
                                        </CardDescription>
                                    </div>
                                    <Link href="/warga/aduan">
                                        <Button variant="outline" size="sm">
                                            Lihat Semua
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {aduan_terbaru.length === 0 ? (
                                    <div className="text-center py-8">
                                        <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500">Belum ada aduan</p>
                                        <Link href="/warga/aduan/create" className="mt-4 inline-block">
                                            <Button size="sm" variant="outline">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Buat Aduan
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {aduan_terbaru.map((a) => (
                                            <Link
                                                key={a.id}
                                                href={`/warga/aduan/${a.id}`}
                                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-orange-50 hover:border-orange-200 transition-colors"
                                            >
                                                <Button variant="ghost" size="icon" className="shrink-0">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium">{a.kategori}</p>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {a.deskripsi}
                                                    </p>
                                                </div>
                                                <StatusBadge status={a.status} />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Info Card */}
                    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="p-3 rounded-full bg-green-100">
                                    <TrendingUp className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-green-800">Tips</h3>
                                    <p className="text-green-700 mt-1">
                                        Pastikan alamat dan lokasi pengajuan Anda sudah benar agar petugas dapat menemukan lokasi dengan mudah.
                                        Sertakan foto jika memungkinkan untuk mempercepat proses verifikasi.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
