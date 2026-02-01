import { Head, Link, router } from '@inertiajs/react';
import {
    Eye, AlertCircle, Filter, RotateCcw, Calendar,
    CheckCircle, Clock, FileText, User, Users, AlertTriangle
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
    { title: 'Dashboard', href: '/petugas/dashboard' },
    { title: 'Aduan', href: '/petugas/aduan' },
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
    stats: {
        total: number;
        kinerja_petugas: number;
        keterlambatan: number;
        lainnya: number;
    };
    kategori_options: string[];
}

export default function PetugasAduanIndex({ aduan, filters, stats, kategori_options }: Props) {
    // Aksi column FIRST
    const columns = [
        {
            header: 'Aksi',
            accessor: (row: Aduan) => (
                <Link href={`/petugas/aduan/${row.id}`} onClick={(e) => e.stopPropagation()}>
                    <Button variant="default" size="sm" className="bg-orange-600 hover:bg-orange-700">
                        <Eye className="h-4 w-4 mr-1" />
                        Lihat
                    </Button>
                </Link>
            ),
        },
        {
            header: 'Pelapor',
            accessor: (row: Aduan) => (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{row.user?.name || '-'}</span>
                </div>
            ),
        },
        {
            header: 'Kategori',
            accessor: (row: Aduan) => {
                const isKritikalKategori = ['Kinerja Petugas', 'Keterlambatan Pengangkutan'].includes(row.kategori);
                return (
                    <Badge variant={isKritikalKategori ? 'destructive' : 'secondary'}>
                        {isKritikalKategori && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {row.kategori}
                    </Badge>
                );
            },
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
            '/petugas/aduan',
            { ...filters, ...updates },
            { preserveState: true, preserveScroll: true }
        );
    };

    const hasActiveFilters = filters.status || filters.kategori;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Aduan" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                    <AlertCircle className="h-8 w-8" />
                                    Daftar Aduan
                                </h1>
                                <p className="text-orange-100 mt-1">
                                    Pantau aduan dari warga terkait layanan pengangkutan
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                                    {stats.total} Total Aduan
                                </Badge>
                            </div>
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
                                        <p className="text-2xl font-bold">{stats.total}</p>
                                        <p className="text-xs text-muted-foreground">Total Aduan</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-red-200 bg-red-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-red-100">
                                        <Users className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-red-600">{stats.kinerja_petugas}</p>
                                        <p className="text-xs text-red-600">Kinerja Petugas</p>
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
                                        <p className="text-2xl font-bold text-orange-600">{stats.keterlambatan}</p>
                                        <p className="text-xs text-orange-600">Keterlambatan</p>
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
                                        <p className="text-2xl font-bold text-blue-600">{stats.lainnya}</p>
                                        <p className="text-xs text-blue-600">Lainnya</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Info Card for Petugas */}
                    {stats.kinerja_petugas > 0 && (
                        <Card className="border-red-200 bg-red-50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="h-6 w-6 text-red-500" />
                                    <div>
                                        <p className="font-medium text-red-800">Perhatian</p>
                                        <p className="text-sm text-red-700">
                                            Terdapat {stats.kinerja_petugas} aduan terkait kinerja petugas. Pastikan untuk meningkatkan kualitas layanan.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

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
                                            {kategori_options.map((opt) => (
                                                <SelectItem key={opt} value={opt}>
                                                    {opt}
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
                                Menampilkan {aduan.data.length} dari {aduan.total} aduan (hanya baca)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                data={aduan}
                                columns={columns}
                                onRowClick={(row) => router.visit(`/petugas/aduan/${row.id}`)}
                                mobileCard={(row) => {
                                    const isKritikalKategori = ['Kinerja Petugas', 'Keterlambatan Pengangkutan'].includes(row.kategori);
                                    return (
                                        <div className="space-y-3">
                                            {/* Action First on Mobile */}
                                            <div className="flex items-center justify-between">
                                                <Link href={`/petugas/aduan/${row.id}`} onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="default" size="sm" className="bg-orange-600 hover:bg-orange-700">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Lihat
                                                    </Button>
                                                </Link>
                                                <StatusBadge status={row.status} />
                                            </div>

                                            <div className="pt-2 border-t">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <User className="h-4 w-4 text-gray-400" />
                                                    <span className="font-medium">{row.user?.name || '-'}</span>
                                                </div>
                                                <Badge variant={isKritikalKategori ? 'destructive' : 'secondary'} className="mb-2">
                                                    {isKritikalKategori && <AlertTriangle className="h-3 w-3 mr-1" />}
                                                    {row.kategori}
                                                </Badge>
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
                                    );
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
