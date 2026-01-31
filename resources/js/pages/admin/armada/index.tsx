import { Head, Link, router } from '@inertiajs/react';
import { 
  Plus, Pencil, Trash2, Eye, Filter, Search, 
  Truck, Download, RefreshCw, MoreVertical, 
  AlertCircle, CheckCircle, XCircle, Settings,
  Calendar, Users, BarChart3, Battery, Fuel,
  ChevronRight, Grid3x3, List, Package, Shield
} from 'lucide-react';
import React, { useState } from 'react';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/status-badge';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'react-hot-toast';
import type { BreadcrumbItem } from '@/types';
import type { Armada } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
  },
  {
    title: 'Armada',
    href: '/admin/armada',
  },
];

interface Props {
    armada: {
        data: Armada[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

const statusConfig = {
  aktif: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
  perbaikan: { icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50" },
  nonaktif: { icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
};

export default function ArmadaIndex({ armada, filters }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [showInactive, setShowInactive] = useState(true);

    const handleDelete = (id: number) => {
        router.delete(`/admin/armada/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteId(null);
                toast.success('Armada berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus armada');
            },
        });
    };

    const handleFilter = () => {
        const params: any = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedStatus !== 'all') params.status = selectedStatus;
        
        router.visit('/admin/armada', {
            data: params,
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        router.visit('/admin/armada', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const toggleStatus = (armada: Armada) => {
        const nextStatus = armada.status === 'aktif' ? 'nonaktif' : 'aktif';
        router.patch(`/admin/armada/${armada.id}/status`, {
            status: nextStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Status armada berhasil diubah`);
            },
        });
    };

    // Calculate stats
    const stats = {
        total: armada.total,
        aktif: armada.data.filter(a => a.status === 'aktif').length,
        perbaikan: armada.data.filter(a => a.status === 'perbaikan').length,
        nonaktif: armada.data.filter(a => a.status === 'nonaktif').length,
        totalKapasitas: armada.data.reduce((sum, a) => sum + (a.kapasitas || 0), 0),
    };

    const statusOptions = [
        { value: 'all', label: 'Semua Status' },
        { value: 'aktif', label: 'Aktif' },
        { value: 'perbaikan', label: 'Perbaikan' },
        { value: 'nonaktif', label: 'Nonaktif' },
    ];

    const columns = [
        {
            header: 'Armada',
            accessor: (row: Armada) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                            <Truck className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{row.kode_armada}</p>
                        <p className="text-sm text-gray-500">{row.plat_nomor}</p>
                    </div>
                </div>
            ),
        },
        {
            header: 'Detail',
            accessor: (row: Armada) => (
                <div className="space-y-1">
                    <p className="font-medium">{row.jenis_kendaraan}</p>
                    <div className="flex items-center gap-2">
                        <Package className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">Kapasitas: {row.kapasitas} m³</span>
                    </div>
                  
                </div>
            ),
        },
        {
            header: 'Status',
            accessor: (row: Armada) => {
                const config = statusConfig[row.status as keyof typeof statusConfig];
                const Icon = config?.icon || AlertCircle;
                return (
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${config?.bg || 'bg-gray-50'}`}>
                            <Icon className={`h-4 w-4 ${config?.color || 'text-gray-500'}`} />
                        </div>
                        <div>
                            <StatusBadge status={row.status} />
                            <p className="text-xs text-gray-500 mt-1">
                                {row.updated_at ? new Date(row.updated_at).toLocaleDateString('id-ID') : '-'}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            header: 'Aksi',
            accessor: (row: Armada) => (
                <div className="flex items-center gap-1">
                    <Link href={`/admin/armada/${row.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/admin/armada/${row.id}/edit`}>
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
                                {row.status === 'aktif' ? (
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
                            <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                Lihat Jadwal
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Lihat Performa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => setDeleteId(row.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus Armada
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Armada" />
            
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header Section */}
                <div className="border-b bg-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                                    <Truck className="h-8 w-8 text-blue-500" />
                                    Manajemen Armada
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Kelola armada pengangkutan sampah
                                </p>
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
                                        <DropdownMenuItem>Export Excel</DropdownMenuItem>
                                        <DropdownMenuItem>Export PDF</DropdownMenuItem>
                                        <DropdownMenuItem>Export CSV</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                
                                <Link href="/admin/armada/create">
                                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Armada
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
                                        <p className="text-sm font-medium text-gray-600">Total Armada</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Truck className="h-5 w-5 text-blue-600" />
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

                        <Card className="border-amber-100">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Perbaikan</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.perbaikan}</h3>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                                        <AlertCircle className="h-5 w-5 text-amber-600" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <Progress 
                                        value={(stats.perbaikan / stats.total) * 100} 
                                        className="h-2 bg-amber-100" 
 
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-red-100">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Nonaktif</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.nonaktif}</h3>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                        <XCircle className="h-5 w-5 text-red-600" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <Progress 
                                        value={(stats.nonaktif / stats.total) * 100} 
                                        className="h-2 bg-red-100" 
                                    />
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
                                            placeholder="Cari kode armada, plat nomor, jenis kendaraan..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger className="w-full md:w-[180px]">
                                            <SelectValue placeholder="Semua Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <div className="flex items-center gap-2">
                                                        {option.value !== 'all' && statusConfig[option.value as keyof typeof statusConfig]?.icon && 
                                                            React.createElement(statusConfig[option.value as keyof typeof statusConfig]?.icon!, { className: "h-4 w-4" })
                                                        }
                                                        {option.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Button variant="outline" onClick={handleResetFilters}>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Reset
                                    </Button>

                                    <Button onClick={handleFilter}>
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filter
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="show-inactive"
                                        checked={showInactive}
                                        onCheckedChange={setShowInactive}
                                    />
                                    <Label htmlFor="show-inactive" className="text-sm">
                                        Tampilkan yang nonaktif
                                    </Label>
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
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Display */}
                    {viewMode === 'table' ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Daftar Armada</CardTitle>
                                <CardDescription>
                                    {armada.total} armada ditemukan • Total kapasitas: {stats.totalKapasitas} m³
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto rounded-lg border">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b bg-gray-50">
                                                {columns.map((column, index) => (
                                                    <th key={index} className="text-left py-3 px-4 font-semibold text-gray-700">
                                                        {column.header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {armada.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan={columns.length} className="py-12 text-center">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <Truck className="h-12 w-12 text-gray-300 mb-4" />
                                                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                                                Tidak ada armada ditemukan
                                                            </h3>
                                                            <p className="text-gray-500 mb-4">
                                                                {searchTerm || selectedStatus !== 'all'
                                                                    ? 'Coba ubah filter pencarian'
                                                                    : 'Mulai dengan menambahkan armada baru'}
                                                            </p>
                                                            <Link href="/admin/armada/create">
                                                                <Button>
                                                                    <Plus className="mr-2 h-4 w-4" />
                                                                    Tambah Armada
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                armada.data.map((row) => (
                                                    <tr 
                                                        key={row.id} 
                                                        className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                                                        onClick={() => router.visit(`/admin/armada/${row.id}`)}
                                                    >
                                                        {columns.map((column, index) => (
                                                            <td key={index} className="py-4 px-4">
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
                            
                            {armada.data.length > 0 && (
                                <CardFooter className="flex items-center justify-between border-t">
                                    <div className="text-sm text-gray-600">
                                        Menampilkan {armada.data.length} dari {armada.total} armada
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {armada.links.map((link, index) => (
                                            link.url ? (
                                                <Button
                                                    key={index}
                                                    variant={link.active ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => router.visit(link.url!)}
                                                >
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Button>
                                            ) : null
                                        ))}
                                    </div>
                                </CardFooter>
                            )}
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {armada.data.length === 0 ? (
                                <Card className="col-span-full">
                                    <CardContent className="py-12 text-center">
                                        <Truck className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                            Tidak ada armada ditemukan
                                        </h3>
                                        <p className="text-gray-500 mb-4">
                                            {searchTerm || selectedStatus !== 'all'
                                                ? 'Coba ubah filter pencarian'
                                                : 'Mulai dengan menambahkan armada baru'}
                                        </p>
                                        <Link href="/admin/armada/create">
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Tambah Armada
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ) : (
                                armada.data.map((row) => (
                                    <Card key={row.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                                            <Truck className="h-6 w-6" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <CardTitle className="text-lg">{row.kode_armada}</CardTitle>
                                                        <CardDescription>{row.plat_nomor}</CardDescription>
                                                    </div>
                                                </div>
                                                <StatusBadge status={row.status} />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-xs text-gray-500">Jenis Kendaraan</p>
                                                    <p className="font-medium">{row.jenis_kendaraan}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Kapasitas</p>
                                                    <p className="font-medium">{row.kapasitas} m³</p>
                                                </div>
                                            </div>
                                            
                                            <Separator />
                                            
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">Utilisasi</span>
                                                    <span className="font-bold">{row.kapasitas || Math.floor(Math.random() * 100)}%</span>
                                                </div>
                                                <Progress value={row.kapasitas || Math.floor(Math.random() * 100)} className="h-2" />
                                            </div>
                                            
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>Terakhir update: {new Date(row.updated_at).toLocaleDateString('id-ID')}</span>
                                                <div className="flex gap-1">
                                                    <Link href={`/admin/armada/${row.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                                            <Eye className="h-3 w-3" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/armada/${row.id}/edit`}>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                                            <Pencil className="h-3 w-3" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-red-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteId(row.id);
                                                        }}
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
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={deleteId !== null}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="Hapus Armada"
                description="Apakah Anda yakin ingin menghapus armada ini? Data yang telah dihapus tidak dapat dikembalikan."
                confirmText="Hapus"
                cancelText="Batal"
                variant="destructive"
                onConfirm={() => deleteId && handleDelete(deleteId)}
            />
        </AppLayout>
    );
}