import { Head, Link, router } from '@inertiajs/react';
import { 
  Plus, Pencil, Trash2, ArrowLeft, MapPin, Home, 
  Filter, Search, Download, RefreshCw, MoreVertical, 
  Eye, CheckCircle, XCircle, Settings, Navigation,
  ChevronRight, Grid3x3, List, Target, Globe, Building,
  ArrowUpDown, Calendar, Users, BarChart3, Layers,
  AlertCircle, Shield, TrendingUp, Compass
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { MapViewer } from '@/components/map/MapViewer';
import { toast } from 'react-hot-toast';
import type { BreadcrumbItem } from '@/types';
import type { Wilayah, Kampung } from '@/types/models';

interface Props {
    wilayah: Wilayah;
    kampung: Kampung[];
}

export default function KampungIndex({ wilayah, kampung }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'table' | 'grid' | 'map'>('grid');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showRouteDialog, setShowRouteDialog] = useState(false);
    const [selectedKampung, setSelectedKampung] = useState<Kampung | null>(null);

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/wilayah/${wilayah.id}/kampung/${deleteId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteId(null);
                    toast.success('Kampung berhasil dihapus');
                },
                onError: () => {
                    toast.error('Gagal menghapus kampung');
                },
            });
        }
    };

    const toggleStatus = (kampung: Kampung) => {
        router.patch(`/admin/wilayah/${wilayah.id}/kampung/${kampung.id}/toggle-status`, {
            is_active: kampung.status === 'active',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Status kampung berhasil diubah`);
            },
        });
    };

    const updateRouteOrder = (kampung: Kampung, newOrder: number) => {
        router.patch(`/admin/wilayah/${wilayah.id}/kampung/${kampung.id}`, {
            urutan_rute: newOrder,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Urutan rute berhasil diperbarui`);
            },
        });
    };

    const exportData = (format: string) => {
        const params = new URLSearchParams({ format });
        window.open(`/admin/wilayah/${wilayah.id}/kampung/export?${params}`, '_blank');
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Wilayah', href: '/admin/wilayah' },
        { title: wilayah.nama_wilayah, href: `/admin/wilayah/${wilayah.id}` },
        { title: 'Kampung', href: '#' },
    ];

    // Calculate stats
    const stats = {
        total: kampung.length,
        aktif: kampung.filter(k => k.is_active).length,
        nonaktif: kampung.filter(k => !k.is_active).length,
        withCoords: kampung.filter(k => k.latitude && k.longitude).length,
        avgRouteOrder: kampung.reduce((sum, k) => sum + (k.urutan_rute || 0), 0) / kampung.length || 0,
    };

    const statusOptions = [
        { value: 'all', label: 'Semua Status' },
        { value: 'aktif', label: 'Aktif' },
        { value: 'nonaktif', label: 'Nonaktif' },
    ];

    // Filter kampung
    const filteredKampung = kampung.filter(k => {
        if (searchTerm && !k.nama_kampung.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        if (statusFilter === 'aktif' && k.status === 'active') return false;
        if (statusFilter === 'nonaktif' && k.is_active) return false;
        return true;
    });

    const columns = [
        {
            header: 'Kampung',
            accessor: (row: Kampung) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                            <Home className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{row.nama_kampung}</p>
                        <p className="text-xs text-gray-500">ID: {row.id}</p>
                    </div>
                </div>
            ),
        },
        {
            header: 'Koordinat',
            accessor: (row: Kampung) => (
                <div className="space-y-1">
                    {row.latitude && row.longitude ? (
                        <>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="font-mono text-sm">{row.latitude}, {row.longitude}</span>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-xs"
                                onClick={() => {
                                    setSelectedKampung(row);
                                    setShowRouteDialog(true);
                                }}
                            >
                                <Compass className="mr-1 h-3 w-3" />
                                Lihat Rute
                            </Button>
                        </>
                    ) : (
                        <span className="text-sm text-gray-500">Koordinat belum diatur</span>
                    )}
                </div>
            ),
        },
        {
            header: 'Status & Rute',
            accessor: (row: Kampung) => (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className={`h-2 w-2 rounded-full ${row.is_active ? 'bg-green-500' : 'bg-gray-400'}`}>
                                <div className={`absolute inset-0 ${row.is_active ? 'animate-ping bg-green-500' : ''} rounded-full`}></div>
                            </div>
                        </div>
                        <Badge variant={row.is_active ? "default" : "secondary"}>
                            {row.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                    </div>
                    <div className="text-sm">
                        <span className="text-gray-500">Urutan Rute:</span>
                        <span className="font-bold ml-2">{row.urutan_rute || 0}</span>
                    </div>
                </div>
            ),
        },
        {
            header: 'Aksi',
            accessor: (row: Kampung) => (
                <div className="flex items-center gap-1">
                    <Link href={`/admin/wilayah/${wilayah.id}/kampung/${row.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Menu Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toggleStatus(row)}>
                                {row.is_active ? (
                                    <>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Nonaktifkan
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Aktifkan
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateRouteOrder(row, (row.urutan_rute || 0) + 1)}>
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                Naikkan Urutan
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => setDeleteId(row.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus Kampung
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Kampung - ${wilayah.nama_wilayah}`} />
            
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header Section */}
                <div className="border-b bg-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Link href={`/admin/wilayah/${wilayah.id}`}>
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
                                                Kampung - {wilayah.nama_wilayah}
                                            </h1>
                                            <p className="text-gray-600 mt-1">
                                                Kelola kampung/dusun di wilayah {wilayah.kecamatan}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            <Download className="mr-2 h-4 w-4" />
                                            Export
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => exportData('excel')}>
                                            Export Excel
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => exportData('pdf')}>
                                            Export PDF
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => exportData('csv')}>
                                            Export CSV
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                
                                <Link href={`/admin/wilayah/${wilayah.id}/kampung/create`}>
                                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Kampung
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <Card className="border-blue-100">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Kampung</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
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
                                        <p className="text-sm font-medium text-gray-600">Aktif</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.aktif}</h3>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <Progress 
                                        value={(stats.aktif / stats.total) * 100} 
                                        className="h-2 bg-green-100" 
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-100">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Nonaktif</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.nonaktif}</h3>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        <XCircle className="h-5 w-5 text-gray-600" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <Progress 
                                        value={(stats.nonaktif / stats.total) * 100} 
                                        className="h-2" 
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-purple-100">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Dengan Koordinat</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.withCoords}</h3>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters and Actions */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Cari nama kampung..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-full md:w-[180px]">
                                            <SelectValue placeholder="Semua Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <div className="flex items-center gap-2">
                                                        {option.value === 'aktif' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                                        {option.value === 'nonaktif' && <XCircle className="h-4 w-4 text-gray-500" />}
                                                        {option.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Button 
                                        variant="outline" 
                                        onClick={() => setSearchTerm('')}
                                        disabled={!searchTerm && statusFilter === 'all'}
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Reset
                                    </Button>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="show-advanced"
                                            checked={showAdvanced}
                                            onCheckedChange={setShowAdvanced}
                                        />
                                        <Label htmlFor="show-advanced" className="text-sm whitespace-nowrap">
                                            Tampilkan Lanjutan
                                        </Label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-600">
                                    {filteredKampung.length} dari {kampung.length} kampung ditemukan
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={viewMode === 'table' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('table')}
                                    >
                                        <List className="mr-2 h-4 w-4" />
                                        Tabel
                                    </Button>
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <Grid3x3 className="mr-2 h-4 w-4" />
                                        Grid
                                    </Button>
                                    <Button
                                        variant={viewMode === 'map' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('map')}
                                    >
                                        <Globe className="mr-2 h-4 w-4" />
                                        Map View
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Display */}
                    {viewMode === 'table' ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Daftar Kampung</CardTitle>
                                <CardDescription>
                                    Urutkan berdasarkan urutan rute untuk optimasi perjalanan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto rounded-lg border">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b bg-gray-50">
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                                                {columns.map((column, index) => (
                                                    <th key={index} className="text-left py-3 px-4 font-semibold text-gray-700">
                                                        {column.header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredKampung.length === 0 ? (
                                                <tr>
                                                    <td colSpan={columns.length + 1} className="py-12 text-center">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <Home className="h-12 w-12 text-gray-300 mb-4" />
                                                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                                                Tidak ada kampung ditemukan
                                                            </h3>
                                                            <p className="text-gray-500 mb-4">
                                                                {searchTerm || statusFilter !== 'all'
                                                                    ? 'Coba ubah filter pencarian'
                                                                    : 'Mulai dengan menambahkan kampung pertama'}
                                                            </p>
                                                            <Link href={`/admin/wilayah/${wilayah.id}/kampung/create`}>
                                                                <Button>
                                                                    <Plus className="mr-2 h-4 w-4" />
                                                                    Tambah Kampung
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredKampung
                                                    .sort((a, b) => (a.urutan_rute || 0) - (b.urutan_rute || 0))
                                                    .map((row, index) => (
                                                        <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
                                                            <td className="py-4 px-4 font-bold">{index + 1}</td>
                                                            {columns.map((column, colIndex) => (
                                                                <td key={colIndex} className="py-4 px-4">
                                                                    {column.accessor(row)}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredKampung.length === 0 ? (
                                <Card className="col-span-full">
                                    <CardContent className="py-12 text-center">
                                        <Home className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                            Tidak ada kampung ditemukan
                                        </h3>
                                        <p className="text-gray-500 mb-4">
                                            {searchTerm || statusFilter !== 'all'
                                                ? 'Coba ubah filter pencarian'
                                                : 'Mulai dengan menambahkan kampung pertama'}
                                        </p>
                                        <Link href={`/admin/wilayah/${wilayah.id}/kampung/create`}>
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Tambah Kampung
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ) : (
                                filteredKampung
                                    .sort((a, b) => (a.urutan_rute || 0) - (b.urutan_rute || 0))
                                    .map((row) => (
                                        <Card key={row.id} className="hover:shadow-lg transition-shadow">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                                                <Home className="h-5 w-5" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <CardTitle className="text-base">{row.nama_kampung}</CardTitle>
                                                            <CardDescription>ID: {row.id}</CardDescription>
                                                        </div>
                                                    </div>
                                                    <Badge variant={row.is_active ? "default" : "secondary"}>
                                                        {row.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Target className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm font-medium">Urutan Rute: {row.urutan_rute || 0}</span>
                                                    </div>
                                                    {row.latitude && row.longitude && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600">{row.latitude}, {row.longitude}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <Separator />
                                                
                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs text-gray-500">
                                                        Ditambahkan: {new Date(row.created_at).toLocaleDateString('id-ID')}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Link href={`/admin/wilayah/${wilayah.id}/kampung/${row.id}/edit`}>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                                <Pencil className="h-3 w-3" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-red-600"
                                                            onClick={() => setDeleteId(row.id)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                            )}
                        </div>
                    ) : (
                        /* Map View */
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-green-500" />
                                    Peta Kampung
                                </CardTitle>
                                <CardDescription>
                                    Visualisasi geografis kampung di wilayah {wilayah.nama_wilayah}. 
                                    Klik pin untuk detail. Garis hijau menandakan urutan rute pengangkutan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {(() => {
                                    const kampungWithCoords = filteredKampung
                                        .filter((k) => k.latitude != null && k.longitude != null)
                                        .sort((a, b) => (a.urutan_rute ?? 0) - (b.urutan_rute ?? 0));
                                    const markers = kampungWithCoords.map((k) => ({
                                        lat: Number(k.latitude),
                                        lng: Number(k.longitude),
                                        title: `${k.nama_kampung} (Urutan: ${k.urutan_rute ?? 0})`,
                                    }));
                                    const routePoints = kampungWithCoords.map((k) => ({
                                        lat: Number(k.latitude),
                                        lng: Number(k.longitude),
                                    }));

                                    if (kampungWithCoords.length === 0) {
                                        return (
                                            <div className="border rounded-lg p-6">
                                                <div className="flex flex-col items-center justify-center py-16">
                                                    <MapPin className="h-24 w-24 text-gray-300 mb-4" />
                                                    <p className="text-gray-600 font-medium mb-2">Belum ada kampung dengan koordinat</p>
                                                    <p className="text-sm text-gray-500 text-center max-w-md mb-6">
                                                        Tambah atau edit kampung untuk mengisi koordinat (latitude & longitude) agar ditampilkan di peta.
                                                    </p>
                                                    <Link href={`/admin/wilayah/${wilayah.id}/kampung/create`}>
                                                        <Button>
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Tambah Kampung
                                                        </Button>
                                                    </Link>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
                                                    {filteredKampung.slice(0, 4).map((row) => (
                                                        <div key={row.id} className="border rounded-lg p-3">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Home className="h-4 w-4 text-blue-500" />
                                                                <span className="font-medium">{row.nama_kampung}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {row.latitude && row.longitude ? (
                                                                    <div>Koordinat: {row.latitude}, {row.longitude}</div>
                                                                ) : (
                                                                    <div className="text-amber-600">Koordinat belum diatur</div>
                                                                )}
                                                                <div>Urutan Rute: {row.urutan_rute ?? 0}</div>
                                                            </div>
                                                            <Link href={`/admin/wilayah/${wilayah.id}/kampung/${row.id}/edit`}>
                                                                <Button variant="ghost" size="sm" className="mt-2">
                                                                    <Pencil className="mr-1 h-3 w-3" />
                                                                    Atur Koordinat
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="space-y-4">
                                            <MapViewer
                                                latitude={wilayah.latitude ? Number(wilayah.latitude) : undefined}
                                                longitude={wilayah.longitude ? Number(wilayah.longitude) : undefined}
                                                markers={markers}
                                                routePoints={routePoints.length > 1 ? routePoints : []}
                                                height="450px"
                                                showToolbar={true}
                                                geojson={wilayah.geojson ?? undefined}
                                            />
                                            <div className="flex flex-wrap gap-2 items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-3 w-3 rounded-full bg-blue-500" title="Lokasi Kampung" />
                                                    <span className="text-sm text-gray-600">{kampungWithCoords.length} kampung di peta</span>
                                                </div>
                                                {routePoints.length > 1 && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-0.5 w-6 bg-green-500 rounded" />
                                                        <span className="text-sm text-gray-600">Rute pengangkutan (urut)</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </CardContent>
                        </Card>
                    )}

                    {/* Route Optimization */}
                    {showAdvanced && filteredKampung.length > 0 && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Navigation className="h-5 w-5 text-blue-500" />
                                    Optimasi Rute
                                </CardTitle>
                                <CardDescription>
                                    Atur urutan kampung untuk optimasi perjalanan pengangkutan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {filteredKampung
                                            .sort((a, b) => (a.urutan_rute || 0) - (b.urutan_rute || 0))
                                            .slice(0, 4)
                                            .map((row, index) => (
                                                <div key={row.id} className="border rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Badge variant="outline">Rute #{index + 1}</Badge>
                                                        <Badge variant={row.is_active ? "default" : "secondary"} className="text-xs">
                                                            {row.is_active ? 'Aktif' : 'Nonaktif'}
                                                        </Badge>
                                                    </div>
                                                    <div className="font-medium mb-1">{row.nama_kampung}</div>
                                                    <div className="text-xs text-gray-500">
                                                        Urutan saat ini: {row.urutan_rute || 0}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => {
                                                // Logic to auto-optimize route
                                                toast.success('Optimasi rute otomatis akan segera hadir');
                                            }}
                                        >
                                            <TrendingUp className="mr-2 h-4 w-4" />
                                            Optimasi Otomatis
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => {
                                                // Logic to reset route order
                                                toast.success('Reset urutan rute akan segera hadir');
                                            }}
                                        >
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Reset Urutan
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Route Dialog */}
            <Dialog open={showRouteDialog} onOpenChange={setShowRouteDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Compass className="h-5 w-5" />
                            Detail Rute Kampung
                        </DialogTitle>
                        <DialogDescription>
                            Informasi detail kampung dan koordinat
                        </DialogDescription>
                    </DialogHeader>
                    {selectedKampung && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                        <Home className="h-6 w-6" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-bold text-lg">{selectedKampung.nama_kampung}</h4>
                                    <p className="text-sm text-gray-500">ID: {selectedKampung.id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Status</p>
                                    <Badge variant={selectedKampung.is_active ? "default" : "secondary"}>
                                        {selectedKampung.is_active ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Urutan Rute</p>
                                    <p className="font-bold">{selectedKampung.urutan_rute || 0}</p>
                                </div>
                            </div>

                            {selectedKampung.latitude && selectedKampung.longitude ? (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Koordinat</p>
                                    <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                                        Latitude: {selectedKampung.latitude}<br />
                                        Longitude: {selectedKampung.longitude}
                                    </div>
                                    <Button className="w-full" variant="outline">
                                        <Navigation className="mr-2 h-4 w-4" />
                                        Buka di Google Maps
                                    </Button>
                                </div>
                            ) : (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    <p className="text-amber-700 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        Koordinat belum diatur
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowRouteDialog(false)}>
                                    Tutup
                                </Button>
                                <Link href={`/admin/wilayah/${wilayah.id}/kampung/${selectedKampung.id}/edit`}>
                                    <Button>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit Kampung
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={deleteId !== null}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="Hapus Kampung"
                description="Apakah Anda yakin ingin menghapus kampung ini? Data yang terkait mungkin akan terpengaruh."
                confirmText="Hapus"
                cancelText="Batal"
                variant="destructive"
                onConfirm={handleDelete}
            />
        </AppLayout>
    );
}