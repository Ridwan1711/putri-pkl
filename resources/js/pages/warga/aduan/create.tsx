import { Head, useForm, Link } from '@inertiajs/react';
import {
    ArrowLeft, AlertCircle, MapPin, Camera, Send,
    Trash2, Clock, Users, Smartphone, FileWarning, MessageCircle
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { MapPicker } from '@/components/map/MapPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/warga/dashboard' },
    { title: 'Aduan', href: '/warga/aduan' },
    { title: 'Buat Aduan', href: '/warga/aduan/create' },
];

const KATEGORI_OPTIONS = [
    {
        value: 'Sampah Menumpuk',
        label: 'Sampah Menumpuk',
        icon: Trash2,
        description: 'Tumpukan sampah yang belum diangkut',
        color: 'bg-orange-100 text-orange-700 border-orange-300',
    },
    {
        value: 'Bau Tidak Sedap',
        label: 'Bau Tidak Sedap',
        icon: FileWarning,
        description: 'Bau tidak sedap dari sampah',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    },
    {
        value: 'Lokasi Tidak Terjangkau',
        label: 'Lokasi Tidak Terjangkau',
        icon: MapPin,
        description: 'Petugas tidak menjangkau lokasi',
        color: 'bg-red-100 text-red-700 border-red-300',
    },
    {
        value: 'Kinerja Petugas',
        label: 'Kinerja Petugas',
        icon: Users,
        description: 'Keluhan terkait kinerja petugas',
        color: 'bg-purple-100 text-purple-700 border-purple-300',
    },
    {
        value: 'Keterlambatan Pengangkutan',
        label: 'Keterlambatan Pengangkutan',
        icon: Clock,
        description: 'Pengangkutan tidak sesuai jadwal',
        color: 'bg-blue-100 text-blue-700 border-blue-300',
    },
    {
        value: 'Layanan Aplikasi',
        label: 'Layanan Aplikasi',
        icon: Smartphone,
        description: 'Masalah dengan aplikasi ini',
        color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    },
    {
        value: 'Lainnya',
        label: 'Lainnya',
        icon: MessageCircle,
        description: 'Aduan lainnya terkait kebersihan',
        color: 'bg-gray-100 text-gray-700 border-gray-300',
    },
];

export default function AduanCreate() {
    const { data, setData, post, processing, errors } = useForm({
        kategori: '',
        deskripsi: '',
        foto_bukti: null as File | null,
        latitude: null as number | null,
        longitude: null as number | null,
    });

    const handleLocationSelect = (lat: number, lng: number) => {
        setData({
            ...data,
            latitude: lat,
            longitude: lng,
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/warga/aduan', {
            forceFormData: true,
        });
    };

    const selectedKategori = KATEGORI_OPTIONS.find((k) => k.value === data.kategori);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Aduan" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <div className="container mx-auto px-4 py-6">
                        <Link href="/warga/aduan">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white/20 hover:bg-white/30 text-white border-0 mb-4"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>

                        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                            <AlertCircle className="h-8 w-8" />
                            Buat Aduan Baru
                        </h1>
                        <p className="text-orange-100 mt-1">
                            Sampaikan keluhan Anda terkait kebersihan dan layanan
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6">
                    <form onSubmit={submit}>
                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Main Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Kategori Selection */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5 text-orange-500" />
                                            Pilih Kategori Aduan
                                        </CardTitle>
                                        <CardDescription>
                                            Pilih kategori yang sesuai dengan keluhan Anda
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {KATEGORI_OPTIONS.map((kategori) => {
                                                const Icon = kategori.icon;
                                                const isSelected = data.kategori === kategori.value;
                                                return (
                                                    <button
                                                        key={kategori.value}
                                                        type="button"
                                                        onClick={() => setData('kategori', kategori.value)}
                                                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                                                            isSelected
                                                                ? `${kategori.color} border-current ring-2 ring-offset-2 ring-current/50`
                                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/50' : 'bg-gray-100'}`}>
                                                                <Icon className={`h-5 w-5 ${isSelected ? '' : 'text-gray-500'}`} />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{kategori.label}</p>
                                                                <p className={`text-xs mt-1 ${isSelected ? '' : 'text-muted-foreground'}`}>
                                                                    {kategori.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <InputError message={errors.kategori} className="mt-2" />
                                    </CardContent>
                                </Card>

                                {/* Deskripsi */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MessageCircle className="h-5 w-5 text-blue-500" />
                                            Deskripsi Aduan
                                        </CardTitle>
                                        <CardDescription>
                                            Jelaskan detail keluhan Anda agar dapat ditindaklanjuti dengan tepat
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Textarea
                                            id="deskripsi"
                                            value={data.deskripsi}
                                            onChange={(e) => setData('deskripsi', e.target.value)}
                                            rows={6}
                                            required
                                            placeholder="Contoh: Sampah di depan rumah belum diangkut sejak 3 hari yang lalu. Padahal biasanya setiap Senin dan Kamis pasti diangkut..."
                                            className="resize-none"
                                        />
                                        <InputError message={errors.deskripsi} className="mt-2" />
                                    </CardContent>
                                </Card>

                                {/* Lokasi */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-green-500" />
                                            Lokasi
                                            <Badge variant="outline">Opsional</Badge>
                                        </CardTitle>
                                        <CardDescription>
                                            Tandai lokasi di peta agar petugas dapat menemukan lokasi dengan mudah
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <MapPicker
                                            latitude={data.latitude}
                                            longitude={data.longitude}
                                            onLocationSelect={handleLocationSelect}
                                        />
                                        {data.latitude && data.longitude && (
                                            <p className="text-sm text-muted-foreground mt-2">
                                                Koordinat: {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
                                            </p>
                                        )}
                                        <InputError message={errors.latitude || errors.longitude} className="mt-2" />
                                    </CardContent>
                                </Card>

                                {/* Foto Bukti */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Camera className="h-5 w-5 text-purple-500" />
                                            Foto Bukti
                                            <Badge variant="outline">Opsional</Badge>
                                        </CardTitle>
                                        <CardDescription>
                                            Sertakan foto sebagai bukti untuk mempercepat proses penanganan
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
                                            {data.foto_bukti ? (
                                                <div className="space-y-4">
                                                    <img
                                                        src={URL.createObjectURL(data.foto_bukti)}
                                                        alt="Preview"
                                                        className="max-h-48 mx-auto rounded-lg"
                                                    />
                                                    <p className="text-sm text-muted-foreground">{data.foto_bukti.name}</p>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setData('foto_bukti', null)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Hapus Foto
                                                    </Button>
                                                </div>
                                            ) : (
                                                <label className="cursor-pointer">
                                                    <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                                    <p className="text-sm font-medium">Klik untuk upload foto</p>
                                                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, atau GIF maksimal 2MB</p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => setData('foto_bukti', e.target.files?.[0] || null)}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                        <InputError message={errors.foto_bukti} className="mt-2" />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Preview Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-6 space-y-6">
                                    <Card className="border-orange-200 bg-orange-50/50">
                                        <CardHeader>
                                            <CardTitle className="text-base">Preview Aduan</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Kategori</p>
                                                {selectedKategori ? (
                                                    <Badge className={selectedKategori.color}>
                                                        {selectedKategori.label}
                                                    </Badge>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground italic">Belum dipilih</p>
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Deskripsi</p>
                                                <p className="text-sm line-clamp-4">
                                                    {data.deskripsi || <span className="italic text-muted-foreground">Belum diisi</span>}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Lokasi</p>
                                                {data.latitude && data.longitude ? (
                                                    <Badge variant="outline" className="text-green-600 border-green-300">
                                                        <MapPin className="h-3 w-3 mr-1" />
                                                        Terpilih
                                                    </Badge>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground italic">Tidak dipilih</p>
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Foto</p>
                                                {data.foto_bukti ? (
                                                    <Badge variant="outline" className="text-purple-600 border-purple-300">
                                                        <Camera className="h-3 w-3 mr-1" />
                                                        {data.foto_bukti.name}
                                                    </Badge>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground italic">Tidak ada</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Action Buttons */}
                                    <Card>
                                        <CardContent className="p-4 space-y-3">
                                            <Button
                                                type="submit"
                                                className="w-full bg-orange-600 hover:bg-orange-700"
                                                disabled={processing || !data.kategori || !data.deskripsi}
                                            >
                                                <Send className="h-4 w-4 mr-2" />
                                                {processing ? 'Mengirim...' : 'Kirim Aduan'}
                                            </Button>
                                            <Link href="/warga/aduan" className="block">
                                                <Button type="button" variant="outline" className="w-full">
                                                    Batal
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>

                                    {/* Tips */}
                                    <Card className="bg-blue-50 border-blue-200">
                                        <CardContent className="p-4">
                                            <p className="text-sm font-medium text-blue-800 mb-2">Tips</p>
                                            <ul className="text-xs text-blue-700 space-y-1">
                                                <li>• Jelaskan masalah secara detail</li>
                                                <li>• Tandai lokasi jika memungkinkan</li>
                                                <li>• Sertakan foto untuk bukti</li>
                                                <li>• Pilih kategori yang sesuai</li>
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
