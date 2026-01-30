import { Head, Link, router } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/filter-bar';
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import type { BreadcrumbItem } from '@/types';
import type { PengajuanPengangkutan, Wilayah } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengajuan',
        href: '/admin/pengajuan',
    },
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
    wilayah: Wilayah[];
    filters: {
        status?: string;
        wilayah_id?: string;
        search?: string;
    };
}

export default function PengajuanIndex({ pengajuan, filters }: Props) {
    const columns = [
        {
            header: 'Warga',
            accessor: (row: PengajuanPengangkutan) => row.user?.name || '-',
        },
        {
            header: 'Alamat',
            accessor: (row: PengajuanPengangkutan) => (
                <div className="max-w-xs truncate">{row.alamat_lengkap}</div>
            ),
        },
        {
            header: 'Wilayah',
            accessor: (row: PengajuanPengangkutan) => row.wilayah?.nama_wilayah || '-',
        },
        {
            header: 'Status',
            accessor: (row: PengajuanPengangkutan) => <StatusBadge status={row.status} />,
        },
        {
            header: 'Tanggal',
            accessor: (row: PengajuanPengangkutan) =>
                new Date(row.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                }),
        },
        {
            header: 'Aksi',
            accessor: (row: PengajuanPengangkutan) => (
                <Link href={`/admin/pengajuan/${row.id}`}>
                    <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Pengajuan Pengangkutan</h1>

                <FilterBar
                    searchPlaceholder="Cari alamat atau nama warga..."
                    searchValue={filters.search}
                    filters={[
                        {
                            name: 'status',
                            label: 'Status',
                            value: filters.status,
                            options: [
                                { value: 'diajukan', label: 'Diajukan' },
                                { value: 'diverifikasi', label: 'Diverifikasi' },
                                { value: 'dijadwalkan', label: 'Dijadwalkan' },
                                { value: 'diangkut', label: 'Diangkut' },
                                { value: 'selesai', label: 'Selesai' },
                                { value: 'ditolak', label: 'Ditolak' },
                            ],
                        },
                        {
                            name: 'wilayah_id',
                            label: 'Wilayah',
                            value: filters.wilayah_id,
                            options: wilayah.map((w) => ({
                                value: w.id.toString(),
                                label: w.nama_wilayah,
                            })),
                        },
                    ]}
                />

                <DataTable
                    data={pengajuan}
                    columns={columns}
                    onRowClick={(row) => router.visit(`/admin/pengajuan/${row.id}`)}
                    mobileCard={(row) => (
                        <div className="space-y-2">
                            <div className="font-semibold">{row.user?.name}</div>
                            <div className="text-sm text-muted-foreground">{row.alamat_lengkap}</div>
                            <div className="flex items-center justify-between">
                                <StatusBadge status={row.status} />
                                <Link href={`/admin/pengajuan/${row.id}`}>
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
