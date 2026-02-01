import { Head, Link } from '@inertiajs/react';
import { 
  ArrowLeft, Pencil, Calendar, User, Truck, MapPin, 
  Mail, Phone, Shield, Clock, Award, TrendingUp,
  Navigation, Home, Package, AlertCircle, CheckCircle,
  XCircle, Star, Map, Users, FileText, BarChart3,
  MessageSquare, ShieldCheck, Battery, Target, Zap,
  Briefcase, UserCheck, MapPinned, Pin, BadgeCheck,
  Activity, History, Layers, Compass, ClipboardCheck
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/status-badge';
import type { BreadcrumbItem } from '@/types';
import type { Petugas, Penugasan } from '@/types/models';

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
        title: 'Detail',
        href: '#',
    },
];

interface Props {
    petugas: Petugas & {
        penugasan?: Penugasan[];
    };
}

export default function PetugasShow({ petugas }: Props) {
    // Calculate statistics
    const completedTasks = petugas.penugasan?.filter(p => p.status === 'selesai').length || 0;
    const pendingTasks = petugas.penugasan?.filter(p => p.status === 'aktif').length || 0;
    const totalTasks = petugas.penugasan?.length || 0;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Get recent tasks (last 5)
    const recentTasks = petugas.penugasan?.slice(0, 5) || [];
    
    // Get performance rating based on completion rate
    const getPerformanceRating = () => {
        if (completionRate >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
        if (completionRate >= 75) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
        if (completionRate >= 60) return { level: 'Average', color: 'text-amber-600', bg: 'bg-amber-100' };
        return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' };
    };
    
    const performance = getPerformanceRating();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Petugas - ${petugas.user?.name}`} />
            
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
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg">
                                            {petugas.user?.name?.charAt(0).toUpperCase() || 'P'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                                {petugas.user?.name}
                                            </h1>
                                            <Badge variant={petugas.is_available ? "default" : "secondary"} className="ml-2">
                                                {petugas.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Mail className="h-3 w-3 text-gray-400" />
                                            <span className="text-gray-600">{petugas.user?.email}</span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-600">ID: #{petugas.id}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                <Link href={`/admin/petugas/${petugas.id}/edit`}>
                                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit Petugas
                                    </Button>
                                </Link>
                                <Button variant="outline">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Kirim Pesan
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Left Column - Info & Stats */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Performance Stats */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-blue-700">Total Penugasan</p>
                                                <p className="text-2xl font-bold text-blue-900">{totalTasks}</p>
                                            </div>
                                            <div className="p-2 rounded-full bg-blue-200">
                                                <ClipboardCheck className="h-5 w-5 text-blue-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-green-700">Selesai</p>
                                                <p className="text-2xl font-bold text-green-900">{completedTasks}</p>
                                            </div>
                                            <div className="p-2 rounded-full bg-green-200">
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-amber-700">Dalam Proses</p>
                                                <p className="text-2xl font-bold text-amber-900">{pendingTasks}</p>
                                            </div>
                                            <div className="p-2 rounded-full bg-amber-200">
                                                <Clock className="h-5 w-5 text-amber-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-purple-700">Tingkat Penyelesaian</p>
                                                <p className="text-2xl font-bold text-purple-900">{completionRate}%</p>
                                            </div>
                                            <div className="p-2 rounded-full bg-purple-200">
                                                <TrendingUp className="h-5 w-5 text-purple-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Tabs Section */}
                            <Tabs defaultValue="profile" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="profile" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Profil
                                    </TabsTrigger>
                                    <TabsTrigger value="assignments" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Penugasan ({totalTasks})
                                    </TabsTrigger>
                                    <TabsTrigger value="performance" className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4" />
                                        Performa
                                    </TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="profile" className="space-y-4 mt-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {/* Personal Info Card */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <User className="h-5 w-5 text-blue-500" />
                                                    Informasi Pribadi
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-full bg-blue-100">
                                                            <User className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Nama Lengkap</p>
                                                            <p className="font-medium">{petugas.user?.name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-full bg-green-100">
                                                            <Mail className="h-4 w-4 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Email</p>
                                                            <p className="font-medium">{petugas.user?.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-full bg-amber-100">
                                                            <ShieldCheck className="h-4 w-4 text-amber-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Status Ketersediaan</p>
                                                            <div className="flex items-center gap-2">
                                                                <p className={`font-medium ${petugas.is_available ? 'text-green-600' : 'text-gray-600'}`}>
                                                                    {petugas.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                                                                </p>
                                                                <div className={`h-2 w-2 rounded-full ${petugas.is_available ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Assignment Info Card */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Briefcase className="h-5 w-5 text-purple-500" />
                                                    Penempatan Kerja
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {petugas.armada ? (
                                                    <div className="p-3 border rounded-lg hover:bg-gray-50">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="p-2 rounded-full bg-purple-100">
                                                                <Truck className="h-4 w-4 text-purple-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">Armada</p>
                                                                <p className="text-lg font-bold">{petugas.armada.kode_armada}</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1 pl-12">
                                                            <p className="text-sm text-gray-600">
                                                                {petugas.armada.jenis_kendaraan} • {petugas.armada.plat_nomor}
                                                            </p>
                                                            <div className="flex items-center gap-2">
                                                                <StatusBadge status={petugas.armada.status} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-3 border border-dashed rounded-lg bg-gray-50">
                                                        <div className="flex items-center gap-3">
                                                            <Truck className="h-5 w-5 text-gray-400" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-600">Belum ada armada</p>
                                                                <p className="text-xs text-gray-500">Assign armada melalui menu edit</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {petugas.wilayah ? (
                                                    <div className="p-3 border rounded-lg hover:bg-gray-50">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="p-2 rounded-full bg-green-100">
                                                                <MapPinned className="h-4 w-4 text-green-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">Wilayah Bertugas</p>
                                                                <p className="text-lg font-bold">{petugas.wilayah.nama_wilayah}</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1 pl-12">
                                                            <p className="text-sm text-gray-600">{petugas.wilayah.kecamatan}</p>
                                                            <div className="flex items-center gap-2">
                                                                <Pin className="h-3 w-3 text-gray-400" />
                                                                <span className="text-xs text-gray-500">Radius 4km dari centroid</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-3 border border-dashed rounded-lg bg-gray-50">
                                                        <div className="flex items-center gap-3">
                                                            <MapPinned className="h-5 w-5 text-gray-400" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-600">Belum ada wilayah</p>
                                                                <p className="text-xs text-gray-500">Assign wilayah melalui menu edit</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>
                                
                                <TabsContent value="assignments" className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-blue-500" />
                                                Riwayat Penugasan
                                            </CardTitle>
                                            <CardDescription>
                                                {totalTasks} penugasan dalam sistem
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {petugas.penugasan && petugas.penugasan.length > 0 ? (
                                                <div className="space-y-3">
                                                    {petugas.penugasan.map((penugasan) => (
                                                        <Link
                                                            key={penugasan.id}
                                                            href={`/admin/pengajuan/${penugasan.pengajuan_pengangkutan?.id}`}
                                                            className="block"
                                                        >
                                                            <div className="flex items-start gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors group">
                                                                <div className="flex-shrink-0">
                                                                    <div className={`p-2 rounded-full ${
                                                                        penugasan.status === 'selesai' ? 'bg-green-100 text-green-600' :
                                                                        penugasan.status === 'aktif' ? 'bg-blue-100 text-blue-600' :
                                                                        'bg-gray-100 text-gray-600'
                                                                    }`}>
                                                                        <Package className="h-4 w-4" />
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium truncate">
                                                                        {penugasan.pengajuan_pengangkutan?.alamat_lengkap || 'Alamat tidak tersedia'}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <Calendar className="h-3 w-3 text-gray-400" />
                                                                        <span className="text-sm text-gray-600">
                                                                            {new Date(penugasan.jadwal_angkut).toLocaleDateString('id-ID', {
                                                                                weekday: 'long',
                                                                                day: 'numeric',
                                                                                month: 'long',
                                                                                year: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            })}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-shrink-0">
                                                                    <StatusBadge status={penugasan.status} />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                                    <p className="text-gray-500">Belum ada penugasan</p>
                                                    <p className="text-sm text-gray-400 mt-1">Petugas belum menerima penugasan</p>
                                                </div>
                                            )}
                                        </CardContent>
                                        {petugas.penugasan && petugas.penugasan.length > 0 && (
                                            <CardFooter className="border-t pt-4">
                                                <div className="text-center w-full">
                                                    <Link href={`/admin/pengajuan?petugas=${petugas.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            Lihat Semua Penugasan
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardFooter>
                                        )}
                                    </Card>
                                </TabsContent>
                                
                                <TabsContent value="performance" className="mt-4">
                                    <div className="grid gap-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                                    Statistik Performa
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">Tingkat Penyelesaian</span>
                                                        <span className="font-bold">{completionRate}%</span>
                                                    </div>
                                                    <Progress value={completionRate} className="h-2" />
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-gray-500">Rata-rata Waktu Penyelesaian</p>
                                                        <p className="text-lg font-bold">-</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-gray-500">Rating Petugas</p>
                                                        <div className="flex items-center gap-2">
                                                            <Badge className={performance.bg + ' ' + performance.color}>
                                                                {performance.level}
                                                            </Badge>
                                                            <Star className="h-4 w-4 text-amber-500" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Activity className="h-5 w-5 text-blue-500" />
                                                    Aktivitas Terbaru
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {recentTasks.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {recentTasks.map((task) => (
                                                            <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                                                                <div className={`h-2 w-2 rounded-full ${
                                                                    task.status === 'selesai' ? 'bg-green-500' :
                                                                    task.status === 'aktif' ? 'bg-blue-500' :
                                                                    'bg-gray-400'
                                                                }`}></div>
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium truncate">
                                                                        {task.pengajuan_pengangkutan?.alamat_lengkap || 'Penugasan'}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {new Date(task.created_at).toLocaleDateString('id-ID')}
                                                                    </p>
                                                                </div>
                                                                <StatusBadge status={task.status} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500 text-center py-4">Belum ada aktivitas</p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Right Column - Summary & Actions */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-amber-500" />
                                        Ringkasan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Status Saat Ini</span>
                                            <Badge variant={petugas.is_available ? "default" : "secondary"}>
                                                {petugas.is_available ? '🟢 Tersedia' : '⚫ Tidak Tersedia'}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Bergabung Sejak</span>
                                            <span className="text-sm font-medium">
                                                {new Date(petugas.created_at).toLocaleDateString('id-ID', {
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Armada</span>
                                            <span className="text-sm font-medium">
                                                {petugas.armada ? petugas.armada.plat_nomor : 'Belum ada'}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Wilayah Bertugas</span>
                                            <span className="text-sm font-medium">
                                                {petugas.wilayah ? petugas.wilayah.nama_wilayah : 'Belum ada'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Target className="h-4 w-4 text-blue-500" />
                                            <span className="text-sm font-medium">Target Bulanan</span>
                                        </div>
                                        <Progress value={65} className="h-2" />
                                        <p className="text-xs text-gray-500 text-center">13/20 penugasan selesai</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Navigation className="h-5 w-5 text-purple-500" />
                                        Aksi Cepat
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Link href={`/admin/petugas/${petugas.id}/edit`} className="block">
                                        <Button variant="outline" className="w-full justify-start" size="sm">
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit Profil
                                        </Button>
                                    </Link>
                                    
                                    <Link href={`/admin/penugasan?petugas=${petugas.id}`} className="block">
                                        <Button variant="outline" className="w-full justify-start" size="sm">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Tambah Penugasan
                                        </Button>
                                    </Link>
                                    
                                    <Button variant="outline" className="w-full justify-start" size="sm">
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Kirim Notifikasi
                                    </Button>
                                    
                                    <Button variant="outline" className="w-full justify-start" size="sm">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Generate Laporan
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Availability Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <UserCheck className="h-5 w-5 text-green-500" />
                                        Ketersediaan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className={`p-3 rounded-lg ${petugas.is_available ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                                        <div className="flex items-center gap-2">
                                            {petugas.is_available ? (
                                                <>
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                    <span className="font-medium text-green-700">Tersedia untuk tugas</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-5 w-5 text-gray-600" />
                                                    <span className="font-medium text-gray-700">Sedang tidak tersedia</span>
                                                </>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {petugas.is_available 
                                                ? 'Petugas dapat menerima penugasan baru' 
                                                : 'Petugas sedang cuti/istirahat'}
                                        </p>
                                    </div>
                                    
                                    <Button variant={petugas.is_available ? "outline" : "default"} className="w-full">
                                        {petugas.is_available ? 'Tandai Tidak Tersedia' : 'Tandai Tersedia'}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Map Preview */}
                            {petugas.wilayah?.latitude && petugas.wilayah?.longitude && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Map className="h-5 w-5 text-red-500" />
                                            Lokasi Wilayah
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-40 rounded-lg overflow-hidden border bg-gray-100 relative">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center">
                                                    <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
                                                    <p className="text-sm font-medium">{petugas.wilayah.nama_wilayah}</p>
                                                    <p className="text-xs text-gray-500">Klik untuk lihat peta detail</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}