import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/filter-bar';
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { BreadcrumbItem } from '@/types';
import type { Armada } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Armada',
        href: '/admin/armada',
    },
];

interface Props {
    armada: {
        data: Armada[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function ArmadaIndex({ armada, filters }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        router.delete(`/admin/armada/${id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteId(null),
        });
    };

    const columns = [
        {
            header: 'Kode Armada',
            accessor: (row: Armada) => row.kode_armada,
        },
        {
            header: 'Jenis Kendaraan',
            accessor: (row: Armada) => row.jenis_kendaraan,
        },
        {
            header: 'Plat Nomor',
            accessor: (row: Armada) => row.plat_nomor,
        },
        {
            header: 'Kapasitas',
            accessor: (row: Armada) => `${row.kapasitas} m³`,
        },
        {
            header: 'Status',
            accessor: (row: Armada) => <StatusBadge status={row.status} />,
        },
        {
            header: 'Aksi',
            accessor: (row: Armada) => (
                <div className="flex gap-2">
                    <Link href={`/admin/armada/${row.id}`}>
                        <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/admin/armada/${row.id}/edit`}>
                        <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(row.id);
                        }}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Armada" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Armada</h1>
                    <Link href="/admin/armada/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Armada
                        </Button>
                    </Link>
                </div>

                <FilterBar
                    searchPlaceholder="Cari kode armada, plat nomor, atau jenis kendaraan..."
                    searchValue={filters.search}
                    filters={[
                        {
                            name: 'status',
                            label: 'Status',
                            value: filters.status,
                            options: [
                                { value: 'aktif', label: 'Aktif' },
                                { value: 'perbaikan', label: 'Perbaikan' },
                                { value: 'nonaktif', label: 'Nonaktif' },
                            ],
                        },
                    ]}
                />

                <DataTable
                    data={armada}
                    columns={columns}
                    onRowClick={(row) => router.visit(`/admin/armada/${row.id}`)}
                    mobileCard={(row) => (
                        <div className="space-y-2">
                            <div className="font-semibold">{row.kode_armada}</div>
                            <div className="text-sm text-muted-foreground">
                                {row.jenis_kendaraan} - {row.plat_nomor}
                            </div>
                            <div className="flex items-center justify-between">
                                <StatusBadge status={row.status} />
                                <div className="flex gap-2">
                                    <Link href={`/admin/armada/${row.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/armada/${row.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteId(row.id);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                />

                <ConfirmDialog
                    open={deleteId !== null}
                    onOpenChange={(open) => !open && setDeleteId(null)}
                    title="Hapus Armada"
                    description="Apakah Anda yakin ingin menghapus armada ini? Tindakan ini tidak dapat dibatalkan."
                    confirmText="Hapus"
                    variant="destructive"
                    onConfirm={() => deleteId && handleDelete(deleteId)}
                />
            </div>
        </AppLayout>
    );
}
