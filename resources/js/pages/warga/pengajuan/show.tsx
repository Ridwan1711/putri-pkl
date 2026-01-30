import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, Image as ImageIcon, Calendar, User } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { StatusTimeline } from '@/components/status-timeline';
import { MapViewer } from '@/components/map/MapViewer';
import type { BreadcrumbItem } from '@/types';
import type { PengajuanPengangkutan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengajuan',
        href: '/warga/pengajuan',
    },
    {
        title: 'Detail',
        href: '#',
    },
];

interface Props {
    pengajuan: PengajuanPengangkutan & {
        riwayat_status?: Array<{
            id: number;
            status: string;
            keterangan: string | null;
            changed_by: number;
            created_at: string;
            changed_by_user?: { name: string };
        }>;
        lampiran?: Array<{ id: number; file_path: string }>;
    };
}

export default function PengajuanShow({ pengajuan }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Pengajuan - ${pengajuan.alamat_lengkap}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Link href="/warga/pengajuan">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                </Link>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Pengajuan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Alamat Lengkap</p>
                                <p className="text-base">{pengajuan.alamat_lengkap}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Wilayah</p>
                                <p className="text-base">{pengajuan.wilayah?.nama_wilayah || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Estimasi Volume</p>
                                <p className="text-base">{pengajuan.estimasi_volume || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <StatusBadge status={pengajuan.status} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Tanggal Dibuat</p>
                                <p className="text-base">
                                    {new Date(pengajuan.created_at).toLocaleString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {pengajuan.latitude && pengajuan.longitude && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Lokasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <MapViewer
                                    latitude={pengajuan.latitude}
                                    longitude={pengajuan.longitude}
                                    height="300px"
                                />
                            </CardContent>
                        </Card>
                    )}

                    {pengajuan.foto_sampah && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" />
                                    Foto Sampah
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <img
                                    src={`/storage/${pengajuan.foto_sampah}`}
                                    alt="Foto Sampah"
                                    className="w-full rounded-lg"
                                />
                            </CardContent>
                        </Card>
                    )}

                    {pengajuan.penugasan && pengajuan.penugasan.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Penugasan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {pengajuan.penugasan.map((penugasan) => (
                                    <div key={penugasan.id} className="rounded border p-3">
                                        <p className="font-medium">
                                            Petugas: {penugasan.petugas?.user?.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Armada: {penugasan.armada?.kode_armada || '-'} -{' '}
                                            {penugasan.armada?.jenis_kendaraan || '-'}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Jadwal:{' '}
                                            {new Date(penugasan.jadwal_angkut).toLocaleString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                        <StatusBadge status={penugasan.status} />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {pengajuan.riwayat_status && pengajuan.riwayat_status.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StatusTimeline
                                riwayat={pengajuan.riwayat_status.map((r) => ({
                                    id: r.id,
                                    ref_type: 'pengajuan' as const,
                                    ref_id: pengajuan.id,
                                    status: r.status,
                                    keterangan: r.keterangan,
                                    changed_by: r.changed_by,
                                    created_at: r.created_at,
                                    updated_at: r.created_at,
                                    changed_by_user: r.changed_by_user,
                                }))}
                            />
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
