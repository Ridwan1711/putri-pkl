import { Head, Link, router } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import type { BreadcrumbItem } from '@/types';
import type { Penugasan, Wilayah } from '@/types/models';

const STATUS_LABELS: Record<string, string> = {
    diajukan: 'Menunggu Konfirmasi',
    diverifikasi: 'Menunggu Konfirmasi',
    dijadwalkan: 'Sedang Diproses',
    diangkut: 'Dalam Perjalanan',
    selesai: 'Selesai',
    ditolak: 'Gagal',
};

const breadcrumbs: BreadcrumbItem[] = [
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
}

export default function PenugasanIndex({ penugasan, wilayah, filters }: Props) {
    const columns = [
        {
            header: 'Nama',
            accessor: (row: Penugasan) =>
                row.pengajuan_pengangkutan?.user?.name ?? row.pengajuan_pengangkutan?.nama_pemohon ?? '-',
        },
        {
            header: 'Kecamatan',
            accessor: (row: Penugasan) => row.pengajuan_pengangkutan?.wilayah?.kecamatan ?? '-',
        },
        {
            header: 'Desa',
            accessor: (row: Penugasan) => row.pengajuan_pengangkutan?.wilayah?.nama_wilayah ?? '-',
        },
        {
            header: 'No HP',
            accessor: (row: Penugasan) =>
                row.pengajuan_pengangkutan?.no_telepon ?? row.pengajuan_pengangkutan?.user?.email ?? '-',
        },
        {
            header: 'Tanggal',
            accessor: (row: Penugasan) =>
                new Date(row.jadwal_angkut).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }),
        },
        {
            header: 'Status',
            accessor: (row: Penugasan) => {
                const status = row.pengajuan_pengangkutan?.status ?? row.status;
                const label = STATUS_LABELS[status] ?? status;
                return <StatusBadge status={status as any} />;
            },
        },
        {
            header: 'Aksi',
            accessor: (row: Penugasan) => (
                <Link href={`/petugas/penugasan/${row.id}`}>
                    <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
            ),
        },
    ];

    const applyFilters = (updates: Record<string, string | undefined>) => {
        router.get(
            '/petugas/penugasan',
            { ...filters, ...updates },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Pengajuan Warga" />
            <div className="flex h-full flex-1 flex-col gap-4">
                <h1 className="text-2xl font-bold text-green-700">Data Pengajuan Warga</h1>

                <div className="space-y-4 rounded-lg border bg-white p-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="grid gap-2">
                            <Label>Kecamatan / Desa</Label>
                            <Select
                                value={filters.wilayah_id || 'all'}
                                onValueChange={(v) => applyFilters({ wilayah_id: v === 'all' ? undefined : v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    {wilayah.map((w) => (
                                        <SelectItem key={w.id} value={w.id.toString()}>
                                            {w.nama_wilayah} - {w.kecamatan}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Status</Label>
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
                        <div className="grid gap-2">
                            <Label>Tanggal</Label>
                            <Input
                                type="date"
                                value={filters.tanggal || ''}
                                onChange={(e) => applyFilters({ tanggal: e.target.value || undefined })}
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => applyFilters({ status: undefined, tanggal: undefined, wilayah_id: undefined })}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>

                <DataTable
                    data={penugasan}
                    columns={columns}
                    onRowClick={(row) => router.visit(`/petugas/penugasan/${row.id}`)}
                    mobileCard={(row) => (
                        <div className="space-y-2">
                            <div className="font-semibold">
                                {row.pengajuan_pengangkutan?.user?.name ?? row.pengajuan_pengangkutan?.nama_pemohon ?? '-'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {row.pengajuan_pengangkutan?.wilayah?.nama_wilayah} -{' '}
                                {row.pengajuan_pengangkutan?.wilayah?.kecamatan}
                            </div>
                            <div className="flex items-center justify-between">
                                <StatusBadge
                                    status={
                                        (row.pengajuan_pengangkutan?.status ?? row.status) as any
                                    }
                                />
                                <Link href={`/petugas/penugasan/${row.id}`}>
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                />
            </div>
        </AppLayout>
    );
}
