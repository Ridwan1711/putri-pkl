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
import type { Penugasan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penugasan',
        href: '/petugas/penugasan',
    },
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
        status?: string;
        tanggal?: string;
    };
}

export default function PenugasanIndex({ penugasan, filters }: Props) {
    const columns = [
        {
            header: 'Alamat',
            accessor: (row: Penugasan) => (
                <div className="max-w-xs truncate">
                    {row.pengajuan_pengangkutan?.alamat_lengkap || '-'}
                </div>
            ),
        },
        {
            header: 'Warga',
            accessor: (row: Penugasan) => row.pengajuan_pengangkutan?.user?.name || '-',
        },
        {
            header: 'Jadwal',
            accessor: (row: Penugasan) =>
                new Date(row.jadwal_angkut).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
        },
        {
            header: 'Status',
            accessor: (row: Penugasan) => <StatusBadge status={row.status} />,
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Penugasan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Penugasan</h1>

                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="grid gap-2 md:w-[180px]">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={filters.status || ''}
                                onValueChange={(value) =>
                                    router.get(
                                        window.location.pathname,
                                        { ...filters, status: value || undefined },
                                        { preserveState: true, preserveScroll: true, replace: true }
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Semua Status</SelectItem>
                                    <SelectItem value="aktif">Aktif</SelectItem>
                                    <SelectItem value="selesai">Selesai</SelectItem>
                                    <SelectItem value="batal">Batal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2 md:w-[180px]">
                            <Label htmlFor="tanggal">Tanggal</Label>
                            <Input
                                id="tanggal"
                                type="date"
                                value={filters.tanggal || ''}
                                onChange={(e) =>
                                    router.get(
                                        window.location.pathname,
                                        { ...filters, tanggal: e.target.value || undefined },
                                        { preserveState: true, preserveScroll: true, replace: true }
                                    )
                                }
                            />
                        </div>
                        {(filters.status || filters.tanggal) && (
                            <Button
                                variant="outline"
                                onClick={() =>
                                    router.get(window.location.pathname, {}, { preserveState: true, preserveScroll: true })
                                }
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                <DataTable
                    data={penugasan}
                    columns={columns}
                    onRowClick={(row) => router.visit(`/petugas/penugasan/${row.id}`)}
                    mobileCard={(row) => (
                        <div className="space-y-2">
                            <div className="font-semibold">
                                {row.pengajuan_pengangkutan?.alamat_lengkap || '-'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {row.pengajuan_pengangkutan?.user?.name || '-'}
                            </div>
                            <div className="flex items-center justify-between">
                                <StatusBadge status={row.status} />
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
