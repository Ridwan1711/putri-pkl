import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, MapPin, Users, FileText } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapViewer } from '@/components/map/MapViewer';
import type { BreadcrumbItem } from '@/types';
import type { Wilayah, Petugas, PengajuanPengangkutan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wilayah',
        href: '/admin/wilayah',
    },
    {
        title: 'Detail',
        href: '#',
    },
];

interface Props {
    wilayah: Wilayah & {
        petugas?: Petugas[];
        pengajuan_pengangkutan?: PengajuanPengangkutan[];
    };
}

export default function WilayahShow({ wilayah }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Wilayah - ${wilayah.nama_wilayah}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/wilayah">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">{wilayah.nama_wilayah}</h1>
                    </div>
                    <Link href={`/admin/wilayah/${wilayah.id}/edit`}>
                        <Button>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                        <h2 className="mb-4 text-lg font-semibold">Informasi Wilayah</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nama Wilayah</p>
                                <p className="text-base">{wilayah.nama_wilayah}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Kecamatan</p>
                                <p className="text-base">{wilayah.kecamatan}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <p className={wilayah.is_active ? 'text-green-600' : 'text-gray-500'}>
                                    {wilayah.is_active ? 'Aktif' : 'Nonaktif'}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                            <Users className="h-5 w-5" />
                            Petugas ({wilayah.petugas?.length || 0})
                        </h2>
                        {wilayah.petugas && wilayah.petugas.length > 0 ? (
                            <div className="space-y-2">
                                {wilayah.petugas.map((petugas) => (
                                    <div key={petugas.id} className="rounded border p-2">
                                        <p className="font-medium">{petugas.user?.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {petugas.armada?.kode_armada} - {petugas.armada?.jenis_kendaraan}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Tidak ada petugas di wilayah ini</p>
                        )}
                    </Card>
                </div>

                {wilayah.geojson && (
                    <Card className="p-4">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                            <MapPin className="h-5 w-5" />
                            Peta Wilayah
                        </h2>
                        <MapViewer geojson={wilayah.geojson} height="400px" />
                    </Card>
                )}

                <Card className="p-4">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <FileText className="h-5 w-5" />
                        Pengajuan di Wilayah Ini ({wilayah.pengajuan_pengangkutan?.length || 0})
                    </h2>
                    {wilayah.pengajuan_pengangkutan && wilayah.pengajuan_pengangkutan.length > 0 ? (
                        <div className="space-y-2">
                            {wilayah.pengajuan_pengangkutan.slice(0, 10).map((pengajuan) => (
                                <Link
                                    key={pengajuan.id}
                                    href={`/admin/pengajuan/${pengajuan.id}`}
                                    className="block rounded border p-3 transition-colors hover:bg-muted"
                                >
                                    <p className="font-medium">{pengajuan.alamat_lengkap}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Status: {pengajuan.status} | Oleh: {pengajuan.user?.name}
                                    </p>
                                </Link>
                            ))}
                            {wilayah.pengajuan_pengangkutan.length > 10 && (
                                <p className="text-sm text-muted-foreground">
                                    ...dan {wilayah.pengajuan_pengangkutan.length - 10} pengajuan lainnya
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Tidak ada pengajuan di wilayah ini</p>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
