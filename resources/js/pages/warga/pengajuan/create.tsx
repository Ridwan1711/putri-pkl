import { Head, useForm, Link, router } from '@inertiajs/react';
import {
    ArrowLeft, Package, MapPin, Camera, Send,
    Trash2, Building, Home, Scale
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { MapPicker } from '@/components/map/MapPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';
import type { Wilayah } from '@/types/models';
import { toast } from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/warga/dashboard' },
    { title: 'Pengajuan', href: '/warga/pengajuan' },
    { title: 'Buat Pengajuan', href: '/warga/pengajuan/create' },
];

export default function CreatePengajuan({ wilayah }: { wilayah: Wilayah[] }) {
    const { data, setData, post, processing, errors } = useForm({
        wilayah_id: '',
        kampung_id: '',
        alamat_lengkap: '',
        latitude: null as number | null,
        longitude: null as number | null,
        estimasi_volume: '',
        foto_sampah: null as File | null,
    });

    const selectedWilayah = wilayah.find((w) => w.id.toString() === data.wilayah_id);
    const kampungList = selectedWilayah?.kampung ?? [];

    const handleLocationSelect = (lat: number, lng: number) => {
        setData({
            ...data,
            latitude: lat,
            longitude: lng,
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/warga/pengajuan', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Pengajuan berhasil dibuat');
                router.visit('/warga/pengajuan');
            },
            onError: () => {
                toast.error('Gagal membuat pengajuan');
                router.visit('/warga/pengajuan');
            },
        });
    };

    const isFormValid = data.wilayah_id && data.kampung_id && data.alamat_lengkap;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Pengajuan" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <div className="container mx-auto px-4 py-6">
                        <Link href="/warga/pengajuan">
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
                            <Package className="h-8 w-8" />
                            Buat Pengajuan Pengangkutan
                        </h1>
                        <p className="text-green-100 mt-1">
                            Ajukan pengangkutan sampah di lokasi Anda
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6">
                    <form onSubmit={submit}>
                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Main Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Wilayah Selection */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Building className="h-5 w-5 text-blue-500" />
                                            Pilih Wilayah Layanan
                                        </CardTitle>
                                        <CardDescription>
                                            Pilih desa dan kampung tempat pengangkutan akan dilakukan
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="wilayah_id" className="flex items-center gap-1">
                                                <Building className="h-3 w-3" />
                                                Desa / Wilayah Layanan *
                                            </Label>
                                            <Select
                                                value={data.wilayah_id}
                                                onValueChange={(value) => setData({ ...data, wilayah_id: value, kampung_id: '' })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Desa di wilayah kerja sama" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {wilayah.map((w) => (
                                                        <SelectItem key={w.id} value={w.id.toString()}>
                                                            {w.nama_wilayah} - {w.kecamatan}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.wilayah_id} />
                                        </div>

                                        {data.wilayah_id && (
                                            <div className="space-y-2">
                                                <Label htmlFor="kampung_id" className="flex items-center gap-1">
                                                    <Home className="h-3 w-3" />
                                                    Kampung / Dusun *
                                                </Label>
                                                <Select
                                                    value={data.kampung_id}
                                                    onValueChange={(value) => setData('kampung_id', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih Kampung" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {kampungList.map((k) => (
                                                            <SelectItem key={k.id} value={k.id.toString()}>
                                                                {k.nama_kampung}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {kampungList.length === 0 && (
                                                    <p className="text-xs text-amber-600 flex items-center gap-1">
                                                        <Building className="h-3 w-3" />
                                                        Desa ini belum punya kampung. Hubungi admin.
                                                    </p>
                                                )}
                                                <InputError message={errors.kampung_id} />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Alamat */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Home className="h-5 w-5 text-purple-500" />
                                            Alamat Lengkap
                                        </CardTitle>
                                        <CardDescription>
                                            Masukkan alamat lengkap untuk memudahkan petugas menemukan lokasi
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Input
                                            id="alamat_lengkap"
                                            value={data.alamat_lengkap}
                                            onChange={(e) => setData('alamat_lengkap', e.target.value)}
                                            required
                                            placeholder="Contoh: Jl. Raya No. 123, RT 01/RW 02, depan masjid..."
                                            className="text-base"
                                        />
                                        <InputError message={errors.alamat_lengkap} className="mt-2" />
                                    </CardContent>
                                </Card>

                                {/* Lokasi */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-green-500" />
                                            Lokasi di Peta
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

                                {/* Estimasi Volume */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Scale className="h-5 w-5 text-orange-500" />
                                            Estimasi Volume
                                            <Badge variant="outline">Opsional</Badge>
                                        </CardTitle>
                                        <CardDescription>
                                            Perkiraan jumlah sampah yang akan diangkut
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Input
                                            id="estimasi_volume"
                                            value={data.estimasi_volume}
                                            onChange={(e) => setData('estimasi_volume', e.target.value)}
                                            placeholder="Contoh: 2 karung besar, 50 kg, 1 m³"
                                        />
                                        <InputError message={errors.estimasi_volume} className="mt-2" />
                                    </CardContent>
                                </Card>

                                {/* Foto Sampah */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Camera className="h-5 w-5 text-indigo-500" />
                                            Foto Sampah
                                            <Badge variant="outline">Opsional</Badge>
                                        </CardTitle>
                                        <CardDescription>
                                            Sertakan foto untuk membantu petugas mempersiapkan pengangkutan
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
                                            {data.foto_sampah ? (
                                                <div className="space-y-4">
                                                    <img
                                                        src={URL.createObjectURL(data.foto_sampah)}
                                                        alt="Preview"
                                                        className="max-h-48 mx-auto rounded-lg"
                                                    />
                                                    <p className="text-sm text-muted-foreground">{data.foto_sampah.name}</p>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setData('foto_sampah', null)}
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
                                                        onChange={(e) => setData('foto_sampah', e.target.files?.[0] || null)}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                        <InputError message={errors.foto_sampah} className="mt-2" />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Preview Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-6 space-y-6">
                                    <Card className="border-green-200 bg-green-50/50">
                                        <CardHeader>
                                            <CardTitle className="text-base">Preview Pengajuan</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Wilayah</p>
                                                {selectedWilayah ? (
                                                    <p className="text-sm font-medium">{selectedWilayah.nama_wilayah}</p>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground italic">Belum dipilih</p>
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Kampung</p>
                                                {data.kampung_id && kampungList.length > 0 ? (
                                                    <p className="text-sm font-medium">
                                                        {kampungList.find(k => k.id.toString() === data.kampung_id)?.nama_kampung}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground italic">Belum dipilih</p>
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Alamat</p>
                                                <p className="text-sm line-clamp-2">
                                                    {data.alamat_lengkap || <span className="italic text-muted-foreground">Belum diisi</span>}
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
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Estimasi Volume</p>
                                                <p className="text-sm">
                                                    {data.estimasi_volume || <span className="italic text-muted-foreground">Tidak diisi</span>}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Foto</p>
                                                {data.foto_sampah ? (
                                                    <Badge variant="outline" className="text-indigo-600 border-indigo-300">
                                                        <Camera className="h-3 w-3 mr-1" />
                                                        {data.foto_sampah.name}
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
                                                className="w-full bg-green-600 hover:bg-green-700"
                                                disabled={processing || !isFormValid}
                                            >
                                                <Send className="h-4 w-4 mr-2" />
                                                {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                                            </Button>
                                            <Link href="/warga/pengajuan" className="block">
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
                                                <li>• Pilih wilayah dan kampung dengan benar</li>
                                                <li>• Berikan alamat yang detail dan jelas</li>
                                                <li>• Tandai lokasi di peta</li>
                                                <li>• Sertakan foto untuk referensi</li>
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
