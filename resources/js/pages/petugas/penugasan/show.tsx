import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, MapPin, User, Calendar, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/status-badge';
import { StatusTimeline } from '@/components/status-timeline';
import { MapViewer } from '@/components/map/MapViewer';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';
import type { Penugasan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penugasan',
        href: '/petugas/penugasan',
    },
    {
        title: 'Detail',
        href: '#',
    },
];

interface Props {
    penugasan: Penugasan & {
        pengajuan_pengangkutan?: {
            id: number;
            alamat_lengkap: string;
            latitude: number | null;
            longitude: number | null;
            estimasi_volume: string | null;
            foto_sampah: string | null;
            status: string;
            user?: { name: string; email: string };
            wilayah?: { nama_wilayah: string };
            riwayat_status?: Array<{
                id: number;
                status: string;
                keterangan: string | null;
                changed_by: number;
                created_at: string;
                changed_by_user?: { name: string };
            }>;
        };
    };
}

export default function PenugasanShow({ penugasan }: Props) {
    const [showStatusForm, setShowStatusForm] = useState(false);

    const statusForm = useForm({
        status: penugasan.status,
    });

    const handleUpdateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        statusForm.post(`/petugas/penugasan/${penugasan.id}/status`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowStatusForm(false);
            },
        });
    };

    const pengajuan = penugasan.pengajuan_pengangkutan;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Penugasan - ${pengajuan?.alamat_lengkap}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Link href="/petugas/penugasan">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                    {!showStatusForm && penugasan.status === 'aktif' && (
                        <Button onClick={() => setShowStatusForm(true)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Update Status
                        </Button>
                    )}
                </div>

                {pengajuan && (
                    <>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Penugasan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                                        <StatusBadge status={penugasan.status} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Jadwal Angkut</p>
                                        <p className="text-base">
                                            {new Date(penugasan.jadwal_angkut).toLocaleString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Armada</p>
                                        <p className="text-base">
                                            {penugasan.armada?.kode_armada || '-'} -{' '}
                                            {penugasan.armada?.jenis_kendaraan || '-'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Informasi Warga
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Nama</p>
                                        <p className="text-base">{pengajuan.user?.name || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                                        <p className="text-base">{pengajuan.user?.email || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Wilayah</p>
                                        <p className="text-base">{pengajuan.wilayah?.nama_wilayah || '-'}</p>
                                    </div>
                                </CardContent>
                            </Card>

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
                                        <p className="text-sm font-medium text-muted-foreground">Estimasi Volume</p>
                                        <p className="text-base">{pengajuan.estimasi_volume || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Status Pengajuan</p>
                                        <StatusBadge status={pengajuan.status as any} />
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
                        </div>

                        {pengajuan.foto_sampah && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Foto Sampah</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <img
                                        src={`/storage/${pengajuan.foto_sampah}`}
                                        alt="Foto Sampah"
                                        className="w-full max-w-md rounded-lg"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {showStatusForm && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Update Status Penugasan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpdateStatus} className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="status">Status *</Label>
                                            <Select
                                                value={statusForm.data.status}
                                                onValueChange={(value: any) => statusForm.setData('status', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="aktif">Aktif</SelectItem>
                                                    <SelectItem value="selesai">Selesai</SelectItem>
                                                    <SelectItem value="batal">Batal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={statusForm.errors.status} />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button type="submit" disabled={statusForm.processing}>
                                                {statusForm.processing ? 'Menyimpan...' : 'Update Status'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setShowStatusForm(false);
                                                    statusForm.reset();
                                                }}
                                            >
                                                Batal
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

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
                    </>
                )}
            </div>
        </AppLayout>
    );
}
