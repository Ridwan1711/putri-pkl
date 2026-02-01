import { Head, useForm, Link } from '@inertiajs/react';
import {
    ArrowLeft, Save, Truck, AlertCircle,
    CheckCircle, XCircle, Settings2, Battery, Fuel,
    Package, Calendar, Shield, RefreshCw, Eye,
    FileText, BarChart3, ChevronRight, Upload,
    Wrench, Users, MapPin, DollarSign,
    SpellCheck2Icon, Plus,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { toast } from 'react-hot-toast';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';
import type { Armada } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Armada', href: '/admin/armada' },
    { title: 'Edit', href: '#' },
];

const statusConfig = {
    aktif: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: 'Aktif' },
    perbaikan: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Perbaikan' },
    nonaktif: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Nonaktif' },
};

function formatDateForInput(value: string | null | undefined): string {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
}

interface AvailablePetugas {
    id: number;
    user?: { id: number; name: string; email: string } | null;
}

interface Props {
    armada: Armada & {
        anggota?: { id: number; nama: string; no_hp?: string }[];
        leader?: { id: number; user?: { id: number; name: string; email: string } | null } | null;
    };
    wilayah: { id: number; nama_wilayah: string; kecamatan: string }[];
    availablePetugas: AvailablePetugas[];
}

export default function ArmadaEdit({ armada, wilayah, availablePetugas }: Props) {
    const [activeTab, setActiveTab] = useState('informasi');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        petugas_id: armada.petugas_id?.toString() ?? '',
        wilayah_id: armada.wilayah_id?.toString() ?? '',
        kode_armada: armada.kode_armada,
        jenis_kendaraan: armada.jenis_kendaraan,
        plat_nomor: armada.plat_nomor,
        kapasitas: armada.kapasitas?.toString() ?? '',
        status: (armada.status || 'aktif') as 'aktif' | 'perbaikan' | 'nonaktif',
        tahun_pembuatan: armada.tahun_pembuatan?.toString() ?? '',
        merk: armada.merk ?? '',
        nomor_rangka: armada.nomor_rangka ?? '',
        nomor_mesin: armada.nomor_mesin ?? '',
        tanggal_stnk: formatDateForInput(armada.tanggal_stnk),
        tanggal_keur: formatDateForInput(armada.tanggal_keur),
        bahan_bakar: (armada.bahan_bakar as string) || 'solar',
        konsumsi_bahan_bakar: armada.konsumsi_bahan_bakar?.toString() ?? '',
        lokasi_parkir: armada.lokasi_parkir ?? '',
        asuransi: armada.asuransi ?? '',
        kontrak_sewa: armada.kontrak_sewa ?? '',
        keterangan: armada.keterangan ?? '',
        is_available: armada.is_available ?? true,
        anggota: (armada.anggota ?? []).map((a) => ({ nama: a.nama, no_hp: a.no_hp ?? '' })),
    });

    const addAnggota = () => {
        if (data.anggota.length < 5) setData('anggota', [...data.anggota, { nama: '', no_hp: '' }]);
    };
    const removeAnggota = (i: number) =>
        setData('anggota', data.anggota.filter((_, idx) => idx !== i));
    const updateAnggota = (i: number, field: 'nama' | 'no_hp', value: string) => {
        const next = [...data.anggota];
        next[i] = { ...next[i], [field]: value };
        setData('anggota', next);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.petugas_id || !data.kode_armada || !data.jenis_kendaraan || !data.plat_nomor || !data.kapasitas) {
            toast.error('Harap isi Leader dan semua field yang wajib diisi');
            return;
        }
        put(`/admin/armada/${armada.id}`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Armada berhasil diperbarui'),
            onError: () => toast.error('Gagal memperbarui armada. Periksa kembali data yang diisi.'),
        });
    };

    const StatusIcon = statusConfig[data.status]?.icon || CheckCircle;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Armada - ${armada.kode_armada}`} />
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
                                        <Truck className="h-8 w-8 text-blue-500" />
                                        Edit Armada
                                    </h1>
                                    <p className="text-gray-600 mt-1">{armada.kode_armada} - {armada.plat_nomor}</p>
                                </div>
                            </div>
                            <Link href="/admin/armada">
                                <Button variant="outline">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Lihat Daftar
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="informasi" className="flex items-center gap-2">
                                        <Truck className="h-4 w-4" /> Informasi
                                    </TabsTrigger>
                                    <TabsTrigger value="teknis" className="flex items-center gap-2">
                                        <Wrench className="h-4 w-4" /> Teknis
                                    </TabsTrigger>
                                    <TabsTrigger value="dokumen" className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" /> Dokumen
                                    </TabsTrigger>
                                    <TabsTrigger value="lainnya" className="flex items-center gap-2">
                                        <Settings2 className="h-4 w-4" /> Lainnya
                                    </TabsTrigger>
                                </TabsList>

                                <form onSubmit={submit}>
                                    <TabsContent value="informasi" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Truck className="h-5 w-5 text-blue-500" />
                                                    Informasi Dasar Armada
                                                </CardTitle>
                                                <CardDescription>Data identitas armada yang wajib diisi</CardDescription>
                                            </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
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
                          <Label>Wilayah/Desa (Opsional)</Label>
                          <Select
                            value={data.wilayah_id || '_none'}
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
                          <InputError message={errors.wilayah_id} />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="kode_armada">Kode Armada *</Label>
                                                        <Input
                                                            id="kode_armada"
                                                            value={data.kode_armada}
                                                            onChange={(e) => setData('kode_armada', e.target.value.toUpperCase())}
                                                            placeholder="ARM-001"
                                                            required
                                                            className="font-mono"
                                                        />
                                                        <InputError message={errors.kode_armada} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="jenis_kendaraan">Jenis Kendaraan *</Label>
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
                                                        <Label htmlFor="plat_nomor">Plat Nomor *</Label>
                                                        <Input
                                                            id="plat_nomor"
                                                            value={data.plat_nomor}
                                                            onChange={(e) => setData('plat_nomor', e.target.value.toUpperCase())}
                                                            placeholder="B 1234 ABC"
                                                            required
                                                            className="font-mono"
                                                        />
                                                        <InputError message={errors.plat_nomor} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="kapasitas">Kapasitas (m³) *</Label>
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
                                                        <InputError message={errors.kapasitas} />
                                                    </div>
                                                </div>
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="merk">Merk</Label>
                                                        <Input
                                                            id="merk"
                                                            value={data.merk}
                                                            onChange={(e) => setData('merk', e.target.value)}
                                                            placeholder="Toyota, Mitsubishi, dll"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="tahun_pembuatan">Tahun Pembuatan</Label>
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

                                    <TabsContent value="teknis" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Wrench className="h-5 w-5 text-orange-500" />
                                                    Data Teknis Kendaraan
                                                </CardTitle>
                                                <CardDescription>Informasi teknis dan spesifikasi armada</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="nomor_rangka">Nomor Rangka (VIN)</Label>
                                                        <Input
                                                            id="nomor_rangka"
                                                            value={data.nomor_rangka}
                                                            onChange={(e) => setData('nomor_rangka', e.target.value.toUpperCase())}
                                                            placeholder="JTDKB20UXXXXXX123"
                                                            className="font-mono"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="nomor_mesin">Nomor Mesin</Label>
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
                                                        <Label htmlFor="bahan_bakar">Bahan Bakar</Label>
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
                                                        <Label htmlFor="konsumsi_bahan_bakar">Konsumsi Bahan Bakar (km/L)</Label>
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
                                                    <Label htmlFor="lokasi_parkir">Lokasi Parkir</Label>
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

                                    <TabsContent value="dokumen" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <FileText className="h-5 w-5 text-purple-500" />
                                                    Dokumen Kendaraan
                                                </CardTitle>
                                                <CardDescription>Informasi dokumen dan perizinan kendaraan</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="tanggal_stnk">Masa Berlaku STNK</Label>
                                                        <Input
                                                            id="tanggal_stnk"
                                                            type="date"
                                                            value={data.tanggal_stnk}
                                                            onChange={(e) => setData('tanggal_stnk', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="tanggal_keur">Masa Berlaku KIR</Label>
                                                        <Input
                                                            id="tanggal_keur"
                                                            type="date"
                                                            value={data.tanggal_keur}
                                                            onChange={(e) => setData('tanggal_keur', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="asuransi">Asuransi</Label>
                                                    <Input
                                                        id="asuransi"
                                                        value={data.asuransi}
                                                        onChange={(e) => setData('asuransi', e.target.value)}
                                                        placeholder="PT. Asuransi Indonesia"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="kontrak_sewa">Kontrak Sewa (Jika ada)</Label>
                                                    <Input
                                                        id="kontrak_sewa"
                                                        value={data.kontrak_sewa}
                                                        onChange={(e) => setData('kontrak_sewa', e.target.value)}
                                                        placeholder="No. Kontrak / Perusahaan Penyewa"
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="lainnya" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Settings2 className="h-5 w-5 text-gray-500" />
                                                    Pengaturan Lainnya
                                                </CardTitle>
                                                <CardDescription>Konfigurasi tambahan untuk armada</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                  <div className="flex items-center justify-between">
                                                    <Label>Anggota Armada</Label>
                                                    <Button type="button" variant="outline" size="sm" onClick={addAnggota} disabled={data.anggota.length >= 5}>
                                                      <Plus className="mr-1 h-4 w-4" /> Tambah ({data.anggota.length}/5)
                                                    </Button>
                                                  </div>
                                                  {data.anggota.map((a, i) => (
                                                    <div key={i} className="flex gap-2 items-center p-2 border rounded">
                                                      <Input placeholder="Nama" value={a.nama} onChange={(e) => updateAnggota(i, 'nama', e.target.value)} className="flex-1" />
                                                      <Input placeholder="No HP" value={a.no_hp} onChange={(e) => updateAnggota(i, 'no_hp', e.target.value)} className="w-32" />
                                                      <Button type="button" variant="ghost" size="icon" onClick={() => removeAnggota(i)}>
                                                        <XCircle className="h-4 w-4" />
                                                      </Button>
                                                    </div>
                                                  ))}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="status">Status Armada *</Label>
                                                    <Select
                                                        value={data.status}
                                                        onValueChange={(value: 'aktif' | 'perbaikan' | 'nonaktif') => setData('status', value)}
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
                                                    <Label htmlFor="keterangan">Keterangan Tambahan</Label>
                                                    <Textarea
                                                        id="keterangan"
                                                        value={data.keterangan}
                                                        onChange={(e) => setData('keterangan', e.target.value)}
                                                        placeholder="Tambahkan catatan atau informasi tambahan..."
                                                        rows={4}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <div className="sticky bottom-6 mt-8">
                                        <Card className="shadow-lg">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                    <div className="text-sm text-gray-600">
                                                        {processing ? 'Menyimpan perubahan...' : 'Pastikan semua data sudah benar sebelum menyimpan'}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Link href="/admin/armada">
                                                            <Button type="button" variant="outline" disabled={processing}>
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
                            </Tabs>
                        </div>

                        <div className="space-y-6">
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
                                            <Badge variant={data.status === 'aktif' ? 'default' : data.status === 'perbaikan' ? 'outline' : 'destructive'}>
                                                {statusConfig[data.status]?.label || 'Aktif'}
                                            </Badge>
                                            {data.is_available && (
                                                <Badge variant="outline" className="gap-1">
                                                    <CheckCircle className="h-3 w-3" /> Tersedia
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
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
