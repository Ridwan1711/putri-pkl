import { Head, useForm, Link } from '@inertiajs/react';
import { 
  ArrowLeft, Save, Truck, Plus, AlertCircle, 
  CheckCircle, XCircle, Settings2, Battery, Fuel,
  Package, Calendar, Shield, RefreshCw, Eye, 
  FileText, BarChart3, ChevronRight, Upload,
  Wrench, Users, MapPin, DollarSign,
  SpellCheck2Icon
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { toast } from 'react-hot-toast';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
  },
  {
    title: 'Armada',
    href: '/admin/armada',
  },
  {
    title: 'Tambah Baru',
    href: '#',
  },
];

const statusConfig = {
  aktif: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", label: "Aktif" },
  perbaikan: { icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50", label: "Perbaikan" },
  nonaktif: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Nonaktif" },
};

interface AvailablePetugas {
  id: number;
  user?: { id: number; name: string; email: string } | null;
}

interface Props {
  wilayah?: { id: number; nama_wilayah: string; kecamatan: string }[];
  availablePetugas?: AvailablePetugas[];
}

export default function ArmadaCreate({ wilayah = [], availablePetugas = [] }: Props) {
  const [activeTab, setActiveTab] = useState('informasi');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    petugas_id: '',
    wilayah_id: '',
    kode_armada: '',
    jenis_kendaraan: '',
    plat_nomor: '',
    kapasitas: '',
    status: 'aktif' as 'aktif' | 'perbaikan' | 'nonaktif',
    tahun_pembuatan: '',
    merk: '',
    nomor_rangka: '',
    nomor_mesin: '',
    tanggal_stnk: '',
    tanggal_keur: '',
    bahan_bakar: 'solar',
    konsumsi_bahan_bakar: '',
    lokasi_parkir: '',
    asuransi: '',
    kontrak_sewa: '',
    keterangan: '',
    is_available: true,
    anggota: [] as { nama: string; no_hp: string }[],
  });

  const addAnggota = () => {
    if (data.anggota.length < 5) {
      setData('anggota', [...data.anggota, { nama: '', no_hp: '' }]);
    }
  };
  const removeAnggota = (i: number) => {
    setData('anggota', data.anggota.filter((_, idx) => idx !== i));
  };
  const updateAnggota = (i: number, field: 'nama' | 'no_hp', value: string) => {
    const next = [...data.anggota];
    next[i] = { ...next[i], [field]: value };
    setData('anggota', next);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!data.petugas_id || !data.kode_armada || !data.jenis_kendaraan || !data.plat_nomor || !data.kapasitas) {
      toast.error('Harap isi Leader (Petugas) dan semua field wajib');
      return;
    }

    post('/admin/armada', {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Armada berhasil ditambahkan');
        // Optional: Redirect to armada list after successful creation
        // router.visit('/admin/armada');
      },
      onError: () => {
        toast.error('Gagal menambahkan armada. Periksa kembali data yang diisi.');
      },
    });
  };

  const handleReset = () => {
    reset();
    toast.success('Form telah direset');
  };

  const handleFileUpload = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      toast.success(`File ${field} berhasil diupload: ${file.name}`);
    }
  };

  const StatusIcon = statusConfig[data.status]?.icon || CheckCircle;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Armada Baru" />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header Section */}
        <div className="border-b bg-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link href="/admin/armada">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Plus className="h-8 w-8 text-blue-500" />
                    Tambah Armada Baru
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Tambahkan armada baru ke dalam sistem pengangkutan
                  </p>
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
                <Link href="/admin/armada">
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
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="informasi" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Informasi
                  </TabsTrigger>
                  <TabsTrigger value="teknis" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Teknis
                  </TabsTrigger>
                  <TabsTrigger value="dokumen" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Dokumen
                  </TabsTrigger>
                  <TabsTrigger value="lainnya" className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    Lainnya
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={submit}>
                  {/* Informasi Tab */}
                  <TabsContent value="informasi" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Truck className="h-5 w-5 text-blue-500" />
                          Informasi Dasar Armada
                        </CardTitle>
                        <CardDescription>
                          Data identitas armada yang wajib diisi
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="petugas_id" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Leader (Kepala Regu) *
                          </Label>
                          <Select
                            value={data.petugas_id}
                            onValueChange={(value) => setData('petugas_id', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Petugas sebagai Leader" />
                            </SelectTrigger>
                            <SelectContent>
                              {availablePetugas.length === 0 ? (
                                <SelectItem value="_none" disabled>
                                  Tidak ada petugas tersedia
                                </SelectItem>
                              ) : (
                                availablePetugas.map((p) => (
                                  <SelectItem key={p.id} value={p.id.toString()}>
                                    {p.user?.name ?? `Petugas #${p.id}`} - {p.user?.email ?? '-'}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500">
                            Petugas yang bertanggung jawab sebagai kepala regu armada ini
                          </p>
                          <InputError message={errors.petugas_id} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="wilayah_id">Wilayah/Desa (Opsional)</Label>
                          <Select
                            value={data.wilayah_id}
                            onValueChange={(value) => setData('wilayah_id', value === '_none' ? '' : value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Desa (Opsional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="_none">- Belum ditentukan -</SelectItem>
                              {wilayah.map((w) => (
                                <SelectItem key={w.id} value={w.id.toString()}>
                                  {w.nama_wilayah} - {w.kecamatan}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500">Wilayah operasi armada (bisa diatur nanti)</p>
                          <InputError message={errors.wilayah_id} />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="kode_armada" className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Kode Armada *
                            </Label>
                            <Input
                              id="kode_armada"
                              value={data.kode_armada}
                              onChange={(e) => setData('kode_armada', e.target.value.toUpperCase())}
                              placeholder="ARM-001"
                              required
                              className="font-mono"
                            />
                            <p className="text-xs text-gray-500">
                              Kode unik untuk identifikasi armada
                            </p>
                            <InputError message={errors.kode_armada} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="jenis_kendaraan" className="flex items-center gap-2">
                              <Truck className="h-4 w-4" />
                              Jenis Kendaraan *
                            </Label>
                            <Select
                              value={data.jenis_kendaraan}
                              onValueChange={(value) => setData('jenis_kendaraan', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Jenis Kendaraan" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Truk Sampah">Truk Sampah</SelectItem>
                                <SelectItem value="Dump Truck">Dump Truck</SelectItem>
                                <SelectItem value="Pickup">Pickup</SelectItem>
                                <SelectItem value="Mini Truck">Mini Truck</SelectItem>
                                <SelectItem value="Container">Container</SelectItem>
                                <SelectItem value="Lainnya">Lainnya</SelectItem>
                              </SelectContent>
                            </Select>
                            <InputError message={errors.jenis_kendaraan} />
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="plat_nomor" className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Plat Nomor *
                            </Label>
                            <Input
                              id="plat_nomor"
                              value={data.plat_nomor}
                              onChange={(e) => setData('plat_nomor', e.target.value.toUpperCase())}
                              placeholder="B 1234 ABC"
                              required
                              className="font-mono"
                            />
                            <p className="text-xs text-gray-500">
                              Format: [Huruf Daerah] [Nomor] [Huruf]
                            </p>
                            <InputError message={errors.plat_nomor} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="kapasitas" className="flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              Kapasitas (m³) *
                            </Label>
                            <div className="relative">
                              <Input
                                id="kapasitas"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.kapasitas}
                                onChange={(e) => setData('kapasitas', e.target.value)}
                                placeholder="10.00"
                                required
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                m³
                              </div>
                            </div>
                            <InputError message={errors.kapasitas} />
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="merk" className="flex items-center gap-2">
                              <Truck className="h-4 w-4" />
                              Merk
                            </Label>
                            <Input
                              id="merk"
                              value={data.merk}
                              onChange={(e) => setData('merk', e.target.value)}
                              placeholder="Toyota, Mitsubishi, dll"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="tahun_pembuatan" className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Tahun Pembuatan
                            </Label>
                            <Input
                              id="tahun_pembuatan"
                              type="number"
                              min="1990"
                              max={new Date().getFullYear()}
                              value={data.tahun_pembuatan}
                              onChange={(e) => setData('tahun_pembuatan', e.target.value)}
                              placeholder="2023"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Teknis Tab */}
                  <TabsContent value="teknis" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Wrench className="h-5 w-5 text-orange-500" />
                          Data Teknis Kendaraan
                        </CardTitle>
                        <CardDescription>
                          Informasi teknis dan spesifikasi armada
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="nomor_rangka" className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Nomor Rangka (VIN)
                            </Label>
                            <Input
                              id="nomor_rangka"
                              value={data.nomor_rangka}
                              onChange={(e) => setData('nomor_rangka', e.target.value.toUpperCase())}
                              placeholder="JTDKB20UXXXXXX123"
                              className="font-mono"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="nomor_mesin" className="flex items-center gap-2">
                              <Battery className="h-4 w-4" />
                              Nomor Mesin
                            </Label>
                            <Input
                              id="nomor_mesin"
                              value={data.nomor_mesin}
                              onChange={(e) => setData('nomor_mesin', e.target.value.toUpperCase())}
                              placeholder="1KR-FE123456"
                              className="font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="bahan_bakar" className="flex items-center gap-2">
                              <Fuel className="h-4 w-4" />
                              Bahan Bakar
                            </Label>
                            <Select
                              value={data.bahan_bakar}
                              onValueChange={(value) => setData('bahan_bakar', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Bahan Bakar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="solar">Solar</SelectItem>
                                <SelectItem value="bensin">Bensin</SelectItem>
                                <SelectItem value="listrik">Listrik</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="konsumsi_bahan_bakar" className="flex items-center gap-2">
                              <SpellCheck2Icon className="h-4 w-4" />
                              Konsumsi Bahan Bakar (km/L)
                            </Label>
                            <Input
                              id="konsumsi_bahan_bakar"
                              type="number"
                              step="0.1"
                              min="0"
                              value={data.konsumsi_bahan_bakar}
                              onChange={(e) => setData('konsumsi_bahan_bakar', e.target.value)}
                              placeholder="8.5"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lokasi_parkir" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Lokasi Parkir
                          </Label>
                          <Input
                            id="lokasi_parkir"
                            value={data.lokasi_parkir}
                            onChange={(e) => setData('lokasi_parkir', e.target.value)}
                            placeholder="Depot Utama, Jl. Merdeka No. 123"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Dokumen Tab */}
                  <TabsContent value="dokumen" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-purple-500" />
                          Dokumen Kendaraan
                        </CardTitle>
                        <CardDescription>
                          Informasi dokumen dan perizinan kendaraan
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="tanggal_stnk" className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Masa Berlaku STNK
                            </Label>
                            <Input
                              id="tanggal_stnk"
                              type="date"
                              value={data.tanggal_stnk}
                              onChange={(e) => setData('tanggal_stnk', e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="tanggal_keur" className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Masa Berlaku KIR
                            </Label>
                            <Input
                              id="tanggal_keur"
                              type="date"
                              value={data.tanggal_keur}
                              onChange={(e) => setData('tanggal_keur', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="asuransi" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Asuransi
                          </Label>
                          <Input
                            id="asuransi"
                            value={data.asuransi}
                            onChange={(e) => setData('asuransi', e.target.value)}
                            placeholder="PT. Asuransi Indonesia"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="kontrak_sewa" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Kontrak Sewa (Jika ada)
                          </Label>
                          <Input
                            id="kontrak_sewa"
                            value={data.kontrak_sewa}
                            onChange={(e) => setData('kontrak_sewa', e.target.value)}
                            placeholder="No. Kontrak / Perusahaan Penyewa"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Upload Dokumen
                          </Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-1">
                              Seret dan lepas file atau klik untuk upload
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                              STNK, KIR, Asuransi (Maks. 10MB per file)
                            </p>
                            <Input
                              type="file"
                              multiple
                              onChange={(e) => handleFileUpload('documents', e)}
                              className="hidden"
                              id="file-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('file-upload')?.click()}
                            >
                              Pilih File
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Lainnya Tab */}
                  <TabsContent value="lainnya" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings2 className="h-5 w-5 text-gray-500" />
                          Pengaturan Lainnya
                        </CardTitle>
                        <CardDescription>
                          Konfigurasi tambahan untuk armada
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Anggota Armada (3-5 orang, tanpa akun)
                            </Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addAnggota}
                              disabled={data.anggota.length >= 5}
                            >
                              <Plus className="mr-1 h-4 w-4" />
                              Tambah ({data.anggota.length}/5)
                            </Button>
                          </div>
                          {data.anggota.map((a, i) => (
                            <div key={i} className="flex gap-2 items-center p-2 border rounded">
                              <Input
                                placeholder="Nama"
                                value={a.nama}
                                onChange={(e) => updateAnggota(i, 'nama', e.target.value)}
                                className="flex-1"
                              />
                              <Input
                                placeholder="No HP"
                                value={a.no_hp}
                                onChange={(e) => updateAnggota(i, 'no_hp', e.target.value)}
                                className="w-32"
                              />
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeAnggota(i)}>
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <p className="text-xs text-gray-500">Anggota tim selain petugas/leader (tanpa akun login)</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="status" className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            Status Armada *
                          </Label>
                          <Select 
                            value={data.status} 
                            onValueChange={(value: any) => setData('status', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusConfig).map(([key, config]) => {
                                const Icon = config.icon;
                                return (
                                  <SelectItem key={key} value={key}>
                                    <div className="flex items-center gap-2">
                                      <Icon className={`h-4 w-4 ${config.color}`} />
                                      <span>{config.label}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500">
                            Status menentukan ketersediaan armada untuk penugasan
                          </p>
                          <InputError message={errors.status} />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${data.is_available ? 'bg-green-100' : 'bg-gray-100'}`}>
                              {data.is_available ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <Label htmlFor="is_available" className="font-medium cursor-pointer">
                                Tersedia untuk Penugasan
                              </Label>
                              <p className="text-sm text-gray-500">
                                {data.is_available ? 'Armada dapat ditugaskan' : 'Armada tidak dapat ditugaskan'}
                              </p>
                            </div>
                          </div>
                          <Switch
                            id="is_available"
                            checked={data.is_available}
                            onCheckedChange={(checked) => setData('is_available', checked)}
                            disabled={processing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="keterangan" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Keterangan Tambahan
                          </Label>
                          <Textarea
                            id="keterangan"
                            value={data.keterangan}
                            onChange={(e) => setData('keterangan', e.target.value)}
                            placeholder="Tambahkan catatan atau informasi tambahan..."
                            rows={4}
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
                              <Label>Tracking GPS</Label>
                              <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Notifikasi Perawatan</Label>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Laporan Otomatis</Label>
                              <Switch />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Form Buttons */}
                  <div className="sticky bottom-6 mt-8">
                    <Card className="shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-2">
                            {processing ? (
                              <div className="flex items-center gap-2 text-blue-600">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                <span className="text-sm font-medium">Menyimpan data...</span>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-600">
                                Pastikan semua data sudah benar sebelum menyimpan
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Link href="/admin/armada">
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
                              {processing ? 'Menyimpan...' : 'Simpan Armada'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </form>
              </Tabs>
            </div>

            {/* Right Column - Preview & Info */}
            <div className="space-y-6">
              {/* Preview Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-gray-500" />
                    Preview Armada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-3">
                      <AvatarFallback className="text-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <Truck className="h-10 w-10" />
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-bold">{data.kode_armada || 'ARM-XXX'}</h3>
                    <p className="text-sm text-gray-500">{data.plat_nomor || 'B XXXX XX'}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant={data.status === 'aktif' ? "default" : data.status === 'perbaikan' ? "outline" : "destructive"}>
                        {statusConfig[data.status]?.label || 'Aktif'}
                      </Badge>
                      {data.is_available && (
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Tersedia
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Truck className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Jenis Kendaraan</p>
                        <p className="font-medium">{data.jenis_kendaraan || 'Belum diisi'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Kapasitas</p>
                        <p className="font-medium">{data.kapasitas || '0'} m³</p>
                      </div>
                    </div>

                    {data.merk && (
                      <div className="flex items-center gap-3">
                        <Truck className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Merk</p>
                          <p className="font-medium">{data.merk}</p>
                        </div>
                      </div>
                    )}

                    {data.tahun_pembuatan && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Tahun</p>
                          <p className="font-medium">{data.tahun_pembuatan}</p>
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
                      <Badge variant={
                        data.kode_armada && data.jenis_kendaraan && data.plat_nomor && data.kapasitas 
                          ? "default" 
                          : "destructive"
                      }>
                        {data.kode_armada && data.jenis_kendaraan && data.plat_nomor && data.kapasitas ? 'Lengkap' : 'Belum Lengkap'}
                      </Badge>
                    </div>
                    <Progress 
                      value={
                        ([
                          data.kode_armada,
                          data.jenis_kendaraan,
                          data.plat_nomor,
                          data.kapasitas
                        ].filter(Boolean).length / 4) * 100
                      } 
                      className="h-2" 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Tips Pengisian:</p>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Kode armada harus unik dan mudah dikenali</li>
                      <li>Pastikan plat nomor sesuai dengan dokumen resmi</li>
                      <li>Kapasitas dihitung dalam meter kubik (m³)</li>
                      <li>Update dokumen secara berkala</li>
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
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Armada Serupa
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Assign ke Petugas
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Buat Jadwal Perawatan
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