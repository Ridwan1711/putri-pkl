import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import type { BreadcrumbItem } from '@/types';
import type { Penugasan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Riwayat Pengangkutan', href: '/petugas/riwayat' },
];

interface Props {
    penugasan: {
        data: Penugasan[];
        current_page: number;
        last_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: { tanggal?: string };
}

export default function RiwayatIndex({ penugasan, filters }: Props) {
    const columns = [
        {
            header: 'Tanggal',
            accessor: (row: Penugasan) =>
                new Date(row.jadwal_angkut).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
        },
        {
            header: 'Alamat / Warga',
            accessor: (row: Penugasan) => (
                <div>
                    <p className="font-medium">
                        {row.pengajuan_pengangkutan?.alamat_lengkap ?? '-'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {row.pengajuan_pengangkutan?.user?.name ??
                            row.pengajuan_pengangkutan?.nama_pemohon ??
                            '-'}
                    </p>
                </div>
            ),
        },
        {
            header: 'Status',
            accessor: (row: Penugasan) => <StatusBadge status={row.status} />,
        },
        {
            header: 'Total Sampah (Kg)',
            accessor: (row: Penugasan) =>
                row.total_sampah_terangkut != null
                    ? row.total_sampah_terangkut.toLocaleString('id-ID')
                    : '-',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Pengangkutan" />
            <div className="flex h-full flex-1 flex-col gap-4">
                <h1 className="text-2xl font-bold text-green-700">Riwayat Pengangkutan</h1>

                <div className="flex flex-wrap gap-4">
                    <div className="grid gap-2">
                        <Label>Tanggal</Label>
                        <Input
                            type="date"
                            value={filters.tanggal || ''}
                            onChange={(e) =>
                                router.get('/petugas/riwayat', {
                                    ...filters,
                                    tanggal: e.target.value || undefined,
                                }, { preserveState: true })
                            }
                        />
                    </div>
                    {filters.tanggal && (
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    router.get('/petugas/riwayat', {}, { preserveState: true })
                                }
                            >
                                Reset
                            </Button>
                        </div>
                    )}
                </div>

                <DataTable
                    data={penugasan}
                    columns={columns}
                />
            </div>
        </AppLayout>
    );
}
