import { Head, Link } from '@inertiajs/react';
import { 
  ArrowLeft, Pencil, MapPin, Users, FileText, Plus, 
  Home, Building, Globe, Calendar, Package, Target,
  Eye, MoreVertical, Download, BarChart3, Settings,
  ChevronRight, CheckCircle, XCircle, Filter, RefreshCw,
  TrendingUp, AlertCircle, Shield, UserCheck, Clock,
  Layers, Navigation, Activity, Compass, Briefcase,
  ArrowRight
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
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MapViewer } from '@/components/map/MapViewer';
import { toast } from 'react-hot-toast';
import type { BreadcrumbItem } from '@/types';
import type { Wilayah, Petugas, PengajuanPengangkutan, Kampung } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
  },
  {
    title: 'Wilayah',
    href: '/admin/wilayah',
  },
  {
    title: 'Detail',
    href: '#',
  },
];

interface Props {
    wilayah: Wilayah & {
        petugas?: Petugas[];
        kampung?: Kampung[];
        pengajuan_pengangkutan?: PengajuanPengangkutan[];
        armada?: unknown[];
        stats?: {
          total_petugas: number;
          total_pengajuan: number;
          total_selesai: number;
          total_kampung: number;
          active_kampung: number;
          completion_rate: number;
        };
    };
}

export default function WilayahShow({ wilayah }: Props) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showAllKampung, setShowAllKampung] = useState(false);
    const [showAllPetugas, setShowAllPetugas] = useState(false);
    const [showAllPengajuan, setShowAllPengajuan] = useState(false);

    const stats = wilayah.stats || {
        total_petugas: wilayah.petugas?.length || 0,
        total_pengajuan: wilayah.pengajuan_pengangkutan?.length || 0,
        total_selesai: wilayah.pengajuan_pengangkutan?.filter(p => p.status === 'selesai').length || 0,
        total_kampung: wilayah.kampung?.length || 0,
        completion_rate: 0,
    };

    // Calculate completion rate if not provided
    if (stats.completion_rate === 0 && stats.total_pengajuan > 0) {
        stats.completion_rate = Math.round((stats.total_selesai / stats.total_pengajuan) * 100);
    }

    const toggleStatus = () => {
        toast.success(`Fitur toggle status wilayah akan segera hadir`);
    };

    const exportData = (type: string) => {
        toast.success(`Data ${type} wilayah ${wilayah.nama_wilayah} berhasil diexport`);
    };

    const displayedKampung = showAllKampung ? wilayah.kampung : (wilayah.kampung?.slice(0, 6) || []);
    const displayedPetugas = showAllPetugas ? wilayah.petugas : (wilayah.petugas?.slice(0, 6) || []);
    const displayedPengajuan = showAllPengajuan ? wilayah.pengajuan_pengangkutan : (wilayah.pengajuan_pengangkutan?.slice(0, 6) || []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Wilayah - ${wilayah.nama_wilayah}`} />
            
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
                                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                                <Globe className="h-6 w-6" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                                {wilayah.nama_wilayah}
                                            </h1>
                                            <div className="flex items-center gap-3 mt-1">
                                                <Badge variant={wilayah.is_active ? "default" : "outline"}>
                                                    {wilayah.is_active ? 'Aktif' : 'Nonaktif'}
                                                </Badge>
                                                <span className="text-gray-600">•</span>
                                                <span className="text-gray-600">{wilayah.kecamatan}</span>
                                                <span className="text-gray-600">•</span>
                                                <span className="text-gray-600">ID: #{wilayah.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            <MoreVertical className="mr-2 h-4 w-4" />
                                            Aksi
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Menu Aksi</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => exportData('detail')}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Export Detail
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => exportData('statistik')}>
                                            <BarChart3 className="mr-2 h-4 w-4" />
                                            Export Statistik
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Users className="mr-2 h-4 w-4" />
                                            Assign Petugas
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={toggleStatus}>
                                            {wilayah.is_active ? (
                                                <>
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Nonaktifkan Wilayah
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Aktifkan Wilayah
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                
                                <Link href={`/admin/wilayah/${wilayah.id}/edit`}>
                                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit Wilayah
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="overview" className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="kampung" className="flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Kampung
                            </TabsTrigger>
                            <TabsTrigger value="petugas" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Petugas
                            </TabsTrigger>
                            <TabsTrigger value="pengajuan" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Pengajuan
                            </TabsTrigger>
                            <TabsTrigger value="maps" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Maps
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card className="border-blue-100">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Total Kampung</p>
                                                <h3 className="text-2xl font-bold mt-1">{stats.total_kampung}</h3>
                                                
                                            </div>
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Home className="h-5 w-5 text-blue-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-green-100">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Petugas</p>
                                                <h3 className="text-2xl font-bold mt-1">{stats.total_petugas}</h3>
                                            </div>
                                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                                <UserCheck className="h-5 w-5 text-green-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-purple-100">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Pengajuan</p>
                                                <h3 className="text-2xl font-bold mt-1">{stats.total_pengajuan}</h3>
                                                <div className="flex items-center gap-1 mt-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {stats.total_selesai} selesai
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-purple-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-amber-100">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                                                <h3 className="text-2xl font-bold mt-1">{stats.completion_rate}%</h3>
                                            </div>
                                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                                                <Target className="h-5 w-5 text-amber-600" />
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <Progress value={stats.completion_rate} className="h-2" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Main Information */}
                            <div className="grid gap-6 lg:grid-cols-3">
                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Building className="h-5 w-5 text-blue-500" />
                                            Informasi Wilayah
                                        </CardTitle>
                                        <CardDescription>
                                            Detail wilayah dan informasi administratif
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-gray-500">Nama Wilayah</Label>
                                                    <p className="text-lg font-semibold">{wilayah.nama_wilayah}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-gray-500">Kecamatan</Label>
                                                    <p className="text-lg font-semibold">{wilayah.kecamatan}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-500">Status</Label>
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-2 rounded-lg ${wilayah.is_active ? 'bg-green-50' : 'bg-gray-50'}`}>
                                                        {wilayah.is_active ? (
                                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                                        ) : (
                                                            <XCircle className="h-5 w-5 text-gray-600" />
                                                        )}
                                                    </div>
                                                    <span className={`font-semibold ${wilayah.is_active ? 'text-green-600' : 'text-gray-600'}`}>
                                                        {wilayah.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                    <span className="text-gray-400">•</span>
                                                    <span className="text-sm text-gray-500">
                                                        {wilayah.is_active ? 'Dapat menerima pengajuan' : 'Tidak menerima pengajuan'}
                                                    </span>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-sm font-medium text-gray-500">Tanggal Dibuat</Label>
                                                    <span className="text-sm">
                                                        {new Date(wilayah.created_at).toLocaleDateString('id-ID', {
                                                            weekday: 'long',
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-sm font-medium text-gray-500">Terakhir Diupdate</Label>
                                                    <span className="text-sm">
                                                        {new Date(wilayah.updated_at).toLocaleDateString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Activity className="h-5 w-5 text-purple-500" />
                                            Aktivitas Terbaru
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                    <FileText className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm">Pengajuan baru diterima</p>
                                                    <p className="text-xs text-gray-500">2 jam yang lalu</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                    <Users className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm">Petugas ditambahkan</p>
                                                    <p className="text-xs text-gray-500">1 hari yang lalu</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                                    <Home className="h-4 w-4 text-amber-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm">Kampung baru ditambahkan</p>
                                                    <p className="text-xs text-gray-500">3 hari yang lalu</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <Button variant="ghost" className="w-full mt-4" size="sm">
                                            Lihat Semua Aktivitas
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Kampung Tab */}
                        <TabsContent value="kampung" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">Kampung Cakupan</h2>
                                    <p className="text-gray-600">
                                        {wilayah.kampung?.length || 0} kampung di wilayah ini
                                    </p>
                                </div>
                                <Link href={`/admin/wilayah/${wilayah.id}/kampung`}>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Kelola Kampung
                                    </Button>
                                </Link>
                            </div>

                            {wilayah.kampung && wilayah.kampung.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {displayedKampung?.map((kampung) => (
                                        <Card key={kampung.id} className="hover:shadow-lg transition-shadow">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between">
                                                    <CardTitle className="text-base">{kampung.nama_kampung}</CardTitle>
                                                   
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {kampung.latitude && kampung.longitude && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Navigation className="h-4 w-4" />
                                                            <span>Koordinat: {kampung.latitude}, {kampung.longitude}</span>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                                        <span>Ditambahkan: {new Date(kampung.created_at).toLocaleDateString('id-ID')}</span>
                                                        <Link 
                                                            href={`/admin/wilayah/${wilayah.id}/kampung`}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            Detail
                                                        </Link>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <Home className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                            Belum ada kampung
                                        </h3>
                                        <p className="text-gray-500 mb-4">
                                            Tambahkan kampung untuk memulai jadwal rutin pengangkutan
                                        </p>
                                        <Link href={`/admin/wilayah/${wilayah.id}/kampung`}>
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Tambah Kampung Pertama
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )}

                            {wilayah.kampung && wilayah.kampung.length > 6 && (
                                <div className="text-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowAllKampung(!showAllKampung)}
                                    >
                                        {showAllKampung ? 'Tampilkan Lebih Sedikit' : `Lihat Semua ${wilayah.kampung.length} Kampung`}
                                        <ChevronRight className={`ml-2 h-4 w-4 transition-transform ${showAllKampung ? 'rotate-90' : ''}`} />
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        {/* Petugas Tab */}
                        <TabsContent value="petugas" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">Petugas Wilayah</h2>
                                    <p className="text-gray-600">
                                        {wilayah.petugas?.length || 0} petugas bertugas di wilayah ini
                                    </p>
                                </div>
                                <Button variant="outline">
                                    <Users className="mr-2 h-4 w-4" />
                                    Assign Petugas
                                </Button>
                            </div>

                            {wilayah.petugas && wilayah.petugas.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {displayedPetugas?.map((petugas) => (
                                        <Card key={petugas.id} className="hover:shadow-lg transition-shadow">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarFallback className="bg-green-100 text-green-600">
                                                                {petugas.user?.name?.charAt(0) || 'P'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <CardTitle className="text-base">{petugas.user?.name}</CardTitle>
                                                            <CardDescription className="text-xs">
                                                                {petugas.user?.email}
                                                            </CardDescription>
                                                        </div>
                                                    </div>
                                                    <Badge variant={petugas.is_available ? "default" : "outline"}>
                                                        {petugas.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Briefcase className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm">Armada: {petugas.armada?.kode_armada || '-'}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                                        <span>Bergabung: {new Date(petugas.created_at).toLocaleDateString('id-ID')}</span>
                                                        <Link 
                                                            href={`/admin/petugas/${petugas.id}`}
                                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                        >
                                                            Detail
                                                            <ArrowRight className="h-3 w-3" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                            Belum ada petugas
                                        </h3>
                                        <p className="text-gray-500 mb-4">
                                            Assign petugas untuk menangani pengangkutan di wilayah ini
                                        </p>
                                        <Button>
                                            <UserCheck className="mr-2 h-4 w-4" />
                                            Assign Petugas
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {wilayah.petugas && wilayah.petugas.length > 6 && (
                                <div className="text-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowAllPetugas(!showAllPetugas)}
                                    >
                                        {showAllPetugas ? 'Tampilkan Lebih Sedikit' : `Lihat Semua ${wilayah.petugas.length} Petugas`}
                                        <ChevronRight className={`ml-2 h-4 w-4 transition-transform ${showAllPetugas ? 'rotate-90' : ''}`} />
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        {/* Pengajuan Tab */}
                        <TabsContent value="pengajuan" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">Pengajuan Wilayah</h2>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-gray-600">
                                            {wilayah.pengajuan_pengangkutan?.length || 0} pengajuan
                                        </span>
                                        <Badge variant="outline">{stats.total_selesai} selesai</Badge>
                                        <Badge variant="outline">{stats.completion_rate}% completion rate</Badge>
                                    </div>
                                </div>
                                <Button variant="outline">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filter
                                </Button>
                            </div>

                            {wilayah.pengajuan_pengangkutan && wilayah.pengajuan_pengangkutan.length > 0 ? (
                                <div className="space-y-4">
                                    {displayedPengajuan?.map((pengajuan) => (
                                        <Link
                                            key={pengajuan.id}
                                            href={`/admin/pengajuan/${pengajuan.id}`}
                                            className="block"
                                        >
                                            <Card className="hover:shadow-lg transition-shadow hover:border-blue-300">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Badge variant={
                                                                    pengajuan.status === 'selesai' ? 'default' :
                                                                    pengajuan.status === 'ditolak' ? 'destructive' :
                                                                    'default'
                                                                }>
                                                                    {pengajuan.status}
                                                                </Badge>
                                                                <span className="text-sm text-gray-500">
                                                                    {new Date(pengajuan.created_at).toLocaleDateString('id-ID')}
                                                                </span>
                                                            </div>
                                                            <p className="font-semibold mb-1">{pengajuan.alamat_lengkap}</p>
                                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                                <span>Oleh: {pengajuan.user?.name || pengajuan.nama_pemohon}</span>
                                                                <span>Volume: {pengajuan.estimasi_volume || 0} m³</span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {new Date(pengajuan.created_at).toLocaleTimeString('id-ID', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                            Belum ada pengajuan
                                        </h3>
                                        <p className="text-gray-500">
                                            Warga belum membuat pengajuan di wilayah ini
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {wilayah.pengajuan_pengangkutan && wilayah.pengajuan_pengangkutan.length > 6 && (
                                <div className="text-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowAllPengajuan(!showAllPengajuan)}
                                    >
                                        {showAllPengajuan ? 'Tampilkan Lebih Sedikit' : `Lihat Semua ${wilayah.pengajuan_pengangkutan.length} Pengajuan`}
                                        <ChevronRight className={`ml-2 h-4 w-4 transition-transform ${showAllPengajuan ? 'rotate-90' : ''}`} />
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        {/* Maps Tab */}
                        <TabsContent value="maps" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-red-500" />
                                        Peta Wilayah
                                    </CardTitle>
                                    <CardDescription>
                                        Visualisasi geografis wilayah dan kampung cakupan
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {wilayah.geojson ? (
                                        <div className="space-y-4">
                                            <div className="h-[500px] rounded-lg overflow-hidden border">
                                                <MapViewer 
                                                    geojson={wilayah.geojson} 
                                                    height="500px"
                                                    
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-600">
                                                    {wilayah.kampung?.length || 0} kampung ditampilkan
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm">
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Export Peta
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Compass className="mr-2 h-4 w-4" />
                                                        Navigasi
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <MapPin className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                                Peta tidak tersedia
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                Data geojson wilayah belum diupload
                                            </p>
                                            <Button>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload Geojson
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Kampung Coordinates */}
                            {wilayah.kampung && wilayah.kampung.some(k => k.latitude && k.longitude) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Navigation className="h-5 w-5 text-blue-500" />
                                            Koordinat Kampung
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {wilayah.kampung.filter(k => k.latitude && k.longitude).map((kampung) => (
                                                <div key={kampung.id} className="border rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium">{kampung.nama_kampung}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            Koordinat
                                                        </Badge>
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        <div>Latitude: {kampung.latitude}</div>
                                                        <div>Longitude: {kampung.longitude}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}

// Helper component for labels (since Label isn't imported in original)
const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`text-sm font-medium ${className}`}>{children}</div>
);

// Helper component for Upload icon (not in lucide imports)
const Upload = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);