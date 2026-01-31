import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, ArrowLeft, MapPin } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { BreadcrumbItem } from '@/types';
import type { Wilayah, Kampung } from '@/types/models';

interface Props {
    wilayah: Wilayah;
    kampung: Kampung[];
}

export default function KampungIndex({ wilayah, kampung }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/wilayah/${wilayah.id}/kampung/${deleteId}`, {
                preserveScroll: true,
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Wilayah', href: '/admin/wilayah' },
        { title: wilayah.nama_wilayah, href: `/admin/wilayah/${wilayah.id}` },
        { title: 'Kampung', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Kampung - ${wilayah.nama_wilayah}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/admin/wilayah/${wilayah.id}`}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Kampung - {wilayah.nama_wilayah}</h1>
                            <p className="text-sm text-muted-foreground">Kelola kampung/dusun di desa ini</p>
                        </div>
                    </div>
                    <Link href={`/admin/wilayah/${wilayah.id}/kampung/create`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Kampung
                        </Button>
                    </Link>
                </div>

                <Card className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-semibold">No</th>
                                    <th className="text-left py-3 px-4 font-semibold">Nama Kampung</th>
                                    <th className="text-left py-3 px-4 font-semibold">Koordinat</th>
                                    <th className="text-left py-3 px-4 font-semibold">Urutan Rute</th>
                                    <th className="text-left py-3 px-4 font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kampung.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                            Belum ada kampung. Tambahkan kampung untuk jadwal rutin.
                                        </td>
                                    </tr>
                                ) : (
                                    kampung.map((k, i) => (
                                        <tr key={k.id} className="border-b hover:bg-muted/50">
                                            <td className="py-3 px-4">{i + 1}</td>
                                            <td className="py-3 px-4 font-medium">{k.nama_kampung}</td>
                                            <td className="py-3 px-4 text-sm">
                                                {k.latitude && k.longitude ? (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {k.latitude}, {k.longitude}
                                                    </span>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="py-3 px-4">{k.urutan_rute ?? 0}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-2">
                                                    <Link href={`/admin/wilayah/${wilayah.id}/kampung/${k.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-destructive"
                                                        onClick={() => setDeleteId(k.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <ConfirmDialog
                    open={deleteId !== null}
                    onOpenChange={(open) => !open && setDeleteId(null)}
                    title="Hapus Kampung"
                    description="Apakah Anda yakin ingin menghapus kampung ini?"
                    confirmText="Hapus"
                    cancelText="Batal"
                    variant="destructive"
                    onConfirm={handleDelete}
                />
            </div>
        </AppLayout>
    );
}
