import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft, MapPin, User, Calendar, CheckCircle, Truck,
    Clock, FileText, Phone, Mail, Image, History, Navigation,
    Save, XCircle, AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/status-badge';
import { StatusTimeline } from '@/components/status-timeline';
import { MapViewer } from '@/components/map/MapViewer';
import InputError from '@/components/input-error';
import { toast } from 'react-hot-toast';
import type { BreadcrumbItem } from '@/types';
import type { Penugasan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/petugas/dashboard' },
    { title: 'Penugasan', href: '/petugas/penugasan' },
    { title: 'Detail', href: '#' },
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
            no_telepon?: string;
            nama_pemohon?: string;
            email?: string;
            user?: { name: string; email: string };
            wilayah?: { nama_wilayah: string; kecamatan?: string };
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
    const [activeTab, setActiveTab] = useState('penugasan');
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
                toast.success('Status berhasil diperbarui');
            },
            onError: () => {
                toast.error('Gagal memperbarui status');
            },
        });
    };

    const pengajuan = penugasan.pengajuan_pengangkutan;
    const wargaName = pengajuan?.user?.name ?? pengajuan?.nama_pemohon ?? 'Warga';

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'aktif': return 'bg-blue-500';
            case 'selesai': return 'bg-green-500';
            case 'batal': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Penugasan - ${wargaName}`} />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header */}
                <div className={`bg-gradient-to-r ${
                    penugasan.status === 'selesai' ? 'from-green-600 to-green-700' :
                    penugasan.status === 'batal' ? 'from-red-600 to-red-700' :
                    'from-blue-600 to-blue-700'
                } text-white`}>
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Link href="/petugas/penugasan">
                                    <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="secondary" className="bg-white/20 text-white border-0">
                                            #{penugasan.id}
                                        </Badge>
                                        <Badge variant="secondary" className={`${getStatusColor(penugasan.status)} text-white border-0`}>
                                            {penugasan.status === 'aktif' ? 'Aktif' :
                                             penugasan.status === 'selesai' ? 'Selesai' : 'Batal'}
                                        </Badge>
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-bold">
                                        {wargaName}
                                    </h1>
                                    <p className="text-white/80 mt-1 flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {pengajuan?.wilayah?.nama_wilayah ?? 'Lokasi tidak diketahui'}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-2">
                                {penugasan.status === 'aktif' && !showStatusForm && (
                                    <Button
                                        onClick={() => setShowStatusForm(true)}
                                        className="bg-white text-green-700 hover:bg-green-50"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Update Status
                                    </Button>
                                )}
                                {pengajuan?.latitude && pengajuan?.longitude && (
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${pengajuan.latitude},${pengajuan.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                                            <Navigation className="h-4 w-4 mr-2" />
                                            Navigasi
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6">
                    {/* Status Update Form (Floating) */}
                    {showStatusForm && (
                        <Card className="mb-6 border-2 border-green-200 bg-green-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-700">
                                    <CheckCircle className="h-5 w-5" />
                                    Update Status Penugasan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUpdateStatus} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="status">Pilih Status Baru *</Label>
                                        <Select
                                            value={statusForm.data.status}
                                            onValueChange={(value: any) => statusForm.setData('status', value)}
                                        >
                                            <SelectTrigger className="bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="aktif">
                                                    <div className="flex items-center gap-2">
                                                        <AlertCircle className="h-4 w-4 text-blue-500" />
                                                        Aktif
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="selesai">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                        Selesai
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="batal">
                                                    <div className="flex items-center gap-2">
                                                        <XCircle className="h-4 w-4 text-red-500" />
                                                        Batal
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={statusForm.errors.status} />
                                    </div>

                                    <div className="flex gap-2">
                                        <Button type="submit" disabled={statusForm.processing} className="bg-green-600 hover:bg-green-700">
                                            <Save className="h-4 w-4 mr-2" />
                                            {statusForm.processing ? 'Menyimpan...' : 'Simpan Status'}
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

                    {pengajuan && (
                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Main Content */}
                            <div className="lg:col-span-2">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="penugasan" className="flex items-center gap-1">
                                            <Truck className="h-4 w-4" />
                                            <span className="hidden sm:inline">Penugasan</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="warga" className="flex items-center gap-1">
                                            <User className="h-4 w-4" />
                                            <span className="hidden sm:inline">Warga</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="lokasi" className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            <span className="hidden sm:inline">Lokasi</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="riwayat" className="flex items-center gap-1">
                                            <History className="h-4 w-4" />
                                            <span className="hidden sm:inline">Riwayat</span>
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Tab: Penugasan */}
                                    <TabsContent value="penugasan" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Truck className="h-5 w-5 text-green-600" />
                                                    Informasi Penugasan
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <div className="p-4 rounded-lg bg-gray-50">
                                                        <p className="text-sm text-muted-foreground mb-1">Status Penugasan</p>
                                                        <StatusBadge status={penugasan.status} />
                                                    </div>
                                                    <div className="p-4 rounded-lg bg-gray-50">
                                                        <p className="text-sm text-muted-foreground mb-1">Status Pengajuan</p>
                                                        <StatusBadge status={pengajuan.status as any} />
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Jadwal Angkut</p>
                                                            <p className="font-medium">
                                                                {new Date(penugasan.jadwal_angkut).toLocaleString('id-ID', {
                                                                    weekday: 'long',
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <Truck className="h-5 w-5 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Armada</p>
                                                            <p className="font-medium">
                                                                {penugasan.armada?.kode_armada || '-'} - {penugasan.armada?.jenis_kendaraan || '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <FileText className="h-5 w-5 text-blue-600" />
                                                    Detail Pengajuan
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">Alamat Lengkap</p>
                                                    <p className="font-medium">{pengajuan.alamat_lengkap}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">Estimasi Volume</p>
                                                    <p className="font-medium">{pengajuan.estimasi_volume || '-'}</p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Photo */}
                                        {pengajuan.foto_sampah && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2">
                                                        <Image className="h-5 w-5 text-purple-600" />
                                                        Foto Sampah
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <img
                                                        src={`/storage/${pengajuan.foto_sampah}`}
                                                        alt="Foto Sampah"
                                                        className="w-full max-w-lg rounded-lg border shadow-sm"
                                                    />
                                                </CardContent>
                                            </Card>
                                        )}
                                    </TabsContent>

                                    {/* Tab: Warga */}
                                    <TabsContent value="warga" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <User className="h-5 w-5 text-blue-600" />
                                                    Informasi Warga
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-16 w-16">
                                                        <AvatarFallback className="text-xl bg-green-100 text-green-600">
                                                            {wargaName.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-xl font-bold">{wargaName}</p>
                                                        <p className="text-muted-foreground">
                                                            {pengajuan.wilayah?.nama_wilayah ?? '-'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Email</p>
                                                            <p className="font-medium">
                                                                {pengajuan.user?.email ?? pengajuan.email ?? '-'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {pengajuan.no_telepon && (
                                                        <div className="flex items-center gap-3">
                                                            <Phone className="h-5 w-5 text-muted-foreground" />
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">No. Telepon</p>
                                                                <p className="font-medium">{pengajuan.no_telepon}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-3">
                                                        <MapPin className="h-5 w-5 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Wilayah</p>
                                                            <p className="font-medium">
                                                                {pengajuan.wilayah?.nama_wilayah ?? '-'}
                                                                {pengajuan.wilayah?.kecamatan && ` - ${pengajuan.wilayah.kecamatan}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {pengajuan.no_telepon && (
                                                    <a href={`tel:${pengajuan.no_telepon}`}>
                                                        <Button className="w-full bg-green-600 hover:bg-green-700 mt-4">
                                                            <Phone className="h-4 w-4 mr-2" />
                                                            Hubungi Warga
                                                        </Button>
                                                    </a>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Tab: Lokasi */}
                                    <TabsContent value="lokasi" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <MapPin className="h-5 w-5 text-red-600" />
                                                    Lokasi Pengangkutan
                                                </CardTitle>
                                                <CardDescription>
                                                    {pengajuan.alamat_lengkap}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                {pengajuan.latitude && pengajuan.longitude ? (
                                                    <div className="space-y-4">
                                                        <MapViewer
                                                            latitude={pengajuan.latitude}
                                                            longitude={pengajuan.longitude}
                                                            height="400px"
                                                        />
                                                        <a
                                                            href={`https://www.google.com/maps/dir/?api=1&destination=${pengajuan.latitude},${pengajuan.longitude}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block"
                                                        >
                                                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                                                <Navigation className="h-4 w-4 mr-2" />
                                                                Buka di Google Maps
                                                            </Button>
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12">
                                                        <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                                        <p className="text-gray-500">Koordinat lokasi tidak tersedia</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Tab: Riwayat */}
                                    <TabsContent value="riwayat" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <History className="h-5 w-5 text-orange-600" />
                                                    Riwayat Status
                                                </CardTitle>
                                                <CardDescription>
                                                    Perubahan status pengajuan
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                {pengajuan.riwayat_status && pengajuan.riwayat_status.length > 0 ? (
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
                                                ) : (
                                                    <div className="text-center py-12">
                                                        <History className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                                        <p className="text-gray-500">Belum ada riwayat status</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Quick Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Ringkasan</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Status</span>
                                            <StatusBadge status={penugasan.status} />
                                        </div>
                                        <Separator />
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {new Date(penugasan.jadwal_angkut).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {new Date(penugasan.jadwal_angkut).toLocaleTimeString('id-ID', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Truck className="h-4 w-4 text-muted-foreground" />
                                                <span>{penugasan.armada?.kode_armada || '-'}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Actions */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Aksi Cepat</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {penugasan.status === 'aktif' && (
                                            <Button
                                                onClick={() => setShowStatusForm(true)}
                                                className="w-full bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Update Status
                                            </Button>
                                        )}
                                        {pengajuan.latitude && pengajuan.longitude && (
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${pengajuan.latitude},${pengajuan.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block"
                                            >
                                                <Button variant="outline" className="w-full">
                                                    <Navigation className="h-4 w-4 mr-2" />
                                                    Navigasi
                                                </Button>
                                            </a>
                                        )}
                                        {pengajuan.no_telepon && (
                                            <a href={`tel:${pengajuan.no_telepon}`} className="block">
                                                <Button variant="outline" className="w-full">
                                                    <Phone className="h-4 w-4 mr-2" />
                                                    Hubungi
                                                </Button>
                                            </a>
                                        )}
                                        <Link href="/petugas/penugasan" className="block">
                                            <Button variant="ghost" className="w-full">
                                                <ArrowLeft className="h-4 w-4 mr-2" />
                                                Kembali ke Daftar
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
