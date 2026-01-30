import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/filter-bar';
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import type { BreadcrumbItem } from '@/types';
import type { Aduan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Aduan',
        href: '/warga/aduan',
    },
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
}

export default function AduanIndex({ aduan, filters }: Props) {
    const columns = [
        {
            header: 'Kategori',
            accessor: (row: Aduan) => row.kategori,
        },
        {
            header: 'Deskripsi',
            accessor: (row: Aduan) => (
                <div className="max-w-xs truncate">{row.deskripsi}</div>
            ),
        },
        {
            header: 'Status',
            accessor: (row: Aduan) => <StatusBadge status={row.status} />,
        },
        {
            header: 'Tanggal',
            accessor: (row: Aduan) =>
                new Date(row.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                }),
        },
        {
            header: 'Aksi',
            accessor: (row: Aduan) => (
                <Link href={`/warga/aduan/${row.id}`}>
                    <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Aduan Saya" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Aduan Saya</h1>
                    <Link href="/warga/aduan/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Aduan
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
                                { value: 'masuk', label: 'Masuk' },
                                { value: 'diproses', label: 'Diproses' },
                                { value: 'ditindak', label: 'Ditindak' },
                                { value: 'selesai', label: 'Selesai' },
                                { value: 'ditolak', label: 'Ditolak' },
                            ],
                        },
                        {
                            name: 'kategori',
                            label: 'Kategori',
                            value: filters.kategori,
                            options: [
                                { value: 'Sampah Menumpuk', label: 'Sampah Menumpuk' },
                                { value: 'Bau Tidak Sedap', label: 'Bau Tidak Sedap' },
                                { value: 'Lokasi Tidak Terjangkau', label: 'Lokasi Tidak Terjangkau' },
                                { value: 'Lainnya', label: 'Lainnya' },
                            ],
                        },
                    ]}
                />

                <DataTable
                    data={aduan}
                    columns={columns}
                    onRowClick={(row) => router.visit(`/warga/aduan/${row.id}`)}
                    mobileCard={(row) => (
                        <div className="space-y-2">
                            <div className="font-semibold">{row.kategori}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">{row.deskripsi}</div>
                            <div className="flex items-center justify-between">
                                <StatusBadge status={row.status} />
                                <Link href={`/warga/aduan/${row.id}`}>
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
