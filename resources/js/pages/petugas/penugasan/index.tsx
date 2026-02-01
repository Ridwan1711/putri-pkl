import { Head, Link, router } from '@inertiajs/react';
import {
    Eye, ClipboardList, CheckCircle, XCircle, Clock,
    Filter, RotateCcw, MapPin, Calendar, Building
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
import type { Penugasan, Wilayah } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/petugas/dashboard' },
    { title: 'Daftar Tugas', href: '/petugas/penugasan' },
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
    wilayah: Wilayah[];
    filters: {
        status?: string;
        tanggal?: string;
        wilayah_id?: string;
    };
    stats?: {
        total: number;
        aktif: number;
        selesai: number;
        batal: number;
    };
}

export default function PenugasanIndex({ penugasan, wilayah, filters, stats }: Props) {
    // Calculate stats from data if not provided
    const calculatedStats = stats || {
        total: penugasan.total,
        aktif: penugasan.data.filter(p => p.status === 'aktif').length,
        selesai: penugasan.data.filter(p => p.status === 'selesai').length,
        batal: penugasan.data.filter(p => p.status === 'batal').length,
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
            header: 'Nama Warga',
            accessor: (row: Penugasan) => (
                <div>
                    <p className="font-medium">
                        {row.pengajuan_pengangkutan?.user?.name ?? row.pengajuan_pengangkutan?.nama_pemohon ?? '-'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {row.pengajuan_pengangkutan?.no_telepon ?? row.pengajuan_pengangkutan?.user?.email ?? '-'}
                    </p>
                </div>
            ),
        },
        {
            header: 'Lokasi',
            accessor: (row: Penugasan) => (
                <div>
                    <p className="font-medium">{row.pengajuan_pengangkutan?.wilayah?.nama_wilayah ?? '-'}</p>
                    <p className="text-xs text-muted-foreground">
                        {row.pengajuan_pengangkutan?.wilayah?.kecamatan ?? '-'}
                    </p>
                </div>
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
            header: 'Status',
            accessor: (row: Penugasan) => {
                const status = row.pengajuan_pengangkutan?.status ?? row.status;
                return <StatusBadge status={status as any} />;
            },
        },
    ];

    const applyFilters = (updates: Record<string, string | undefined>) => {
        router.get(
            '/petugas/penugasan',
            { ...filters, ...updates },
            { preserveState: true, preserveScroll: true }
        );
    };

    const hasActiveFilters = filters.status || filters.tanggal || filters.wilayah_id;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Tugas" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                    <ClipboardList className="h-8 w-8" />
                                    Daftar Tugas
                                </h1>
                                <p className="text-green-100 mt-1">
                                    Kelola semua penugasan pengangkutan sampah
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
                                        <ClipboardList className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{calculatedStats.total}</p>
                                        <p className="text-xs text-muted-foreground">Total</p>
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
                                        <p className="text-2xl font-bold text-blue-600">{calculatedStats.aktif}</p>
                                        <p className="text-xs text-blue-600">Aktif</p>
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
                                        <Building className="h-3 w-3" />
                                        Wilayah
                                    </Label>
                                    <Select
                                        value={filters.wilayah_id || 'all'}
                                        onValueChange={(v) => applyFilters({ wilayah_id: v === 'all' ? undefined : v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua Wilayah" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Wilayah</SelectItem>
                                            {wilayah.map((w) => (
                                                <SelectItem key={w.id} value={w.id.toString()}>
                                                    {w.nama_wilayah} - {w.kecamatan}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                            <SelectItem value="aktif">Aktif</SelectItem>
                                            <SelectItem value="selesai">Selesai</SelectItem>
                                            <SelectItem value="batal">Batal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
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
                                <div className="flex items-end">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => applyFilters({ status: undefined, tanggal: undefined, wilayah_id: undefined })}
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
                            <CardTitle>Data Penugasan</CardTitle>
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
                                            <StatusBadge
                                                status={(row.pengajuan_pengangkutan?.status ?? row.status) as any}
                                            />
                                        </div>

                                        <div className="pt-2 border-t">
                                            <p className="font-semibold">
                                                {row.pengajuan_pengangkutan?.user?.name ?? row.pengajuan_pengangkutan?.nama_pemohon ?? '-'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {row.pengajuan_pengangkutan?.no_telepon ?? '-'}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {row.pengajuan_pengangkutan?.wilayah?.nama_wilayah ?? '-'}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(row.jadwal_angkut).toLocaleDateString('id-ID', {
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
