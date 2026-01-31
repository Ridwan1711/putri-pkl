import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
  ArrowLeft, MapPin, User, Calendar, Image as ImageIcon, 
  CheckCircle, XCircle, Clock, AlertCircle, Truck, 
  CalendarDays, UserCheck, FileText, Map, Info, 
  ChevronRight, Download, Eye, Filter
} from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/status-badge';
import { StatusTimeline } from '@/components/status-timeline';
import { MapViewer } from '@/components/map/MapViewer';
import InputError from '@/components/input-error';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'react-hot-toast';
import type { BreadcrumbItem } from '@/types';
import type { PengajuanPengangkutan, Petugas, Armada } from '@/types/models';
import { Progress } from '@/components/ui/progress';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
  },
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
      changed_by_user?: { name: string; avatar?: string };
    }>;
    lampiran?: Array<{ id: number; file_path: string; original_name: string }>;
  };
  petugas: Petugas[];
  armada: Armada[];
}

const statusConfig = {
  diajukan: { icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
  diverifikasi: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
  dijadwalkan: { icon: CalendarDays, color: "text-purple-500", bg: "bg-purple-50" },
  diangkut: { icon: Truck, color: "text-orange-500", bg: "bg-orange-50" },
  selesai: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
  ditolak: { icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
};

export default function PengajuanShow({ pengajuan, petugas, armada }: Props) {
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

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
        setShowAssignDialog(false);
        assignForm.reset();
        toast.success('Penugasan berhasil ditambahkan');
      },
      onError: () => {
        toast.error('Gagal menambahkan penugasan');
      },
    });
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    statusForm.post(`/admin/pengajuan/${pengajuan.id}/status`, {
      preserveScroll: true,
      onSuccess: () => {
        setShowStatusDialog(false);
        statusForm.reset();
        toast.success('Status berhasil diperbarui');
      },
      onError: () => {
        toast.error('Gagal memperbarui status');
      },
    });
  };

  const hariFromDate = (dateStr: string): number | null => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    const day = d.getDay();
    return day === 0 ? 7 : day;
  };

  const petugasTersedia = useMemo(() => {
    const hari = hariFromDate(assignForm.data.jadwal_angkut);
    const wilayahId = pengajuan.wilayah_id;
    if (!hari) return petugas;
    return petugas.filter((p) => {
      if (p.hari_libur?.includes(hari)) return false;
      if (!wilayahId) return true;
      return p.jadwal_rutin?.some(
        (j) => j.hari === hari && j.wilayah_id === wilayahId
      );
    });
  }, [petugas, assignForm.data.jadwal_angkut, pengajuan.wilayah_id]);

  const handleImageClick = (imagePath: string) => {
    setSelectedImage(`/storage/${imagePath}`);
    setShowImageModal(true);
  };

  const StatusIcon = statusConfig[pengajuan.status as keyof typeof statusConfig]?.icon || Info;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Detail Pengajuan - ${pengajuan.alamat_lengkap}`} />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header Section */}
        <div className="border-b bg-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link href="/admin/pengajuan">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Detail Pengajuan
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    ID: #{pengajuan.id} • {new Date(pengajuan.created_at).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg">
                  <StatusIcon className="h-5 w-5" />
                  <StatusBadge status={pengajuan.status}  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Aksi
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Menu Aksi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {pengajuan.status === 'diverifikasi' && (
                      <DropdownMenuItem onClick={() => setShowAssignDialog(true)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Assign Penugasan
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => setShowStatusDialog(true)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Update Status
                    </DropdownMenuItem>
                    {pengajuan.foto_sampah && (
                      <DropdownMenuItem onClick={() => handleImageClick(pengajuan.foto_sampah || '')}>
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Foto
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="lokasi">Lokasi & Foto</TabsTrigger>
              <TabsTrigger value="penugasan">Penugasan</TabsTrigger>
              <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Informasi Pemohon */}
                <Card className="md:col-span-2 lg:col-span-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-500" />
                      Informasi Pemohon
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {pengajuan.user?.name?.charAt(0) || pengajuan.nama_pemohon?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {pengajuan.user?.name ?? pengajuan.nama_pemohon ?? '-'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {pengajuan.user_id ? 'Akun Terdaftar' : 'Pemohon Tamu'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center truncate">
                        <span className="font-medium truncate">{pengajuan.user?.email ?? pengajuan.email ?? '-'}</span>
                      </div>
                      <div className="flex justify-between items-center text-truncate">
                        <span className="text-sm text-gray-500">Telepon</span>
                        <span className="font-medium">{pengajuan.no_telepon || '-'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detail Pengajuan */}
                <Card className="md:col-span-2 lg:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-500" />
                      Detail Pengajuan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-sm text-gray-500">Alamat Lengkap</Label>
                        <p className="font-medium">{pengajuan.alamat_lengkap}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-gray-500">Wilayah</Label>
                        <Badge variant="outline" className="text-base">
                          {pengajuan.wilayah?.nama_wilayah || '-'}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-gray-500">Estimasi Volume</Label>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ 
                                width: `${Math.min(Number(pengajuan.estimasi_volume || 0) * 10, 100)}%` 
                              }} 
                            />
                          </div>
                          <span className="font-bold text-lg">{pengajuan.estimasi_volume || '0'} m³</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-gray-500">Tanggal Dibuat</Label>
                        <p className="font-medium">
                          {new Date(pengajuan.created_at).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Progress */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      Status Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="relative">
                        <Progress 
                          value={
                            pengajuan.status === 'diajukan' ? 25 :
                            pengajuan.status === 'diverifikasi' ? 50 :
                            pengajuan.status === 'dijadwalkan' ? 75 :
                            pengajuan.status === 'selesai' ? 100 : 0
                          } 
                          className="h-2" 
                        />
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>Diajukan</span>
                          <span>Diverifikasi</span>
                          <span>Dijadwalkan</span>
                          <span>Selesai</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => setShowStatusDialog(true)}
                        className="w-full"
                        variant="outline"
                      >
                        Update Status
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Lokasi & Foto Tab */}
            <TabsContent value="lokasi" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {pengajuan.latitude && pengajuan.longitude && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Map className="h-5 w-5 text-red-500" />
                        Lokasi Pengambilan
                      </CardTitle>
                      <CardDescription>
                        Koordinat: {pengajuan.latitude}, {pengajuan.longitude}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MapViewer
                        latitude={pengajuan.latitude}
                        longitude={pengajuan.longitude}
                        height="400px"
                      />
                    </CardContent>
                  </Card>
                )}

                {pengajuan.foto_sampah && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-amber-500" />
                        Dokumentasi Sampah
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="relative overflow-hidden rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleImageClick(pengajuan.foto_sampah || '')}
                      >
                        <img
                          src={`/storage/${pengajuan.foto_sampah}`}
                          alt="Foto Sampah"
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                          <Button variant="secondary" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat Detail
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Penugasan Tab */}
            <TabsContent value="penugasan">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Penugasan</h2>
                {pengajuan.status === 'diverifikasi' && (
                  <Button onClick={() => setShowAssignDialog(true)}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Assign Baru
                  </Button>
                )}
              </div>

              {pengajuan.penugasan && pengajuan.penugasan.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pengajuan.penugasan.map((penugasan) => (
                    <Card key={penugasan.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">Penugasan #{penugasan.id}</CardTitle>
                          <StatusBadge status={penugasan.status} />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-green-100 text-green-600">
                              {penugasan.petugas?.user?.name?.charAt(0) || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{penugasan.petugas?.user?.name}</h4>
                            <p className="text-sm text-gray-500">Petugas</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              Armada: <strong>{penugasan.armada?.kode_armada || 'Menggunakan armada petugas'}</strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              Jadwal: <strong>{new Date(penugasan.jadwal_angkut).toLocaleString('id-ID')}</strong>
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Belum Ada Penugasan
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Assign petugas untuk menangani pengajuan ini
                    </p>
                    <Button onClick={() => setShowAssignDialog(true)}>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Assign Penugasan
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Riwayat Tab */}
            <TabsContent value="riwayat">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    Riwayat Status
                  </CardTitle>
                  <CardDescription>
                    Timeline perubahan status pengajuan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StatusTimeline
                    riwayat={pengajuan.riwayat_status?.map((r) => ({
                      id: r.id,
                      ref_type: 'pengajuan' as const,
                      ref_id: pengajuan.id,
                      status: r.status,
                      keterangan: r.keterangan,
                      changed_by: r.changed_by,
                      created_at: r.created_at,
                      updated_at: r.created_at,
                      changed_by_user: r.changed_by_user,
                    })) || []}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Assign Penugasan
            </DialogTitle>
            <DialogDescription>
              Pilih petugas dan jadwal untuk menangani pengajuan ini
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAssign} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jadwal_angkut">Jadwal Angkut *</Label>
              <Input
                id="jadwal_angkut"
                type="datetime-local"
                value={assignForm.data.jadwal_angkut}
                onChange={(e) =>
                  assignForm.setData({
                    ...assignForm.data,
                    jadwal_angkut: e.target.value,
                    petugas_id: '',
                  })
                }
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Petugas akan difilter berdasarkan jadwal rutin dan hari libur
              </p>
              <InputError message={assignForm.errors.jadwal_angkut} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="petugas_id">Petugas *</Label>
              <Select
                value={assignForm.data.petugas_id}
                onValueChange={(value) => assignForm.setData('petugas_id', value)}
                disabled={petugasTersedia.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={petugasTersedia.length === 0 ? "Pilih tanggal terlebih dahulu" : "Pilih Petugas"} />
                </SelectTrigger>
                <SelectContent>
                  {petugasTersedia.length === 0 ? (
                    <SelectItem value="_none" disabled>
                      <div className="flex items-center gap-2 py-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <span>Tidak ada petugas tersedia pada tanggal tersebut</span>
                      </div>
                    </SelectItem>
                  ) : (
                    petugasTersedia.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {p.user?.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">{p.user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">
                              {p.wilayah?.nama_wilayah || 'Tidak ada wilayah'}
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <InputError message={assignForm.errors.petugas_id} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="armada_id">Armada (Opsional)</Label>
              <Select
                value={assignForm.data.armada_id || '_none'}
                onValueChange={(value) => assignForm.setData('armada_id', value === '_none' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Armada (Opsional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Gunakan armada petugas
                    </div>
                  </SelectItem>
                  {armada.map((a) => (
                    <SelectItem key={a.id} value={a.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{a.kode_armada}</p>
                          <p className="text-xs text-gray-500">{a.jenis_kendaraan}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={assignForm.errors.armada_id} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAssignDialog(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={assignForm.processing}>
                {assignForm.processing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Assign'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Update Status
            </DialogTitle>
            <DialogDescription>
              Ubah status dan tambahkan keterangan jika diperlukan
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={statusForm.data.status}
                onValueChange={(value: any) => statusForm.setData('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${config.color}`} />
                          <span className="capitalize">{key}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <InputError message={statusForm.errors.status} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Textarea
                id="keterangan"
                value={statusForm.data.keterangan}
                onChange={(e) => statusForm.setData('keterangan', e.target.value)}
                rows={4}
                placeholder="Tambahkan keterangan mengenai perubahan status..."
              />
              <InputError message={statusForm.errors.keterangan} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowStatusDialog(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={statusForm.processing}>
                {statusForm.processing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Memperbarui...
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image Modal Dialog */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Foto Sampah</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage}
                alt="Foto Sampah Detail"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImageModal(false)}>
              Tutup
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}