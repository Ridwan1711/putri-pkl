import { Head, Link, router } from '@inertiajs/react';
import {
    Eye, FileText, MapPin, Calendar, Filter, RotateCcw,
    CheckCircle, Clock, AlertCircle
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
    { title: 'Dashboard', href: '/petugas/dashboard' },
    { title: 'Pengajuan', href: '/petugas/pengajuan' },
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
}

export default function PengajuanIndex({ pengajuan, filters }: Props) {
    // Aksi column FIRST
    const columns = [
        {
            header: 'Aksi',
            accessor: (row: PengajuanPengangkutan) =>
                row.penugasan && row.penugasan.length > 0 ? (
                    <Link href={`/petugas/penugasan/${row.penugasan[0].id}`} onClick={(e) => e.stopPropagation()}>
                        <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                            <Eye className="h-4 w-4 mr-1" />
                            Lihat
                        </Button>
                    </Link>
                ) : (
                    <Badge variant="outline" className="text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Belum ditugaskan
                    </Badge>
                ),
        },
        {
            header: 'Warga',
            accessor: (row: PengajuanPengangkutan) => (
                <div>
                    <p className="font-medium">{row.user?.name || row.nama_pemohon || '-'}</p>
                    <p className="text-xs text-muted-foreground">{row.no_telepon || row.user?.email || '-'}</p>
                </div>
            ),
        },
        {
            header: 'Alamat',
            accessor: (row: PengajuanPengangkutan) => (
                <div className="max-w-xs">
                    <p className="truncate">{row.alamat_lengkap}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {row.wilayah?.nama_wilayah || '-'}
                    </p>
                </div>
            ),
        },
        {
            header: 'Status',
            accessor: (row: PengajuanPengangkutan) => <StatusBadge status={row.status} />,
        },
        {
            header: 'Tanggal',
            accessor: (row: PengajuanPengangkutan) => (
                <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>
                        {new Date(row.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        })}
                    </span>
                </div>
            ),
        },
    ];

    const applyFilters = (updates: Record<string, string | undefined>) => {
        router.get(
            '/petugas/pengajuan',
            { ...filters, ...updates },
            { preserveState: true, preserveScroll: true }
        );
    };

    const hasActiveFilters = !!filters.status;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan di Wilayah Saya" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                    <FileText className="h-8 w-8" />
                                    Pengajuan di Wilayah Saya
                                </h1>
                                <p className="text-green-100 mt-1">
                                    Daftar pengajuan pengangkutan dari warga
                                </p>
                            </div>
                            <Badge variant="secondary" className="bg-white/20 text-white border-0 text-lg px-4 py-2">
                                {pengajuan.total} Pengajuan
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6 space-y-6">
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
                                            <SelectItem value="diajukan">
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="h-3 w-3 text-gray-500" />
                                                    Diajukan
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="diverifikasi">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-3 w-3 text-blue-500" />
                                                    Diverifikasi
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="dijadwalkan">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3 w-3 text-purple-500" />
                                                    Dijadwalkan
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="diangkut">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-3 w-3 text-orange-500" />
                                                    Diangkut
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="selesai">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                                    Selesai
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="ditolak">
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="h-3 w-3 text-red-500" />
                                                    Ditolak
                                                </div>
                                            </SelectItem>
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
                            <CardTitle>Data Pengajuan</CardTitle>
                            <CardDescription>
                                Menampilkan {pengajuan.data.length} dari {pengajuan.total} data
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                data={pengajuan}
                                columns={columns}
                                mobileCard={(row) => (
                                    <div className="space-y-3">
                                        {/* Action First on Mobile */}
                                        <div className="flex items-center justify-between">
                                            {row.penugasan && row.penugasan.length > 0 ? (
                                                <Link href={`/petugas/penugasan/${row.penugasan[0].id}`} onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Lihat Detail
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Badge variant="outline" className="text-gray-500">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    Belum ditugaskan
                                                </Badge>
                                            )}
                                            <StatusBadge status={row.status} />
                                        </div>

                                        <div className="pt-2 border-t">
                                            <p className="font-semibold">{row.user?.name || row.nama_pemohon || '-'}</p>
                                            <p className="text-sm text-muted-foreground truncate">{row.alamat_lengkap}</p>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {row.wilayah?.nama_wilayah || '-'}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(row.created_at).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                })}
                                            </div>
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
