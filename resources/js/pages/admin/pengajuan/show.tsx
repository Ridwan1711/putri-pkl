import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, MapPin, User, Calendar, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/status-badge';
import { StatusTimeline } from '@/components/status-timeline';
import { MapViewer } from '@/components/map/MapViewer';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';
import type { PengajuanPengangkutan, Petugas, Armada } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengajuan',
        href: '/admin/pengajuan',
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
    petugas: Petugas[];
    armada: Armada[];
}

export default function PengajuanShow({ pengajuan, petugas, armada }: Props) {
    const [showAssignForm, setShowAssignForm] = useState(false);
    const [showStatusForm, setShowStatusForm] = useState(false);

    const assignForm = useForm({
        pengajuan_id: pengajuan.id.toString(),
        petugas_id: '',
        armada_id: '',
        jadwal_angkut: '',
    });

    const statusForm = useForm({
        status: pengajuan.status,
        keterangan: '',
    });

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();
        assignForm.post('/admin/pengajuan/assign', {
            preserveScroll: true,
            onSuccess: () => {
                setShowAssignForm(false);
                assignForm.reset();
            },
        });
    };

    const handleUpdateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        statusForm.post(`/admin/pengajuan/${pengajuan.id}/status`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowStatusForm(false);
                statusForm.reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Pengajuan - ${pengajuan.alamat_lengkap}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Link href="/admin/pengajuan">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                    <div className="flex gap-2">
                        {!showAssignForm && pengajuan.status === 'diverifikasi' && (
                            <Button onClick={() => setShowAssignForm(true)}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Assign Penugasan
                            </Button>
                        )}
                        {!showStatusForm && (
                            <Button variant="outline" onClick={() => setShowStatusForm(true)}>
                                Update Status
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Pengajuan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Warga</p>
                                <p className="text-base">{pengajuan.user?.name}</p>
                                <p className="text-sm text-muted-foreground">{pengajuan.user?.email}</p>
                            </div>
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
                                            Armada: {penugasan.armada?.kode_armada || '-'}
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

                {showAssignForm && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Assign Penugasan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAssign} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="petugas_id">Petugas *</Label>
                                    <Select
                                        value={assignForm.data.petugas_id}
                                        onValueChange={(value) => assignForm.setData('petugas_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Petugas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {petugas.map((p) => (
                                                <SelectItem key={p.id} value={p.id.toString()}>
                                                    {p.user?.name} - {p.wilayah?.nama_wilayah}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={assignForm.errors.petugas_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="armada_id">Armada</Label>
                                    <Select
                                        value={assignForm.data.armada_id}
                                        onValueChange={(value) => assignForm.setData('armada_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Armada (Opsional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Gunakan armada petugas</SelectItem>
                                            {armada.map((a) => (
                                                <SelectItem key={a.id} value={a.id.toString()}>
                                                    {a.kode_armada} - {a.jenis_kendaraan}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={assignForm.errors.armada_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="jadwal_angkut">Jadwal Angkut *</Label>
                                    <Input
                                        id="jadwal_angkut"
                                        type="datetime-local"
                                        value={assignForm.data.jadwal_angkut}
                                        onChange={(e) => assignForm.setData('jadwal_angkut', e.target.value)}
                                        required
                                    />
                                    <InputError message={assignForm.errors.jadwal_angkut} />
                                </div>

                                <div className="flex gap-2">
                                    <Button type="submit" disabled={assignForm.processing}>
                                        {assignForm.processing ? 'Menyimpan...' : 'Assign'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowAssignForm(false);
                                            assignForm.reset();
                                        }}
                                    >
                                        Batal
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {showStatusForm && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Update Status</CardTitle>
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
                                            <SelectItem value="diajukan">Diajukan</SelectItem>
                                            <SelectItem value="diverifikasi">Diverifikasi</SelectItem>
                                            <SelectItem value="dijadwalkan">Dijadwalkan</SelectItem>
                                            <SelectItem value="diangkut">Diangkut</SelectItem>
                                            <SelectItem value="selesai">Selesai</SelectItem>
                                            <SelectItem value="ditolak">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={statusForm.errors.status} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="keterangan">Keterangan</Label>
                                    <Textarea
                                        id="keterangan"
                                        value={statusForm.data.keterangan}
                                        onChange={(e) => statusForm.setData('keterangan', e.target.value)}
                                        rows={3}
                                    />
                                    <InputError message={statusForm.errors.keterangan} />
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
            </div>
        </AppLayout>
    );
}
