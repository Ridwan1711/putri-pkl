import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/filter-bar';
import { DataTable } from '@/components/data-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { BreadcrumbItem } from '@/types';
import type { Petugas, Wilayah } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Petugas',
        href: '/admin/petugas',
    },
];

interface Props {
    petugas: {
        data: Petugas[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    wilayah: Wilayah[];
    filters: {
        search?: string;
        wilayah_id?: string;
    };
}

export default function PetugasIndex({ petugas, wilayah, filters }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        router.delete(`/admin/petugas/${id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteId(null),
        });
    };

    const columns = [
        {
            header: 'Nama Petugas',
            accessor: (row: Petugas) => row.user?.name || '-',
        },
        {
            header: 'Armada',
            accessor: (row: Petugas) => row.armada?.kode_armada || '-',
        },
        {
            header: 'Wilayah',
            accessor: (row: Petugas) => row.wilayah?.nama_wilayah || '-',
        },
        {
            header: 'Status',
            accessor: (row: Petugas) => (
                <span className={row.is_available ? 'text-green-600' : 'text-gray-500'}>
                    {row.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                </span>
            ),
        },
        {
            header: 'Aksi',
            accessor: (row: Petugas) => (
                <div className="flex gap-2">
                    <Link href={`/admin/petugas/${row.id}`}>
                        <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/admin/petugas/${row.id}/edit`}>
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
            <Head title="Petugas" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Petugas</h1>
                    <Link href="/admin/petugas/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Petugas
                        </Button>
                    </Link>
                </div>

                <FilterBar
                    searchPlaceholder="Cari nama petugas..."
                    searchValue={filters.search}
                    filters={[
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
                    data={petugas}
                    columns={columns}
                    onRowClick={(row) => router.visit(`/admin/petugas/${row.id}`)}
                    mobileCard={(row) => (
                        <div className="space-y-2">
                            <div className="font-semibold">{row.user?.name || '-'}</div>
                            <div className="text-sm text-muted-foreground">
                                {row.armada?.kode_armada || '-'} | {row.wilayah?.nama_wilayah || '-'}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={row.is_available ? 'text-green-600' : 'text-gray-500'}>
                                    {row.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                                </span>
                                <div className="flex gap-2">
                                    <Link href={`/admin/petugas/${row.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/petugas/${row.id}/edit`}>
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
                    title="Hapus Petugas"
                    description="Apakah Anda yakin ingin menghapus petugas ini? Tindakan ini tidak dapat dibatalkan."
                    confirmText="Hapus"
                    variant="destructive"
                    onConfirm={() => deleteId && handleDelete(deleteId)}
                />
            </div>
        </AppLayout>
    );
}
