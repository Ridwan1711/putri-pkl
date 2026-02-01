import { Head, Link, router } from '@inertiajs/react';
import {
    Eye, History, Calendar, Filter, RotateCcw,
    Trash2, CheckCircle, XCircle, MapPin
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import type { BreadcrumbItem } from '@/types';
import type { Penugasan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/petugas/dashboard' },
    { title: 'Riwayat', href: '/petugas/riwayat' },
];

interface Props {
    penugasan: {
        data: Penugasan[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        tanggal?: string;
        status?: string;
    };
    stats?: {
        total: number;
        selesai: number;
        batal: number;
        total_sampah: number;
    };
}

export default function RiwayatIndex({ penugasan, filters, stats }: Props) {
    // Calculate stats from data if not provided
    const calculatedStats = stats || {
        total: penugasan.total,
        selesai: penugasan.data.filter(p => p.status === 'selesai').length,
        batal: penugasan.data.filter(p => p.status === 'batal').length,
        total_sampah: penugasan.data.reduce((sum, p) => sum + (p.total_sampah_terangkut || 0), 0),
    };

    // Aksi column FIRST
    const columns = [
        {
            header: 'Aksi',
            accessor: (row: Penugasan) => (
                <Link href={`/petugas/penugasan/${row.id}`} onClick={(e) => e.stopPropagation()}>
                    <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                        <Eye className="h-4 w-4 mr-1" />
                        Lihat
                    </Button>
                </Link>
            ),
        },
        {
            header: 'Tanggal',
            accessor: (row: Penugasan) => (
                <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>
                        {new Date(row.jadwal_angkut).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })}
                    </span>
                </div>
            ),
        },
        {
            header: 'Warga / Alamat',
            accessor: (row: Penugasan) => (
                <div>
                    <p className="font-medium">
                        {row.pengajuan_pengangkutan?.user?.name ?? row.pengajuan_pengangkutan?.nama_pemohon ?? '-'}
                    </p>
                    <p className="text-sm text-muted-foreground truncate max-w-xs">
                        {row.pengajuan_pengangkutan?.alamat_lengkap ?? '-'}
                    </p>
                </div>
            ),
        },
        {
            header: 'Status',
            accessor: (row: Penugasan) => <StatusBadge status={row.status} />,
        },
        {
            header: 'Total Sampah',
            accessor: (row: Penugasan) => (
                <div className="flex items-center gap-1">
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">
                        {row.total_sampah_terangkut != null
                            ? `${row.total_sampah_terangkut.toLocaleString('id-ID')} Kg`
                            : '-'}
                    </span>
                </div>
            ),
        },
    ];

    const applyFilters = (updates: Record<string, string | undefined>) => {
        router.get(
            '/petugas/riwayat',
            { ...filters, ...updates },
            { preserveState: true, preserveScroll: true }
        );
    };

    const hasActiveFilters = filters.tanggal || filters.status;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Pengangkutan" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                    <History className="h-8 w-8" />
                                    Riwayat Pengangkutan
                                </h1>
                                <p className="text-green-100 mt-1">
                                    Catatan semua pengangkutan yang telah selesai
                                </p>
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
                                        <History className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{calculatedStats.total}</p>
                                        <p className="text-xs text-muted-foreground">Total Riwayat</p>
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
                        <Card className="border-red-200 bg-red-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-red-100">
                                        <XCircle className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-red-600">{calculatedStats.batal}</p>
                                        <p className="text-xs text-red-600">Batal</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-blue-200 bg-blue-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-blue-100">
                                        <Trash2 className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {calculatedStats.total_sampah.toLocaleString('id-ID')}
                                        </p>
                                        <p className="text-xs text-blue-600">Kg Terangkut</p>
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
                                Filter Data
                                {hasActiveFilters && (
                                    <Badge variant="secondary" className="ml-2">Aktif</Badge>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Tanggal
                                    </Label>
                                    <Input
                                        type="date"
                                        value={filters.tanggal || ''}
                                        onChange={(e) => applyFilters({ tanggal: e.target.value || undefined })}
                                    />
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
                                            <SelectItem value="selesai">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                                    Selesai
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="batal">
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="h-3 w-3 text-red-500" />
                                                    Batal
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end sm:col-span-2 lg:col-span-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => applyFilters({ tanggal: undefined, status: undefined })}
                                        disabled={!hasActiveFilters}
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset Filter
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Riwayat</CardTitle>
                            <CardDescription>
                                Menampilkan {penugasan.data.length} dari {penugasan.total} data
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                data={penugasan}
                                columns={columns}
                                onRowClick={(row) => router.visit(`/petugas/penugasan/${row.id}`)}
                                mobileCard={(row) => (
                                    <div className="space-y-3">
                                        {/* Action First on Mobile */}
                                        <div className="flex items-center justify-between">
                                            <Link href={`/petugas/penugasan/${row.id}`} onClick={(e) => e.stopPropagation()}>
                                                <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Lihat Detail
                                                </Button>
                                            </Link>
                                            <StatusBadge status={row.status} />
                                        </div>

                                        <div className="pt-2 border-t">
                                            <p className="font-semibold">
                                                {row.pengajuan_pengangkutan?.user?.name ?? row.pengajuan_pengangkutan?.nama_pemohon ?? '-'}
                                            </p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {row.pengajuan_pengangkutan?.alamat_lengkap ?? '-'}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(row.jadwal_angkut).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                            <div className="flex items-center gap-1 font-medium">
                                                <Trash2 className="h-3 w-3 text-green-600" />
                                                {row.total_sampah_terangkut != null
                                                    ? `${row.total_sampah_terangkut.toLocaleString('id-ID')} Kg`
                                                    : '-'}
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
