import { Head, useForm } from '@inertiajs/react';
import { 
  ArrowLeft, Save, Home, MapPin, Navigation, Target,
  Settings2, Eye, RefreshCw, Compass, AlertCircle,
  CheckCircle, XCircle, Shield, Building, Calendar,
  TrendingUp, ChevronRight, Upload, Download, Users,
  BarChart3, Layers, Clock, FileText, Target as TargetIcon,
  Globe, Map, RadioTower, Settings, ShieldCheck,
  Database, Cpu, Navigation2, Zap
} from 'lucide-react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
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
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { toast } from 'react-hot-toast';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin' },
  { title: 'Wilayah', href: '/admin/wilayah' },
  { title: 'Tambah Baru', href: '#' },
];

export default function WilayahCreate() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    nama_wilayah: '',
    kecamatan: '',
    geojson: '',
    latitude: null as number | null,
    longitude: null as number | null,
    is_active: true,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!data.nama_wilayah.trim() || !data.kecamatan.trim()) {
      toast.error('Nama desa dan kecamatan wajib diisi');
      return;
    }

    if (!data.latitude || !data.longitude) {
      toast.error('Lokasi markas desa wajib ditentukan');
      return;
    }

    post('/admin/wilayah', {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Wilayah berhasil ditambahkan');
      },
      onError: () => {
        toast.error('Gagal menambahkan wilayah');
      },
    });
  };

  const handleReset = () => {
    reset();
    setCurrentLocation(null);
    toast.success('Form telah direset');
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

  // Calculate form completion percentage
  const formCompletion = () => {
    let completed = 0;
    let total = 4; // nama_wilayah, kecamatan, latitude, longitude
    
    if (data.nama_wilayah.trim()) completed++;
    if (data.kecamatan.trim()) completed++;
    if (data.latitude) completed++;
    if (data.longitude) completed++;
    
    return (completed / total) * 100;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Wilayah Baru" />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header Section */}
        <div className="border-b bg-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link href="/admin/wilayah">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                        <Globe className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Tambah Wilayah Baru
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          <Zap className="mr-1 h-3 w-3" />
                          Auto-assign Petugas
                        </Badge>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">Radius 25km</span>
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
                <Link href="/admin/wilayah">
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
                {/* Information Alert */}
                <Alert className="border-blue-200 bg-blue-50">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-700">Penting!</AlertTitle>
                  <AlertDescription className="text-blue-600">
                    Hanya tambahkan Desa dalam Kecamatan yang sudah kerja sama. 
                    Titik markas diperlukan untuk sistem auto-assign petugas.
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-500" />
                      Informasi Administrasi
                    </CardTitle>
                    <CardDescription>
                      Data dasar wilayah administratif
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nama_wilayah" className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Nama Desa *
                      </Label>
                      <Input
                        id="nama_wilayah"
                        value={data.nama_wilayah}
                        onChange={(e) => setData('nama_wilayah', e.target.value)}
                        placeholder="Contoh: Desa Sukamaju"
                        required
                        className="h-11"
                      />
                      <p className="text-xs text-gray-500">
                        Nama resmi desa sesuai data administratif
                      </p>
                      <InputError message={errors.nama_wilayah} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kecamatan" className="flex items-center gap-2">
                        <Navigation2 className="h-4 w-4" />
                        Kecamatan *
                      </Label>
                      <Input
                        id="kecamatan"
                        value={data.kecamatan}
                        onChange={(e) => setData('kecamatan', e.target.value)}
                        placeholder="Contoh: Kecamatan Sukajaya"
                        required
                        className="h-11"
                      />
                      <p className="text-xs text-gray-500">
                        Nama kecamatan tempat desa berada
                      </p>
                      <InputError message={errors.kecamatan} />
                    </div>
                  </CardContent>
                </Card>

                {/* Markas Desa Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RadioTower className="h-5 w-5 text-red-500" />
                      Titik Markas Desa
                    </CardTitle>
                    <CardDescription>
                      Untuk sistem auto-assign pengajuan ke petugas dalam radius 25km
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-base">
                          <Target className="h-4 w-4" />
                          Pilih Lokasi Markas di Peta
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={getCurrentLocation}
                          className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200"
                        >
                          <Compass className="mr-2 h-4 w-4 text-green-600" />
                          Gunakan Lokasi Saat Ini
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="h-[400px] rounded-lg overflow-hidden border shadow-sm">
                          <MapPicker
                            latitude={data.latitude}
                            longitude={data.longitude}
                            onLocationSelect={(lat, lng) => setData({ ...data, latitude: lat, longitude: lng })}
                            height="400px"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-sm flex items-center gap-2">
                              <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
                              Latitude
                            </Label>
                            <Input
                              value={data.latitude || ''}
                              onChange={(e) => setData('latitude', parseFloat(e.target.value))}
                              placeholder="-6.2088"
                              className="font-mono h-10"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-sm flex items-center gap-2">
                              <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                              Longitude
                            </Label>
                            <Input
                              value={data.longitude || ''}
                              onChange={(e) => setData('longitude', parseFloat(e.target.value))}
                              placeholder="106.8456"
                              className="font-mono h-10"
                            />
                          </div>
                        </div>
                        
                        {currentLocation && (
                          <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2">
                              <Navigation className="h-4 w-4 text-green-600" />
                              <p className="text-sm font-medium text-green-700">Lokasi saat ini terdeteksi:</p>
                            </div>
                            <p className="text-sm text-green-600 mt-1 font-mono">
                              Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-amber-700">
                            <span className="font-medium">Penting:</span> Titik ini digunakan untuk auto-assign pengajuan ke petugas dalam radius 25km. 
                            Pastikan lokasi tepat di markas/kantor desa.
                          </p>
                        </div>
                        
                        <InputError message={errors.latitude} />
                        <InputError message={errors.longitude} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Advanced Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings2 className="h-5 w-5 text-gray-500" />
                      Pengaturan Sistem
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${data.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {data.is_active ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <Label htmlFor="is_active" className="font-medium cursor-pointer text-base">
                            Status Aktif
                          </Label>
                          <p className="text-sm text-gray-500">
                            {data.is_active ? 'Wilayah aktif menerima pengajuan' : 'Wilayah dinonaktifkan sementara'}
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
                      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          <span className="font-medium">Pengaturan Lanjutan</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Konfigurasi tambahan untuk sistem auto-assign dan notifikasi
                      </p>
                    </div>

                    {showAdvanced && (
                      <div className="p-4 border rounded-lg bg-gray-50 space-y-3 animate-in fade-in">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">Auto-assign Petugas</Label>
                              <p className="text-sm text-gray-500">Otomatis assign pengajuan ke petugas terdekat</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">Notifikasi Real-time</Label>
                              <p className="text-sm text-gray-500">Kirim notifikasi ke petugas saat ada pengajuan baru</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">Optimasi Rute</Label>
                              <p className="text-sm text-gray-500">Optimasi rute pengangkutan berdasarkan lokasi</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Form Buttons */}
                <div className="sticky bottom-6">
                  <Card className="shadow-lg border-t">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                          {processing ? (
                            <div className="flex items-center gap-2 text-blue-600">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              <span className="text-sm font-medium">Membuat wilayah baru...</span>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600">
                              Pastikan semua data sudah benar sebelum menyimpan
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Link href="/admin/wilayah">
                            <Button 
                              type="button" 
                              variant="outline"
                              disabled={processing}
                              className="min-w-24"
                            >
                              Batal
                            </Button>
                          </Link>
                          <Button 
                            type="submit" 
                            disabled={processing}
                            className="min-w-32 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Buat Wilayah'}
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
                    Preview Wilayah
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-20 w-20 mb-3">
                      <AvatarFallback className="text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                        <Globe className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-bold text-center">
                      {data.nama_wilayah || 'Nama Desa'}
                    </h3>
                    <p className="text-sm text-gray-500 text-center">
                      {data.kecamatan || 'Nama Kecamatan'}
                    </p>
                    
                    <div className="flex gap-2 mt-2">
                      <Badge variant={data.is_active ? "default" : "secondary"}>
                        {data.is_active ? 'AKTIF' : 'NONAKTIF'}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50">
                        Auto-assign
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    {data.latitude && data.longitude ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <RadioTower className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="text-sm text-gray-500">Markas Desa</p>
                            <p className="font-medium text-xs font-mono">
                              {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
                            </p>
                          </div>
                        </div>
                        <div className="pl-7">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Shield className="h-3 w-3" />
                            <span>Radius auto-assign: 25km</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-medium">Markas belum ditentukan</p>
                          <p className="text-xs">Auto-assign belum aktif</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Cpu className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Status Sistem</p>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${data.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-sm">
                            {data.is_active ? 'Siap operasional' : 'Dalam pengaturan'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress & Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    Progress Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Kelengkapan Data</span>
                      <Badge variant="outline">
                        {Math.round(formCompletion())}%
                      </Badge>
                    </div>
                    <Progress value={formCompletion()} className="h-2" />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${data.nama_wilayah.trim() ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm">Nama Desa</span>
                      </div>
                      {data.nama_wilayah.trim() ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${data.kecamatan.trim() ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm">Kecamatan</span>
                      </div>
                      {data.kecamatan.trim() ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${data.latitude ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm">Koordinat Markas</span>
                      </div>
                      {data.latitude ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  
                  <Alert className="mt-4 border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm text-blue-700">
                      Semua field bertanda * wajib diisi untuk mengaktifkan sistem auto-assign
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    Tips & Panduan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">✓ Auto-assign Petugas</p>
                    <p className="text-xs text-gray-600">
                      Sistem akan otomatis menugaskan petugas dalam radius 25km dari markas
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">✓ Verifikasi Kerja Sama</p>
                    <p className="text-xs text-gray-600">
                      Pastikan kecamatan sudah memiliki MoU kerja sama sebelum ditambahkan
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">✓ Akurasi Koordinat</p>
                    <p className="text-xs text-gray-600">
                      Gunakan titik tepat di kantor desa untuk akurasi auto-assign
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Lihat Panduan Lengkap
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