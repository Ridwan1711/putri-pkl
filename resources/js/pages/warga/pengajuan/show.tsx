import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft, MapPin, Image as ImageIcon, Calendar, User,
    Package, Clock, FileText, History, Truck, CheckCircle
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/status-badge';
import { StatusTimeline } from '@/components/status-timeline';
import { MapViewer } from '@/components/map/MapViewer';
import type { BreadcrumbItem } from '@/types';
import type { PengajuanPengangkutan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/warga/dashboard' },
    { title: 'Pengajuan', href: '/warga/pengajuan' },
    { title: 'Detail', href: '#' },
];

interface Props {
    pengajuan: PengajuanPengangkutan & {
        riwayat_status?: Array<{
            id: number;
            status: string;
            keterangan: string | null;
            changed_by: number;
            created_at: string;
            changed_by_user?: { name: string };
        }>;
        lampiran?: Array<{ id: number; file_path: string }>;
    };
}

function getStatusColor(status: string): string {
    switch (status) {
        case 'diajukan':
            return 'from-blue-500 to-blue-600';
        case 'diverifikasi':
            return 'from-cyan-500 to-cyan-600';
        case 'dijadwalkan':
            return 'from-indigo-500 to-indigo-600';
        case 'diangkut':
            return 'from-yellow-500 to-yellow-600';
        case 'selesai':
            return 'from-green-500 to-green-600';
        case 'ditolak':
            return 'from-red-500 to-red-600';
        default:
            return 'from-gray-500 to-gray-600';
    }
}

export default function PengajuanShow({ pengajuan }: Props) {
    const hasLocation = pengajuan.latitude && pengajuan.longitude;
    const hasPhoto = pengajuan.foto_sampah;
    const hasRiwayat = pengajuan.riwayat_status && pengajuan.riwayat_status.length > 0;
    const hasPenugasan = pengajuan.penugasan && pengajuan.penugasan.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Pengajuan - ${pengajuan.alamat_lengkap}`} />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header with Dynamic Color Based on Status */}
                <div className={`bg-gradient-to-r ${getStatusColor(pengajuan.status)} text-white`}>
                    <div className="container mx-auto px-4 py-6">
                        <Link href="/warga/pengajuan">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white/20 hover:bg-white/30 text-white border-0 mb-4"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Package className="h-6 w-6" />
                                    <Badge variant="secondary" className="bg-white/20 text-white">
                                        Pengajuan #{pengajuan.id}
                                    </Badge>
                                </div>
                                <h1 className="text-xl md:text-2xl font-bold line-clamp-2">
                                    {pengajuan.alamat_lengkap}
                                </h1>
                                <p className="text-white/80 mt-1 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {pengajuan.wilayah?.nama_wilayah || '-'}
                                </p>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-2">
                                <StatusBadge status={pengajuan.status} className="text-base" />
                                <p className="text-sm text-white/80 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(pengajuan.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6">
                    <Tabs defaultValue="detail" className="space-y-6">
                        <TabsList className="grid w-full max-w-lg grid-cols-4">
                            <TabsTrigger value="detail" className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                <span className="hidden sm:inline">Detail</span>
                            </TabsTrigger>
                            <TabsTrigger value="lokasi" className="flex items-center gap-1" disabled={!hasLocation && !hasPhoto}>
                                <MapPin className="h-4 w-4" />
                                <span className="hidden sm:inline">Lokasi</span>
                            </TabsTrigger>
                            <TabsTrigger value="penugasan" className="flex items-center gap-1" disabled={!hasPenugasan}>
                                <Truck className="h-4 w-4" />
                                <span className="hidden sm:inline">Penugasan</span>
                            </TabsTrigger>
                            <TabsTrigger value="riwayat" className="flex items-center gap-1" disabled={!hasRiwayat}>
                                <History className="h-4 w-4" />
                                <span className="hidden sm:inline">Riwayat</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Detail Tab */}
                        <TabsContent value="detail" className="space-y-6">
                            <div className="grid gap-6 lg:grid-cols-3">
                                {/* Main Info */}
                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5 text-green-500" />
                                            Informasi Pengajuan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="p-4 rounded-lg bg-gray-50">
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Alamat Lengkap</p>
                                                <p className="font-medium">{pengajuan.alamat_lengkap}</p>
                                            </div>
                                            <div className="p-4 rounded-lg bg-gray-50">
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                                                <StatusBadge status={pengajuan.status} />
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div className="p-4 rounded-lg bg-gray-50">
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Wilayah</p>
                                                <p className="font-medium">{pengajuan.wilayah?.nama_wilayah || '-'}</p>
                                            </div>
                                            <div className="p-4 rounded-lg bg-gray-50">
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Kampung</p>
                                                <p className="font-medium">{pengajuan.kampung?.nama_kampung || '-'}</p>
                                            </div>
                                            <div className="p-4 rounded-lg bg-gray-50">
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Estimasi Volume</p>
                                                <Badge variant="outline">{pengajuan.estimasi_volume || '-'}</Badge>
                                            </div>
                                        </div>

                                        {pengajuan.catatan_admin && (
                                            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                                <p className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-1">
                                                    <FileText className="h-4 w-4" />
                                                    Catatan Admin
                                                </p>
                                                <p className="text-blue-800">{pengajuan.catatan_admin}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Timeline Summary */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <Clock className="h-5 w-5 text-blue-500" />
                                            Kronologi
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4 text-sm">
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="font-medium">Diajukan</p>
                                                    <p className="text-muted-foreground">
                                                        {new Date(pengajuan.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            {pengajuan.updated_at !== pengajuan.created_at && (
                                                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                                                    <Clock className="h-4 w-4 text-blue-500" />
                                                    <div>
                                                        <p className="font-medium text-blue-700">Update Terakhir</p>
                                                        <p className="text-blue-600">
                                                            {new Date(pengajuan.updated_at).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Lokasi Tab */}
                        <TabsContent value="lokasi" className="space-y-6">
                            <div className="grid gap-6 lg:grid-cols-2">
                                {hasLocation && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <MapPin className="h-5 w-5 text-green-500" />
                                                Lokasi Pengajuan
                                            </CardTitle>
                                            <CardDescription>
                                                Koordinat: {pengajuan.latitude}, {pengajuan.longitude}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <MapViewer
                                                latitude={pengajuan.latitude!}
                                                longitude={pengajuan.longitude!}
                                                height="350px"
                                            />
                                        </CardContent>
                                    </Card>
                                )}

                                {hasPhoto && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <ImageIcon className="h-5 w-5 text-purple-500" />
                                                Foto Sampah
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <img
                                                src={`/storage/${pengajuan.foto_sampah}`}
                                                alt="Foto Sampah"
                                                className="w-full rounded-lg shadow-md"
                                            />
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>

                        {/* Penugasan Tab */}
                        <TabsContent value="penugasan" className="space-y-6">
                            {hasPenugasan && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {pengajuan.penugasan!.map((penugasan) => (
                                        <Card key={penugasan.id}>
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="flex items-center gap-2 text-base">
                                                        <Truck className="h-5 w-5 text-indigo-500" />
                                                        Penugasan #{penugasan.id}
                                                    </CardTitle>
                                                    <StatusBadge status={penugasan.status} />
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid gap-3">
                                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                                        <User className="h-4 w-4 text-gray-500" />
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Petugas</p>
                                                            <p className="font-medium">{penugasan.petugas?.user?.name || '-'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                                        <Truck className="h-4 w-4 text-gray-500" />
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Armada</p>
                                                            <p className="font-medium">
                                                                {penugasan.armada?.kode_armada || '-'} - {penugasan.armada?.jenis_kendaraan || '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                                                        <Calendar className="h-4 w-4 text-blue-500" />
                                                        <div>
                                                            <p className="text-xs text-blue-600">Jadwal Angkut</p>
                                                            <p className="font-medium text-blue-700">
                                                                {new Date(penugasan.jadwal_angkut).toLocaleString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        {/* Riwayat Tab */}
                        <TabsContent value="riwayat" className="space-y-6">
                            {hasRiwayat && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <History className="h-5 w-5 text-indigo-500" />
                                            Riwayat Status
                                        </CardTitle>
                                        <CardDescription>
                                            Perjalanan status pengajuan dari awal hingga sekarang
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <StatusTimeline
                                            riwayat={pengajuan.riwayat_status!.map((r) => ({
                                                id: r.id,
                                                ref_type: 'pengajuan' as const,
                                                ref_id: pengajuan.id,
                                                status: r.status,
                                                keterangan: r.keterangan,
                                                changed_by: r.changed_by,
                                                created_at: r.created_at,
                                                updated_at: r.created_at,
                                                changed_by_user: r.changed_by_user,
                                            }))}
                                        />
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
