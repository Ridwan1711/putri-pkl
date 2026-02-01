import { Head, useForm, Link } from '@inertiajs/react';
import { 
  ArrowLeft, Save, Truck, MapPin, Calendar, 
  AlertCircle, CheckCircle, XCircle, Users, Settings2,
  Shield, Bell, Clock, RefreshCw, Eye, ChevronRight,
  Building, Mail, Phone, Briefcase, FileText, Key,
  UserCheck, UserX, BadgeCheck,
  Users2
} from 'lucide-react';
import { useState, useEffect } from 'react';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { toast } from 'react-hot-toast';
import InputError from '@/components/input-error';
import type { BreadcrumbItem, User } from '@/types';
import type { Petugas, Wilayah } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
  },
  {
    title: 'Petugas',
    href: '/admin/petugas',
  },
  {
    title: 'Edit',
    href: '#',
  },
];

const HARI_LIBUR_OPTIONS = [
  { value: 1, label: 'Senin', short: 'Sen' },
  { value: 2, label: 'Selasa', short: 'Sel' },
  { value: 3, label: 'Rabu', short: 'Rab' },
  { value: 4, label: 'Kamis', short: 'Kam' },
  { value: 5, label: 'Jumat', short: 'Jum' },
  { value: 6, label: 'Sabtu', short: 'Sab' },
  { value: 7, label: 'Minggu', short: 'Min' },
] as const;

interface Props {
  petugas: Petugas;
  users: User[];
  wilayah: Wilayah[];
}

export default function PetugasEdit({ petugas, users, wilayah }: Props) {
  const [activeTab, setActiveTab] = useState('informasi');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hariLiburCount, setHariLiburCount] = useState(petugas.hari_libur?.length || 0);

  const { data, setData, put, processing, errors, reset } = useForm({
    user_id: petugas.user_id?.toString() || '',
    wilayah_id: petugas.wilayah_id?.toString() || '',
    is_available: petugas.is_available,
    hari_libur: (petugas.hari_libur as number[]) || [],
  });

  // Update hari libur count when data changes
  useEffect(() => {
    setHariLiburCount(data.hari_libur.length);
  }, [data.hari_libur]);

  const toggleHariLibur = (value: number) => {
    const current = data.hari_libur || [];
    let next;
    
    if (current.includes(value)) {
      next = current.filter((h) => h !== value);
    } else {
      if (current.length < 3) {
        next = [...current, value];
      } else {
        toast.error('Maksimal 3 hari libur yang dapat dipilih');
        return;
      }
    }
    
    setData('hari_libur', next);
  };

  const handleUserSelect = (userId: string) => {
    setData('user_id', userId);
    const selectedUser = users.find(u => u.id.toString() === userId);
    if (selectedUser) {
      toast.success(`User ${selectedUser.name} dipilih`);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!data.user_id) {
      toast.error('Pilih user terlebih dahulu');
      return;
    }

    put(`/admin/petugas/${petugas.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Data petugas berhasil diperbarui');
      },
      onError: () => {
        toast.error('Gagal memperbarui data petugas');
      },
    });
  };

  const handleReset = () => {
    reset();
    toast.success('Form telah direset ke nilai awal');
  };

  const getHariLiburLabel = (value: number) => {
    return HARI_LIBUR_OPTIONS.find(opt => opt.value === value)?.label || '';
  };

  const selectedUser = users.find(u => u.id.toString() === data.user_id);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Petugas - ${petugas.user?.name || 'Unknown'}`} />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header Section */}
        <div className="border-b bg-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link href="/admin/petugas">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Settings2 className="h-8 w-8 text-blue-500" />
                    Edit Petugas
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                        {petugas.user?.name?.charAt(0) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-gray-600">
                      {petugas.user?.name || 'Unknown'} • ID: #{petugas.id}
                    </p>
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
                <Link href={`/admin/petugas/${petugas.id}`}>
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
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
                    <Users2 className="h-4 w-4" />
                    Informasi
                  </TabsTrigger>
                  <TabsTrigger value="penugasan" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Penugasan
                  </TabsTrigger>
                  <TabsTrigger value="jadwal" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Jadwal
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
                          <Users2 className="h-5 w-5 text-blue-500" />
                          Informasi Petugas
                        </CardTitle>
                        <CardDescription>
                          Pilih user yang akan dijadikan petugas
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="user_id" className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            User (Petugas) *
                          </Label>
                          <Select 
                            value={data.user_id} 
                            onValueChange={handleUserSelect}
                            disabled={processing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih User" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs">
                                        {user.name?.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{user.name}</p>
                                      <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedUser && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm font-medium">User terpilih:</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-sm">
                                    {selectedUser.name?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{selectedUser.name}</p>
                                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          <InputError message={errors.user_id} />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Penugasan Tab */}
                  <TabsContent value="penugasan" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-purple-500" />
                          Penugasan & Wilayah
                        </CardTitle>
                        <CardDescription>
                          Tentukan wilayah penugasan petugas
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {petugas.armada && (
                          <div className="p-3 bg-blue-50 rounded-lg mb-4">
                            <p className="text-sm font-medium">Armada yang dipegang:</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Truck className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">{petugas.armada.kode_armada}</span>
                              <span className="text-gray-500">- {petugas.armada.jenis_kendaraan}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Armada dikelola dari menu Armada
                            </p>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="wilayah_id" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Wilayah
                          </Label>
                          <Select 
                            value={data.wilayah_id} 
                            onValueChange={(value) => setData('wilayah_id', value)}
                            disabled={processing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Wilayah (Opsional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="_none">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" />
                                  Tidak ada wilayah
                                </div>
                              </SelectItem>
                              {wilayah.map((w) => (
                                <SelectItem key={w.id} value={w.id.toString()}>
                                  <div className="flex items-center gap-2">
                                    <Building className="h-4 w-4" />
                                    <div>
                                      <p className="font-medium">{w.nama_wilayah}</p>
                                      <p className="text-xs text-gray-500">{w.kecamatan}</p>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500">
                            Wilayah utama penugasan petugas
                          </p>
                          <InputError message={errors.wilayah_id} />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Jadwal Tab */}
                  <TabsContent value="jadwal" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-orange-500" />
                          Hari Libur
                        </CardTitle>
                        <CardDescription>
                          Pilih hari libur petugas (maksimal 3 hari)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Hari Libur Terpilih
                            </Label>
                            <Badge variant="outline">
                              {hariLiburCount}/3 hari
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {HARI_LIBUR_OPTIONS.map((opt) => (
                              <div 
                                key={opt.value} 
                                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                  data.hari_libur.includes(opt.value)
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => toggleHariLibur(opt.value)}
                              >
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    id={`hari_libur_${opt.value}`}
                                    checked={data.hari_libur.includes(opt.value)}
                                    onCheckedChange={() => toggleHariLibur(opt.value)}
                                    className="data-[state=checked]:bg-blue-500"
                                  />
                                  <Label
                                    htmlFor={`hari_libur_${opt.value}`}
                                    className="cursor-pointer flex-1"
                                  >
                                    <div className="font-medium">{opt.label}</div>
                                    <div className="text-xs text-gray-500">{opt.short}</div>
                                  </Label>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {data.hari_libur.length > 0 && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm font-medium mb-1">Hari libur terpilih:</p>
                              <div className="flex flex-wrap gap-2">
                                {data.hari_libur.map((hari) => (
                                  <Badge key={hari} variant="secondary" className="gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {getHariLiburLabel(hari)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <InputError message={errors.hari_libur} />
                          <p className="text-xs text-gray-500 mt-2">
                            Hari libur akan mempengaruhi penugasan otomatis pada hari tersebut
                          </p>
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
                          Pengaturan tambahan untuk petugas
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
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
                                Status Ketersediaan
                              </Label>
                              <p className="text-sm text-gray-500">
                                {data.is_available ? 'Petugas tersedia untuk penugasan' : 'Petugas tidak tersedia'}
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

                        <div 
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => setShowAdvanced(!showAdvanced)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              <span className="font-medium">Pengaturan Lanjutan</span>
                            </div>
                            <ChevronRight className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                          </div>
                        </div>

                        {showAdvanced && (
                          <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
                            <div className="flex items-center justify-between">
                              <Label>Notifikasi Email</Label>
                              <Switch />
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
                                <span className="text-sm font-medium">Menyimpan perubahan...</span>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-600">
                                Pastikan semua data sudah benar sebelum menyimpan
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Link href="/admin/petugas">
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
              </Tabs>
            </div>

            {/* Right Column - Preview & Info */}
            <div className="space-y-6">
              {/* Preview Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-gray-500" />
                    Preview Petugas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-20 w-20 mb-3">
                      <AvatarFallback className="text-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        {selectedUser?.name?.charAt(0) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-bold">{selectedUser?.name || 'Pilih User'}</h3>
                    <p className="text-sm text-gray-500">{selectedUser?.email || '-'}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant={data.is_available ? "default" : "outline"}>
                        {data.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                      </Badge>
                      {data.wilayah_id && data.wilayah_id !== '_none' && (
                        <Badge variant="outline">
                          {wilayah.find(w => w.id.toString() === data.wilayah_id)?.nama_wilayah || 'Wilayah'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    {petugas.armada && (
                      <div className="flex items-center gap-3">
                        <Truck className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Armada</p>
                          <p className="font-medium">{petugas.armada.kode_armada}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Wilayah</p>
                        <p className="font-medium">
                          {data.wilayah_id === '_none' || !data.wilayah_id 
                            ? 'Tidak ada' 
                            : wilayah.find(w => w.id.toString() === data.wilayah_id)?.nama_wilayah || '-'}
                        </p>
                      </div>
                    </div>

                    {data.hari_libur.length > 0 && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Hari Libur</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {data.hari_libur.map((hari) => (
                              <Badge key={hari} variant="outline" className="text-xs">
                                {getHariLiburLabel(hari)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Status & Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-green-500" />
                    Status Sistem
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Validasi Form</span>
                    {data.user_id ? (
                      <Badge variant="default">Valid</Badge>
                    ) : (
                      <Badge variant="destructive">Belum Lengkap</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status Petugas</span>
                    <Badge variant={data.is_available ? "default" : "outline"}>
                      {data.is_available ? 'Aktif' : 'Non-aktif'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ID Petugas</span>
                    <Badge variant="outline">#{petugas.id}</Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Tips:</p>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Pastikan user yang dipilih sudah terdaftar</li>
                      <li>Hari libur maksimal 3 hari</li>
                      <li>Data akan langsung aktif setelah disimpan</li>
                    </ul>
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