import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Eye, Package, Filter, RotateCcw, Calendar,
    CheckCircle, Clock, XCircle, MapPin, FileText
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import type { BreadcrumbItem } from '@/types';
import type { PengajuanPengangkutan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/warga/dashboard' },
    { title: 'Pengajuan', href: '/warga/pengajuan' },
];

interface Props {
    pengajuan: {
        data: PengajuanPengangkutan[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        status?: string;
    };
    stats?: {
        total: number;
        diajukan: number;
        proses: number;
        selesai: number;
    };
}

export default function PengajuanIndex({ pengajuan, filters, stats }: Props) {
    // Calculate stats from data if not provided
    const calculatedStats = stats || {
        total: pengajuan.total,
        diajukan: pengajuan.data.filter(p => p.status === 'diajukan').length,
        proses: pengajuan.data.filter(p => ['diverifikasi', 'dijadwalkan', 'diangkut'].includes(p.status)).length,
        selesai: pengajuan.data.filter(p => p.status === 'selesai').length,
    };

    // Aksi column FIRST
    const columns = [
        {
            header: 'Aksi',
            accessor: (row: PengajuanPengangkutan) => (
                <Link href={`/warga/pengajuan/${row.id}`} onClick={(e) => e.stopPropagation()}>
                    <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                        <Eye className="h-4 w-4 mr-1" />
                        Lihat
                    </Button>
                </Link>
            ),
        },
        {
            header: 'Alamat',
            accessor: (row: PengajuanPengangkutan) => (
                <div className="max-w-xs">
                    <p className="truncate font-medium">{row.alamat_lengkap}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {row.wilayah?.nama_wilayah || '-'}
                    </p>
                </div>
            ),
        },
        {
            header: 'Estimasi',
            accessor: (row: PengajuanPengangkutan) => (
                <Badge variant="outline">{row.estimasi_volume || '-'}</Badge>
            ),
        },
        {
            header: 'Status',
            accessor: (row: PengajuanPengangkutan) => <StatusBadge status={row.status} />,
        },
        {
            header: 'Tanggal',
            accessor: (row: PengajuanPengangkutan) => (
                <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {new Date(row.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </div>
            ),
        },
    ];

    const applyFilters = (updates: Record<string, string | undefined>) => {
        router.get(
            '/warga/pengajuan',
            { ...filters, ...updates },
            { preserveState: true, preserveScroll: true }
        );
    };

    const hasActiveFilters = !!filters.status;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan Saya" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                    <Package className="h-8 w-8" />
                                    Pengajuan Saya
                                </h1>
                                <p className="text-green-100 mt-1">
                                    Kelola dan pantau status pengajuan pengangkutan sampah
                                </p>
                            </div>
                            <Link href="/warga/pengajuan/create">
                                <Button className="bg-white text-green-700 hover:bg-green-50">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Buat Pengajuan Baru
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="border-gray-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-gray-100">
                                        <FileText className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{calculatedStats.total}</p>
                                        <p className="text-xs text-muted-foreground">Total Pengajuan</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-blue-200 bg-blue-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-blue-100">
                                        <Clock className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">{calculatedStats.diajukan}</p>
                                        <p className="text-xs text-blue-600">Diajukan</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-yellow-200 bg-yellow-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-yellow-100">
                                        <Package className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-yellow-600">{calculatedStats.proses}</p>
                                        <p className="text-xs text-yellow-600">Diproses</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-green-200 bg-green-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-green-100">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-green-600">{calculatedStats.selesai}</p>
                                        <p className="text-xs text-green-600">Selesai</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filter Card */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Filter className="h-5 w-5" />
                                Filter
                                {hasActiveFilters && (
                                    <Badge variant="secondary" className="ml-2">Aktif</Badge>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4 items-end">
                                <div className="space-y-2 min-w-[200px]">
                                    <Label className="flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" />
                                        Status
                                    </Label>
                                    <Select
                                        value={filters.status || 'all'}
                                        onValueChange={(v) => applyFilters({ status: v === 'all' ? undefined : v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Status</SelectItem>
                                            <SelectItem value="diajukan">Diajukan</SelectItem>
                                            <SelectItem value="diverifikasi">Diverifikasi</SelectItem>
                                            <SelectItem value="dijadwalkan">Dijadwalkan</SelectItem>
                                            <SelectItem value="diangkut">Diangkut</SelectItem>
                                            <SelectItem value="selesai">Selesai</SelectItem>
                                            <SelectItem value="ditolak">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        onClick={() => applyFilters({ status: undefined })}
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Pengajuan</CardTitle>
                            <CardDescription>
                                Menampilkan {pengajuan.data.length} dari {pengajuan.total} pengajuan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                data={pengajuan}
                                columns={columns}
                                onRowClick={(row) => router.visit(`/warga/pengajuan/${row.id}`)}
                                mobileCard={(row) => (
                                    <div className="space-y-3">
                                        {/* Action First on Mobile */}
                                        <div className="flex items-center justify-between">
                                            <Link href={`/warga/pengajuan/${row.id}`} onClick={(e) => e.stopPropagation()}>
                                                <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Lihat Detail
                                                </Button>
                                            </Link>
                                            <StatusBadge status={row.status} />
                                        </div>

                                        <div className="pt-2 border-t">
                                            <p className="font-medium">{row.alamat_lengkap}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                <MapPin className="h-3 w-3" />
                                                {row.wilayah?.nama_wilayah || '-'}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <Badge variant="outline">{row.estimasi_volume || '-'}</Badge>
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(row.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
