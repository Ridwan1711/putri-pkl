import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/filter-bar';
import { DataTable } from '@/components/data-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { BreadcrumbItem } from '@/types';
import type { Wilayah } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wilayah',
        href: '/admin/wilayah',
    },
];

interface Props {
    wilayah: {
        data: Wilayah[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
    };
}

export default function WilayahIndex({ wilayah, filters }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        router.delete(`/admin/wilayah/${id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteId(null),
        });
    };

    const columns = [
        {
            header: 'Nama Wilayah',
            accessor: (row: Wilayah) => row.nama_wilayah,
        },
        {
            header: 'Kecamatan',
            accessor: (row: Wilayah) => row.kecamatan,
        },
        {
            header: 'Status',
            accessor: (row: Wilayah) => (
                <span className={row.is_active ? 'text-green-600' : 'text-gray-500'}>
                    {row.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
            ),
        },
        {
            header: 'Aksi',
            accessor: (row: Wilayah) => (
                <div className="flex gap-2">
                    <Link href={`/admin/wilayah/${row.id}`}>
                        <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/admin/wilayah/${row.id}/edit`}>
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
            <Head title="Wilayah" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Wilayah</h1>
                    <Link href="/admin/wilayah/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Wilayah
                        </Button>
                    </Link>
                </div>

                <FilterBar
                    searchPlaceholder="Cari nama wilayah atau kecamatan..."
                    searchValue={filters.search}
                />

                <DataTable
                    data={wilayah}
                    columns={columns}
                    onRowClick={(row) => router.visit(`/admin/wilayah/${row.id}`)}
                    mobileCard={(row) => (
                        <div className="space-y-2">
                            <div className="font-semibold">{row.nama_wilayah}</div>
                            <div className="text-sm text-muted-foreground">{row.kecamatan}</div>
                            <div className="flex items-center justify-between">
                                <span className={row.is_active ? 'text-green-600' : 'text-gray-500'}>
                                    {row.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                                <div className="flex gap-2">
                                    <Link href={`/admin/wilayah/${row.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/wilayah/${row.id}/edit`}>
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
                    title="Hapus Wilayah"
                    description="Apakah Anda yakin ingin menghapus wilayah ini? Tindakan ini tidak dapat dibatalkan."
                    confirmText="Hapus"
                    variant="destructive"
                    onConfirm={() => deleteId && handleDelete(deleteId)}
                />
            </div>
        </AppLayout>
    );
}
