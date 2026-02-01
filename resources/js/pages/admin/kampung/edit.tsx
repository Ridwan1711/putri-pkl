import { Head, useForm, Link } from '@inertiajs/react';
import { 
  ArrowLeft, Save, Home, MapPin, Navigation, Target,
  Settings2, Eye, RefreshCw, Compass, AlertCircle,
  CheckCircle, XCircle, Shield, Building, Calendar,
  TrendingUp, ChevronRight, Upload, Download, Users,
  BarChart3, Layers, Clock, FileText, Target as TargetIcon
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { MapPicker } from '@/components/map/MapPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';
import type { Wilayah, Kampung } from '@/types/models';

interface Props {
    wilayah: Wilayah;
    kampung: Kampung;
}

export default function KampungEdit({ wilayah, kampung }: Props) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

    const { data, setData, put, processing, errors, reset } = useForm({
        nama_kampung: kampung.nama_kampung,
        latitude: kampung.latitude ?? null,
        longitude: kampung.longitude ?? null,
        urutan_rute: kampung.urutan_rute ?? 0,
        is_active: kampung.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!data.nama_kampung.trim()) {
            toast.error('Nama kampung wajib diisi');
            return;
        }

        put(`/admin/wilayah/${wilayah.id}/kampung/${kampung.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Kampung berhasil diperbarui');
            },
            onError: () => {
                toast.error('Gagal memperbarui kampung');
            },
        });
    };

    const handleReset = () => {
        reset();
        toast.success('Form telah direset ke nilai awal');
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ lat: latitude, lng: longitude });
                    setData({
                        ...data,
                        latitude: latitude,
                        longitude: longitude,
                    });
                    toast.success('Lokasi saat ini berhasil didapatkan');
                },
                (error) => {
                    toast.error('Gagal mendapatkan lokasi saat ini');
                    console.error('Geolocation error:', error);
                }
            );
        } else {
            toast.error('Browser tidak mendukung geolocation');
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Wilayah', href: '/admin/wilayah' },
        { title: wilayah.nama_wilayah, href: `/admin/wilayah/${wilayah.id}` },
        { title: 'Kampung', href: `/admin/wilayah/${wilayah.id}/kampung` },
        { title: 'Edit', href: '#' },
    ];

    const difficultyOptions = [
        { value: 'mudah', label: 'Mudah', color: 'text-green-500' },
        { value: 'sedang', label: 'Sedang', color: 'text-yellow-500' },
        { value: 'sulit', label: 'Sulit', color: 'text-red-500' },
    ];

    const waktuOptions = [
        { value: 'pagi', label: 'Pagi (06:00-10:00)' },
        { value: 'siang', label: 'Siang (10:00-14:00)' },
        { value: 'sore', label: 'Sore (14:00-18:00)' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Kampung - ${kampung.nama_kampung}`} />
            
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header Section */}
                <div className="border-b bg-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Link href={`/admin/wilayah/${wilayah.id}/kampung`}>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                                <Home className="h-6 w-6" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                                Edit Kampung
                                            </h1>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-gray-600">{kampung.nama_kampung}</span>
                                                <span className="text-gray-400">•</span>
                                                <Badge variant="outline">Wilayah: {wilayah.nama_wilayah}</Badge>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-gray-600">ID: #{kampung.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={handleReset}
                                    disabled={processing}
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Reset
                                </Button>
                                <Link href={`/admin/wilayah/${wilayah.id}/kampung`}>
                                    <Button variant="outline">
                                        <Eye className="mr-2 h-4 w-4" />
                                        Lihat Daftar
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Left Column - Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={submit} className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Home className="h-5 w-5 text-blue-500" />
                                            Informasi Dasar
                                        </CardTitle>
                                        <CardDescription>
                                            Data identitas kampung
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nama_kampung" className="flex items-center gap-2">
                                                <Building className="h-4 w-4" />
                                                Nama Kampung *
                                            </Label>
                                            <Input
                                                id="nama_kampung"
                                                value={data.nama_kampung}
                                                onChange={(e) => setData('nama_kampung', e.target.value)}
                                                placeholder="Kp. Nama Kampung"
                                                required
                                            />
                                            <p className="text-xs text-gray-500">
                                                Nama resmi kampung/dusun di wilayah ini
                                            </p>
                                            <InputError message={errors.nama_kampung} />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="urutan_rute" className="flex items-center gap-2">
                                                    <Target className="h-4 w-4" />
                                                    Urutan Rute
                                                </Label>
                                                <Input
                                                    id="urutan_rute"
                                                    type="number"
                                                    min="0"
                                                    value={data.urutan_rute}
                                                    onChange={(e) => setData('urutan_rute', parseInt(e.target.value) || 0)}
                                                    placeholder="0"
                                                />
                                                <p className="text-xs text-gray-500">
                                                    Urutan dalam rute pengangkutan
                                                </p>
                                                <InputError message={errors.urutan_rute} />
                                            </div>

                          
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-red-500" />
                                            Koordinat & Lokasi
                                        </CardTitle>
                                        <CardDescription>
                                            Tentukan lokasi kampung di peta
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="flex items-center gap-2">
                                                    <Navigation className="h-4 w-4" />
                                                    Pilih Lokasi di Peta
                                                </Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={getCurrentLocation}
                                                >
                                                    <Compass className="mr-2 h-4 w-4" />
                                                    Gunakan Lokasi Saat Ini
                                                </Button>
                                            </div>
                                            
                                            <div className="h-[400px] rounded-lg overflow-hidden border">
                                                <MapPicker
                                                    latitude={data.latitude}
                                                    longitude={data.longitude}
                                                    onLocationSelect={(lat, lng) => setData({ ...data, latitude: lat, longitude: lng })}
                                                    height="400px"
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label className="text-sm">Latitude</Label>
                                                    <Input
                                                        value={data.latitude || ''}
                                                        onChange={(e) => setData('latitude', parseFloat(e.target.value))}
                                                        placeholder="-6.2088"
                                                        className="font-mono"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-sm">Longitude</Label>
                                                    <Input
                                                        value={data.longitude || ''}
                                                        onChange={(e) => setData('longitude', parseFloat(e.target.value))}
                                                        placeholder="106.8456"
                                                        className="font-mono"
                                                    />
                                                </div>
                                            </div>
                                            
                                            {currentLocation && (
                                                <div className="p-3 bg-blue-50 rounded-lg">
                                                    <p className="text-sm font-medium">Lokasi saat ini:</p>
                                                    <p className="text-sm text-gray-600">
                                                        Latitude: {currentLocation.lat.toFixed(6)}, 
                                                        Longitude: {currentLocation.lng.toFixed(6)}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            <InputError message={errors.latitude} />
                                            <InputError message={errors.longitude} />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Settings2 className="h-5 w-5 text-gray-500" />
                                            Pengaturan Tambahan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${data.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                    {data.is_active ? (
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <XCircle className="h-5 w-5 text-gray-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor="is_active" className="font-medium cursor-pointer">
                                                        Status Kampung
                                                    </Label>
                                                    <p className="text-sm text-gray-500">
                                                        {data.is_active ? 'Kampung aktif menerima pengangkutan' : 'Kampung tidak aktif'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Switch
                                                id="is_active"
                                                checked={data.is_active}
                                                onCheckedChange={(checked) => setData('is_active', checked)}
                                                disabled={processing}
                                            />
                                        </div>

                                        <div 
                                            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                                            onClick={() => setShowAdvanced(!showAdvanced)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Settings2 className="h-4 w-4" />
                                                    <span className="font-medium">Pengaturan Lanjutan</span>
                                                </div>
                                                <ChevronRight className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                                            </div>
                                        </div>

                                        {showAdvanced && (
                                            <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label>Notifikasi Pengangkutan</Label>
                                                    <Switch defaultChecked />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Label>Prioritas Tinggi</Label>
                                                    <Switch />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Label>Laporan Otomatis</Label>
                                                    <Switch defaultChecked />
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Form Buttons */}
                                <div className="sticky bottom-6">
                                    <Card className="shadow-lg">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div className="flex items-center gap-2">
                                                    {processing ? (
                                                        <div className="flex items-center gap-2 text-blue-600">
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                            <span className="text-sm font-medium">Menyimpan perubahan...</span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-gray-600">
                                                            Pastikan semua data sudah benar sebelum menyimpan
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                    <Link href={`/admin/wilayah/${wilayah.id}/kampung`}>
                                                        <Button 
                                                            type="button" 
                                                            variant="outline"
                                                            disabled={processing}
                                                        >
                                                            Batal
                                                        </Button>
                                                    </Link>
                                                    <Button 
                                                        type="submit" 
                                                        disabled={processing}
                                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                                    >
                                                        <Save className="mr-2 h-4 w-4" />
                                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </form>
                        </div>

                        {/* Right Column - Preview & Info */}
                        <div className="space-y-6">
                            {/* Preview Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-5 w-5 text-gray-500" />
                                        Preview Kampung
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col items-center">
                                        <Avatar className="h-24 w-24 mb-3">
                                            <AvatarFallback className="text-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                                <Home className="h-10 w-10" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <h3 className="text-lg font-bold">{data.nama_kampung || 'Nama Kampung'}</h3>
                                        <p className="text-sm text-gray-500">ID: #{kampung.id}</p>

                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Building className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Wilayah</p>
                                                <p className="font-medium">{wilayah.nama_wilayah}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Target className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Urutan Rute</p>
                                                <p className="font-medium">{data.urutan_rute}</p>
                                            </div>
                                        </div>

                                        {data.latitude && data.longitude && (
                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Koordinat</p>
                                                    <p className="font-medium text-xs">{data.latitude}, {data.longitude}</p>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </CardContent>
                            </Card>

                            {/* Status & Tips */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-amber-500" />
                                        Status Form
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Field Wajib</span>
                                            <Badge variant={data.nama_kampung.trim() ? "default" : "destructive"}>
                                                {data.nama_kampung.trim() ? 'Lengkap' : 'Belum Lengkap'}
                                            </Badge>
                                        </div>
                                        <Progress 
                                            value={data.nama_kampung.trim() ? 100 : 0} 
                                            className="h-2" 
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Koordinat</span>
                                            <Badge variant={data.latitude && data.longitude ? "default" : "secondary"}>
                                                {data.latitude && data.longitude ? 'Terisi' : 'Opsional'}
                                            </Badge>
                                        </div>
                                        <Progress 
                                            value={data.latitude && data.longitude ? 100 : 0} 
                                            className="h-2" 
                                        />
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="text-sm text-gray-600">
                                        <p className="font-medium mb-1">Tips Pengeditan:</p>
                                        <ul className="space-y-1 list-disc pl-4">
                                            <li>Urutan rute mempengaruhi efisiensi perjalanan</li>
                                            <li>Koordinat membantu navigasi petugas</li>
                                            <li>Perkiraan populasi untuk optimasi kapasitas</li>
                                            <li>Zona waktu terbaik untuk penjadwalan</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-purple-500" />
                                        Aksi Cepat
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start" size="sm">
                                        <Navigation className="mr-2 h-4 w-4" />
                                        Lihat di Google Maps
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start" size="sm">
                                        <Layers className="mr-2 h-4 w-4" />
                                        Lihat Rute Lengkap
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start" size="sm">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Buat Jadwal Khusus
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}