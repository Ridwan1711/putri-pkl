import { Head, Link, router } from '@inertiajs/react';
import {
    Eye, AlertCircle, Filter, RotateCcw, Calendar,
    CheckCircle, Clock, XCircle, FileText, User, Search
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import type { BreadcrumbItem } from '@/types';
import type { Aduan } from '@/types/models';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Aduan', href: '/admin/aduan' },
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
        search?: string;
        date_from?: string;
        date_to?: string;
    };
    stats: {
        total: number;
        masuk: number;
        diproses: number;
        ditindak: number;
        selesai: number;
        ditolak: number;
    };
    kategori_options: string[];
}

export default function AdminAduanIndex({ aduan, filters, stats, kategori_options }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    // Aksi column FIRST
    const columns = [
        {
            header: 'Aksi',
            accessor: (row: Aduan) => (
                <Link href={`/admin/aduan/${row.id}`} onClick={(e) => e.stopPropagation()}>
                    <Button variant="default" size="sm" className="bg-orange-600 hover:bg-orange-700">
                        <Eye className="h-4 w-4 mr-1" />
                        Kelola
                    </Button>
                </Link>
            ),
        },
        {
            header: 'ID',
            accessor: (row: Aduan) => <Badge variant="outline">#{row.id}</Badge>,
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
            accessor: (row: Aduan) => (
                <Badge variant="secondary">{row.kategori}</Badge>
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
            '/admin/aduan',
            { ...filters, ...updates },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSearch = () => {
        applyFilters({ search: search || undefined });
    };

    const hasActiveFilters = filters.status || filters.kategori || filters.search || filters.date_from || filters.date_to;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Aduan" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                    <AlertCircle className="h-8 w-8" />
                                    Manajemen Aduan
                                </h1>
                                <p className="text-orange-100 mt-1">
                                    Kelola dan tanggapi semua aduan dari warga
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <Card className="border-gray-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-gray-100">
                                        <FileText className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">{stats.total}</p>
                                        <p className="text-xs text-muted-foreground">Total</p>
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
                                        <p className="text-xl font-bold text-orange-600">{stats.masuk}</p>
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
                                        <p className="text-xl font-bold text-blue-600">{stats.diproses}</p>
                                        <p className="text-xs text-blue-600">Diproses</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-indigo-200 bg-indigo-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-indigo-100">
                                        <CheckCircle className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-indigo-600">{stats.ditindak}</p>
                                        <p className="text-xs text-indigo-600">Ditindak</p>
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
                                        <p className="text-xl font-bold text-green-600">{stats.selesai}</p>
                                        <p className="text-xs text-green-600">Selesai</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-red-200 bg-red-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-red-100">
                                        <XCircle className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-red-600">{stats.ditolak}</p>
                                        <p className="text-xs text-red-600">Ditolak</p>
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
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1">
                                        <Search className="h-3 w-3" />
                                        Cari
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Nama pelapor atau deskripsi..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                        <Button size="icon" variant="outline" onClick={handleSearch}>
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
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
                                <div className="space-y-2">
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
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Dari Tanggal
                                    </Label>
                                    <Input
                                        type="date"
                                        value={filters.date_from || ''}
                                        onChange={(e) => applyFilters({ date_from: e.target.value || undefined })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Sampai Tanggal
                                    </Label>
                                    <Input
                                        type="date"
                                        value={filters.date_to || ''}
                                        onChange={(e) => applyFilters({ date_to: e.target.value || undefined })}
                                    />
                                </div>
                            </div>
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => applyFilters({
                                        status: undefined,
                                        kategori: undefined,
                                        search: undefined,
                                        date_from: undefined,
                                        date_to: undefined,
                                    })}
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reset Filter
                                </Button>
                            )}
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
                                onRowClick={(row) => router.visit(`/admin/aduan/${row.id}`)}
                                mobileCard={(row) => (
                                    <div className="space-y-3">
                                        {/* Action First on Mobile */}
                                        <div className="flex items-center justify-between">
                                            <Link href={`/admin/aduan/${row.id}`} onClick={(e) => e.stopPropagation()}>
                                                <Button variant="default" size="sm" className="bg-orange-600 hover:bg-orange-700">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Kelola
                                                </Button>
                                            </Link>
                                            <StatusBadge status={row.status} />
                                        </div>

                                        <div className="pt-2 border-t">
                                            <div className="flex items-center gap-2 mb-1">
                                                <User className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium">{row.user?.name || '-'}</span>
                                            </div>
                                            <Badge variant="secondary" className="mb-2">{row.kategori}</Badge>
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
