import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/filter-bar';
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import type { BreadcrumbItem } from '@/types';
import type { PengajuanPengangkutan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengajuan',
        href: '/warga/pengajuan',
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
    filters: {
        status?: string;
    };
}

export default function PengajuanIndex({ pengajuan, filters }: Props) {
    const columns = [
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
                <Link href={`/warga/pengajuan/${row.id}`}>
                    <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan Saya" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Pengajuan Saya</h1>
                    <Link href="/warga/pengajuan/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Pengajuan
                        </Button>
                    </Link>
                </div>

                <FilterBar
                    searchPlaceholder=""
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
                    ]}
                />

                <DataTable
                    data={pengajuan}
                    columns={columns}
                    onRowClick={(row) => router.visit(`/warga/pengajuan/${row.id}`)}
                    mobileCard={(row) => (
                        <div className="space-y-2">
                            <div className="font-semibold">{row.alamat_lengkap}</div>
                            <div className="text-sm text-muted-foreground">
                                {row.wilayah?.nama_wilayah || '-'}
                            </div>
                            <div className="flex items-center justify-between">
                                <StatusBadge status={row.status} />
                                <Link href={`/warga/pengajuan/${row.id}`}>
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
