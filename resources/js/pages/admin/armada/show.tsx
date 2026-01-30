import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Users, Calendar } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import type { BreadcrumbItem } from '@/types';
import type { Armada, Petugas, Penugasan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Armada',
        href: '/admin/armada',
    },
    {
        title: 'Detail',
        href: '#',
    },
];

interface Props {
    armada: Armada & {
        petugas?: Petugas[];
        penugasan?: Penugasan[];
    };
}

export default function ArmadaShow({ armada }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Armada - ${armada.kode_armada}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/armada">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">{armada.kode_armada}</h1>
                    </div>
                    <Link href={`/admin/armada/${armada.id}/edit`}>
                        <Button>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                        <h2 className="mb-4 text-lg font-semibold">Informasi Armada</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Kode Armada</p>
                                <p className="text-base">{armada.kode_armada}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Jenis Kendaraan</p>
                                <p className="text-base">{armada.jenis_kendaraan}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Plat Nomor</p>
                                <p className="text-base">{armada.plat_nomor}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Kapasitas</p>
                                <p className="text-base">{armada.kapasitas} m³</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <StatusBadge status={armada.status} />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                            <Users className="h-5 w-5" />
                            Petugas ({armada.petugas?.length || 0})
                        </h2>
                        {armada.petugas && armada.petugas.length > 0 ? (
                            <div className="space-y-2">
                                {armada.petugas.map((petugas) => (
                                    <Link
                                        key={petugas.id}
                                        href={`/admin/petugas/${petugas.id}`}
                                        className="block rounded border p-2 transition-colors hover:bg-muted"
                                    >
                                        <p className="font-medium">{petugas.user?.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {petugas.wilayah?.nama_wilayah}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Tidak ada petugas menggunakan armada ini</p>
                        )}
                    </Card>
                </div>

                <Card className="p-4">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <Calendar className="h-5 w-5" />
                        Penugasan ({armada.penugasan?.length || 0})
                    </h2>
                    {armada.penugasan && armada.penugasan.length > 0 ? (
                        <div className="space-y-2">
                            {armada.penugasan.slice(0, 10).map((penugasan) => (
                                <div key={penugasan.id} className="rounded border p-3">
                                    <p className="font-medium">
                                        {penugasan.pengajuan_pengangkutan?.alamat_lengkap}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Petugas: {penugasan.petugas?.user?.name} |{' '}
                                        {new Date(penugasan.jadwal_angkut).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                    <StatusBadge status={penugasan.status} />
                                </div>
                            ))}
                            {armada.penugasan.length > 10 && (
                                <p className="text-sm text-muted-foreground">
                                    ...dan {armada.penugasan.length - 10} penugasan lainnya
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Tidak ada penugasan untuk armada ini</p>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
