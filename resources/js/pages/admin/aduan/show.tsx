import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft, MapPin, Image as ImageIcon, AlertCircle,
    Calendar, Clock, FileText, History, CheckCircle,
    User, Mail, Send, Save
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/status-badge';
import { StatusTimeline } from '@/components/status-timeline';
import { MapViewer } from '@/components/map/MapViewer';
import type { BreadcrumbItem } from '@/types';
import type { Aduan, RiwayatStatus } from '@/types/models';
import { toast } from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Aduan', href: '/admin/aduan' },
    { title: 'Detail', href: '#' },
];

interface Props {
    aduan: Aduan & {
        riwayat_status?: RiwayatStatus[];
    };
}

function getStatusColor(status: string): string {
    switch (status) {
        case 'masuk':
            return 'from-orange-500 to-orange-600';
        case 'diproses':
            return 'from-blue-500 to-blue-600';
        case 'ditindak':
            return 'from-indigo-500 to-indigo-600';
        case 'selesai':
            return 'from-green-500 to-green-600';
        case 'ditolak':
            return 'from-red-500 to-red-600';
        default:
            return 'from-gray-500 to-gray-600';
    }
}

export default function AdminAduanShow({ aduan }: Props) {
    const hasLocation = aduan.latitude && aduan.longitude;
    const hasPhoto = aduan.foto_bukti;
    const hasRiwayat = aduan.riwayat_status && aduan.riwayat_status.length > 0;

    const { data, setData, patch, processing, reset } = useForm({
        status: aduan.status,
        keterangan: '',
        tindak_lanjut: aduan.tindak_lanjut || '',
    });

    const handleStatusUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/aduan/${aduan.id}/status`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Status aduan berhasil diperbarui');
                reset('keterangan');
            },
            onError: () => {
                toast.error('Gagal memperbarui status aduan');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Aduan - ${aduan.kategori}`} />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header with Dynamic Color Based on Status */}
                <div className={`bg-gradient-to-r ${getStatusColor(aduan.status)} text-white`}>
                    <div className="container mx-auto px-4 py-6">
                        <Link href="/admin/aduan">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white/20 hover:bg-white/30 text-white border-0 mb-4"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali ke Daftar
                            </Button>
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="h-6 w-6" />
                                    <Badge variant="secondary" className="bg-white/20 text-white">
                                        {aduan.kategori}
                                    </Badge>
                                    <Badge variant="secondary" className="bg-white/20 text-white">
                                        #{aduan.id}
                                    </Badge>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    Detail Aduan
                                </h1>
                                <p className="text-white/80 mt-1 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Dibuat: {new Date(aduan.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-2">
                                <StatusBadge status={aduan.status} className="text-base" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <Tabs defaultValue="detail" className="space-y-6">
                                <TabsList className="grid w-full max-w-md grid-cols-4">
                                    <TabsTrigger value="detail" className="flex items-center gap-1">
                                        <FileText className="h-4 w-4" />
                                        <span className="hidden sm:inline">Detail</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="pelapor" className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        <span className="hidden sm:inline">Pelapor</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="lokasi" className="flex items-center gap-1" disabled={!hasLocation && !hasPhoto}>
                                        <MapPin className="h-4 w-4" />
                                        <span className="hidden sm:inline">Lokasi</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="riwayat" className="flex items-center gap-1" disabled={!hasRiwayat}>
                                        <History className="h-4 w-4" />
                                        <span className="hidden sm:inline">Riwayat</span>
                                    </TabsTrigger>
                                </TabsList>

                                {/* Detail Tab */}
                                <TabsContent value="detail" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <AlertCircle className="h-5 w-5 text-orange-500" />
                                                Informasi Aduan
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="p-4 rounded-lg bg-gray-50">
                                                    <p className="text-sm font-medium text-muted-foreground mb-1">Kategori</p>
                                                    <Badge variant="outline" className="text-base">{aduan.kategori}</Badge>
                                                </div>
                                                <div className="p-4 rounded-lg bg-gray-50">
                                                    <p className="text-sm font-medium text-muted-foreground mb-1">Status Saat Ini</p>
                                                    <StatusBadge status={aduan.status} />
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-lg bg-gray-50">
                                                <p className="text-sm font-medium text-muted-foreground mb-2">Deskripsi Aduan</p>
                                                <p className="text-base whitespace-pre-wrap leading-relaxed">{aduan.deskripsi}</p>
                                            </div>

                                            {aduan.tindak_lanjut && (
                                                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                                    <p className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                                                        <CheckCircle className="h-4 w-4" />
                                                        Tindak Lanjut
                                                    </p>
                                                    <p className="text-base text-green-800">{aduan.tindak_lanjut}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Pelapor Tab */}
                                <TabsContent value="pelapor" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <User className="h-5 w-5 text-blue-500" />
                                                Informasi Pelapor
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {aduan.user ? (
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                                                        <User className="h-5 w-5 text-gray-500" />
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Nama</p>
                                                            <p className="font-medium">{aduan.user.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                                                        <Mail className="h-5 w-5 text-gray-500" />
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Email</p>
                                                            <p className="font-medium">{aduan.user.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground">Data pelapor tidak tersedia</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Lokasi Tab */}
                                <TabsContent value="lokasi" className="space-y-6">
                                    <div className="grid gap-6">
                                        {hasLocation && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2">
                                                        <MapPin className="h-5 w-5 text-green-500" />
                                                        Lokasi Aduan
                                                    </CardTitle>
                                                    <CardDescription>
                                                        Koordinat: {aduan.latitude}, {aduan.longitude}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <MapViewer
                                                        latitude={aduan.latitude!}
                                                        longitude={aduan.longitude!}
                                                        height="350px"
                                                    />
                                                </CardContent>
                                            </Card>
                                        )}

                                        {hasPhoto && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2">
                                                        <ImageIcon className="h-5 w-5 text-purple-500" />
                                                        Foto Bukti
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <img
                                                        src={`/storage/${aduan.foto_bukti}`}
                                                        alt="Foto Bukti"
                                                        className="w-full rounded-lg shadow-md"
                                                    />
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                </TabsContent>

                                {/* Riwayat Tab */}
                                <TabsContent value="riwayat" className="space-y-6">
                                    {hasRiwayat && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <History className="h-5 w-5 text-indigo-500" />
                                                    Riwayat Status
                                                </CardTitle>
                                                <CardDescription>
                                                    Perjalanan status aduan dari awal hingga sekarang
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <StatusTimeline
                                                    riwayat={aduan.riwayat_status!.map((r) => ({
                                                        id: r.id,
                                                        ref_type: 'aduan' as const,
                                                        ref_id: aduan.id,
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
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Sidebar - Status Update Form */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6 space-y-6">
                                {/* Quick Status Update */}
                                <Card className="border-orange-200">
                                    <CardHeader className="bg-orange-50">
                                        <CardTitle className="flex items-center gap-2 text-orange-700">
                                            <Send className="h-5 w-5" />
                                            Update Status
                                        </CardTitle>
                                        <CardDescription>
                                            Ubah status dan berikan respons ke pelapor
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <form onSubmit={handleStatusUpdate} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Status Baru</Label>
                                                <Select
                                                    value={data.status}
                                                    onValueChange={(v) => setData('status', v as typeof data.status)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="masuk">Masuk</SelectItem>
                                                        <SelectItem value="diproses">Diproses</SelectItem>
                                                        <SelectItem value="ditindak">Ditindak</SelectItem>
                                                        <SelectItem value="selesai">Selesai</SelectItem>
                                                        <SelectItem value="ditolak">Ditolak</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Keterangan</Label>
                                                <Textarea
                                                    placeholder="Berikan keterangan perubahan status..."
                                                    value={data.keterangan}
                                                    onChange={(e) => setData('keterangan', e.target.value)}
                                                    rows={3}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Tindak Lanjut</Label>
                                                <Textarea
                                                    placeholder="Tuliskan tindak lanjut yang dilakukan..."
                                                    value={data.tindak_lanjut}
                                                    onChange={(e) => setData('tindak_lanjut', e.target.value)}
                                                    rows={3}
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full bg-orange-600 hover:bg-orange-700"
                                                disabled={processing}
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>

                                {/* Kronologi */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <Clock className="h-5 w-5 text-blue-500" />
                                            Kronologi
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4 text-sm">
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="font-medium">Dibuat</p>
                                                    <p className="text-muted-foreground">
                                                        {new Date(aduan.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            {aduan.updated_at !== aduan.created_at && (
                                                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                                                    <Clock className="h-4 w-4 text-blue-500" />
                                                    <div>
                                                        <p className="font-medium text-blue-700">Update Terakhir</p>
                                                        <p className="text-blue-600">
                                                            {new Date(aduan.updated_at).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
