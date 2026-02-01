import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Eye, AlertCircle, Filter, RotateCcw, Calendar,
    CheckCircle, Clock, XCircle, FileText
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
import type { Aduan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/warga/dashboard' },
    { title: 'Aduan', href: '/warga/aduan' },
];

const KATEGORI_OPTIONS = [
    { value: 'Sampah Menumpuk', label: 'Sampah Menumpuk' },
    { value: 'Bau Tidak Sedap', label: 'Bau Tidak Sedap' },
    { value: 'Lokasi Tidak Terjangkau', label: 'Lokasi Tidak Terjangkau' },
    { value: 'Kinerja Petugas', label: 'Kinerja Petugas' },
    { value: 'Keterlambatan Pengangkutan', label: 'Keterlambatan Pengangkutan' },
    { value: 'Layanan Aplikasi', label: 'Layanan Aplikasi' },
    { value: 'Lainnya', label: 'Lainnya' },
];

interface Props {
    aduan: {
        data: Aduan[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        status?: string;
        kategori?: string;
    };
    stats?: {
        total: number;
        masuk: number;
        diproses: number;
        selesai: number;
    };
}

export default function AduanIndex({ aduan, filters, stats }: Props) {
    // Calculate stats from data if not provided
    const calculatedStats = stats || {
        total: aduan.total,
        masuk: aduan.data.filter(a => a.status === 'masuk').length,
        diproses: aduan.data.filter(a => ['diproses', 'ditindak'].includes(a.status)).length,
        selesai: aduan.data.filter(a => a.status === 'selesai').length,
    };

    // Aksi column FIRST
    const columns = [
        {
            header: 'Aksi',
            accessor: (row: Aduan) => (
                <Link href={`/warga/aduan/${row.id}`} onClick={(e) => e.stopPropagation()}>
                    <Button variant="default" size="sm" className="bg-orange-600 hover:bg-orange-700">
                        <Eye className="h-4 w-4 mr-1" />
                        Lihat
                    </Button>
                </Link>
            ),
        },
        {
            header: 'Kategori',
            accessor: (row: Aduan) => (
                <Badge variant="outline">{row.kategori}</Badge>
            ),
        },
        {
            header: 'Deskripsi',
            accessor: (row: Aduan) => (
                <div className="max-w-xs truncate text-sm">{row.deskripsi}</div>
            ),
        },
        {
            header: 'Status',
            accessor: (row: Aduan) => <StatusBadge status={row.status} />,
        },
        {
            header: 'Tanggal',
            accessor: (row: Aduan) => (
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
            '/warga/aduan',
            { ...filters, ...updates },
            { preserveState: true, preserveScroll: true }
        );
    };

    const hasActiveFilters = filters.status || filters.kategori;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Aduan Saya" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                    <AlertCircle className="h-8 w-8" />
                                    Aduan Saya
                                </h1>
                                <p className="text-orange-100 mt-1">
                                    Kelola dan pantau status aduan Anda
                                </p>
                            </div>
                            <Link href="/warga/aduan/create">
                                <Button className="bg-white text-orange-600 hover:bg-orange-50">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Buat Aduan Baru
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
                                        <p className="text-xs text-muted-foreground">Total Aduan</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-orange-200 bg-orange-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-orange-100">
                                        <Clock className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-orange-600">{calculatedStats.masuk}</p>
                                        <p className="text-xs text-orange-600">Masuk</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-blue-200 bg-blue-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-blue-100">
                                        <AlertCircle className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">{calculatedStats.diproses}</p>
                                        <p className="text-xs text-blue-600">Diproses</p>
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
                                <div className="space-y-2 min-w-[180px]">
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
                                            <SelectItem value="masuk">Masuk</SelectItem>
                                            <SelectItem value="diproses">Diproses</SelectItem>
                                            <SelectItem value="ditindak">Ditindak</SelectItem>
                                            <SelectItem value="selesai">Selesai</SelectItem>
                                            <SelectItem value="ditolak">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 min-w-[200px]">
                                    <Label className="flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        Kategori
                                    </Label>
                                    <Select
                                        value={filters.kategori || 'all'}
                                        onValueChange={(v) => applyFilters({ kategori: v === 'all' ? undefined : v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Kategori</SelectItem>
                                            {KATEGORI_OPTIONS.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        onClick={() => applyFilters({ status: undefined, kategori: undefined })}
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
                            <CardTitle>Daftar Aduan</CardTitle>
                            <CardDescription>
                                Menampilkan {aduan.data.length} dari {aduan.total} aduan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                data={aduan}
                                columns={columns}
                                onRowClick={(row) => router.visit(`/warga/aduan/${row.id}`)}
                                mobileCard={(row) => (
                                    <div className="space-y-3">
                                        {/* Action First on Mobile */}
                                        <div className="flex items-center justify-between">
                                            <Link href={`/warga/aduan/${row.id}`} onClick={(e) => e.stopPropagation()}>
                                                <Button variant="default" size="sm" className="bg-orange-600 hover:bg-orange-700">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Lihat Detail
                                                </Button>
                                            </Link>
                                            <StatusBadge status={row.status} />
                                        </div>

                                        <div className="pt-2 border-t">
                                            <Badge variant="outline" className="mb-2">{row.kategori}</Badge>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{row.deskripsi}</p>
                                        </div>

                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(row.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
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
