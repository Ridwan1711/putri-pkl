import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Users, Calendar, Truck, Wrench, FileText } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/status-badge';
import type { BreadcrumbItem } from '@/types';
import type { Armada, Petugas, Penugasan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Armada', href: '/admin/armada' },
    { title: 'Detail', href: '#' },
];

function formatDate(value: string | null | undefined): string {
    if (!value) return '-';
    const d = new Date(value);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

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
                        <div>
                            <h1 className="text-2xl font-bold">{armada.kode_armada}</h1>
                            <p className="text-muted-foreground">{armada.plat_nomor}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge status={armada.status} />
                        {armada.is_available && (
                            <Badge variant="outline">Tersedia</Badge>
                        )}
                        <Link href={`/admin/armada/${armada.id}/edit`}>
                            <Button>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                            <Truck className="h-5 w-5 text-blue-500" />
                            Informasi Armada
                        </h2>
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
                                <p className="text-base font-mono">{armada.plat_nomor}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Kapasitas</p>
                                <p className="text-base">{armada.kapasitas} m³</p>
                            </div>
                            {armada.merk && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Merk</p>
                                    <p className="text-base">{armada.merk}</p>
                                </div>
                            )}
                            {armada.tahun_pembuatan && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tahun Pembuatan</p>
                                    <p className="text-base">{armada.tahun_pembuatan}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <StatusBadge status={armada.status} />
                            </div>
                        </div>
                    </Card>

                <Card className="p-4">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <Wrench className="h-5 w-5 text-orange-500" />
                        Data Teknis
                    </h2>
                    <div className="space-y-3">
                        {armada.nomor_rangka && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nomor Rangka (VIN)</p>
                                <p className="text-base font-mono">{armada.nomor_rangka}</p>
                            </div>
                        )}
                        {armada.nomor_mesin && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nomor Mesin</p>
                                <p className="text-base font-mono">{armada.nomor_mesin}</p>
                            </div>
                        )}
                        {armada.bahan_bakar && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Bahan Bakar</p>
                                <p className="text-base capitalize">{armada.bahan_bakar}</p>
                            </div>
                        )}
                        {armada.konsumsi_bahan_bakar != null && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Konsumsi Bahan Bakar</p>
                                <p className="text-base">{armada.konsumsi_bahan_bakar} km/L</p>
                            </div>
                        )}
                        {armada.lokasi_parkir && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Lokasi Parkir</p>
                                <p className="text-base">{armada.lokasi_parkir}</p>
                            </div>
                        )}
                        {!armada.nomor_rangka && !armada.nomor_mesin && !armada.bahan_bakar && !armada.lokasi_parkir && (
                            <p className="text-sm text-muted-foreground">Belum ada data teknis</p>
                        )}
                    </div>
                </Card>

                <Card className="p-4">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <FileText className="h-5 w-5 text-purple-500" />
                        Dokumen
                    </h2>
                    <div className="space-y-3">
                        {armada.tanggal_stnk && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Masa Berlaku STNK</p>
                                <p className="text-base">{formatDate(armada.tanggal_stnk)}</p>
                            </div>
                        )}
                        {armada.tanggal_keur && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Masa Berlaku KIR</p>
                                <p className="text-base">{formatDate(armada.tanggal_keur)}</p>
                            </div>
                        )}
                        {armada.asuransi && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Asuransi</p>
                                <p className="text-base">{armada.asuransi}</p>
                            </div>
                        )}
                        {armada.kontrak_sewa && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Kontrak Sewa</p>
                                <p className="text-base">{armada.kontrak_sewa}</p>
                            </div>
                        )}
                        {!armada.tanggal_stnk && !armada.tanggal_keur && !armada.asuransi && !armada.kontrak_sewa && (
                            <p className="text-sm text-muted-foreground">Belum ada data dokumen</p>
                        )}
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

                {armada.keterangan && (
                    <Card className="p-4">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">Keterangan</h2>
                        <p className="text-base text-muted-foreground whitespace-pre-wrap">{armada.keterangan}</p>
                    </Card>
                )}

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
