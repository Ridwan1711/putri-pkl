import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Calendar, User, Truck, MapPin } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import type { BreadcrumbItem } from '@/types';
import type { Petugas, Penugasan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Petugas',
        href: '/admin/petugas',
    },
    {
        title: 'Detail',
        href: '#',
    },
];

interface Props {
    petugas: Petugas & {
        penugasan?: Penugasan[];
    };
}

export default function PetugasShow({ petugas }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Petugas - ${petugas.user?.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/petugas">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">{petugas.user?.name}</h1>
                    </div>
                    <Link href={`/admin/petugas/${petugas.id}/edit`}>
                        <Button>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                            <User className="h-5 w-5" />
                            Informasi Petugas
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nama</p>
                                <p className="text-base">{petugas.user?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p className="text-base">{petugas.user?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <p className={petugas.is_available ? 'text-green-600' : 'text-gray-500'}>
                                    {petugas.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                            <Truck className="h-5 w-5" />
                            Armada
                        </h2>
                        {petugas.armada ? (
                            <div className="space-y-2">
                                <p className="font-medium">{petugas.armada.kode_armada}</p>
                                <p className="text-sm text-muted-foreground">
                                    {petugas.armada.jenis_kendaraan} - {petugas.armada.plat_nomor}
                                </p>
                                <StatusBadge status={petugas.armada.status} />
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Tidak ada armada</p>
                        )}
                    </Card>

                    <Card className="p-4">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                            <MapPin className="h-5 w-5" />
                            Wilayah
                        </h2>
                        {petugas.wilayah ? (
                            <div>
                                <p className="font-medium">{petugas.wilayah.nama_wilayah}</p>
                                <p className="text-sm text-muted-foreground">{petugas.wilayah.kecamatan}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Tidak ada wilayah</p>
                        )}
                    </Card>
                </div>

                <Card className="p-4">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <Calendar className="h-5 w-5" />
                        Penugasan ({petugas.penugasan?.length || 0})
                    </h2>
                    {petugas.penugasan && petugas.penugasan.length > 0 ? (
                        <div className="space-y-2">
                            {petugas.penugasan.slice(0, 10).map((penugasan) => (
                                <Link
                                    key={penugasan.id}
                                    href={`/admin/pengajuan/${penugasan.pengajuan_pengangkutan?.id}`}
                                    className="block rounded border p-3 transition-colors hover:bg-muted"
                                >
                                    <p className="font-medium">
                                        {penugasan.pengajuan_pengangkutan?.alamat_lengkap}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(penugasan.jadwal_angkut).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                    <StatusBadge status={penugasan.status} />
                                </Link>
                            ))}
                            {petugas.penugasan.length > 10 && (
                                <p className="text-sm text-muted-foreground">
                                    ...dan {petugas.penugasan.length - 10} penugasan lainnya
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Tidak ada penugasan</p>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
