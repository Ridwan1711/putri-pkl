import { Head, Link, router } from '@inertiajs/react';
import { 
  Plus, Pencil, Trash2, Eye, Filter, Search, 
  MapPin, Download, RefreshCw, MoreVertical, 
  CheckCircle, XCircle, Settings, Globe, Building,
  ChevronRight, Grid3x3, List, Users, BarChart3,
  Home, Map, Layers,  Shield, AlertCircle,
  TrendingUp, ArrowRight, ChevronDown, Users2,
  Calendar, Package, Activity, Target
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

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'react-hot-toast';
import type { BreadcrumbItem } from '@/types';
import type { Wilayah, Kampung } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
  },
  {
    title: 'Wilayah',
    href: '/admin/wilayah',
  },
];

interface Props {
    wilayah: {
        data: Wilayah[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
    };
}

export default function WilayahIndex({ wilayah, filters }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState<'table' | 'grid' | 'map'>('table');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showStats, setShowStats] = useState(true);

    const handleDelete = (id: number) => {
        router.delete(`/admin/wilayah/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteId(null);
                toast.success('Wilayah berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus wilayah');
            },
        });
    };

    const handleFilter = () => {
        const params: any = {};
        if (searchTerm) params.search = searchTerm;
        if (statusFilter !== 'all') params.status = statusFilter;
        
        router.visit('/admin/wilayah', {
            data: params,
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        router.visit('/admin/wilayah', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const toggleStatus = (wilayah: Wilayah) => {
        router.patch(`/admin/wilayah/${wilayah.id}/toggle-status`, {
            is_active: !wilayah.is_active,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Status wilayah berhasil diubah`);
            },
        });
    };

    // Calculate stats
    const stats = {
        total: wilayah.total,
        aktif: wilayah.data.filter(w => w.is_active).length,
        nonaktif: wilayah.data.filter(w => !w.is_active).length,
        totalKecamatan: Array.from(new Set(wilayah.data.map(w => w.kecamatan))).length,
        totalKampung: wilayah.data.reduce((sum, w) => sum + (w.kampung?.length || 0), 0),
        avgKampungPerWilayah: Math.round(wilayah.total > 0 ? wilayah.data.reduce((sum, w) => sum + (w.kampung?.length || 0), 0) / wilayah.total : 0),
    };

    const statusOptions = [
        { value: 'all', label: 'Semua Status' },
        { value: 'aktif', label: 'Aktif' },
        { value: 'nonaktif', label: 'Nonaktif' },
    ];

    const columns = [
        {
            header: 'Wilayah',
            accessor: (row: Wilayah) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                            <MapPin className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{row.nama_wilayah}</p>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                                {row.kecamatan}
                            </Badge>
                            <Badge variant="secondary" className="text-xs gap-1">
                                <Home className="h-3 w-3" />
                                {row.kampung?.length || 0} kampung
                            </Badge>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Kampung Cakupan',
            accessor: (row: Wilayah) => {
                const kampungs = row.kampung || [];
                const displayedKampungs = kampungs.slice(0, 3);
                const remaining = kampungs.length - 3;
                
                return (
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                            {displayedKampungs.map((k, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {k.nama_kampung}
                                </Badge>
                            ))}
                            {remaining > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                    +{remaining} lainnya
                                </Badge>
                            )}
                        </div>
                        <Link 
                            href={`/admin/wilayah/${row.id}/kampung`}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            Kelola kampung
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                );
            },
        },
        
        {
            header: 'Status',
            accessor: (row: Wilayah) => (
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <div className={`h-2 w-2 rounded-full ${row.is_active ? 'bg-green-500' : 'bg-gray-400'}`}>
                            <div className={`absolute inset-0 ${row.is_active ? 'animate-ping bg-green-500' : ''} rounded-full`}></div>
                        </div>
                    </div>
                    <Badge variant={row.is_active ? "default" : "outline"}>
                        {row.is_active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                </div>
            ),
        },
        {
            header: 'Aksi',
            accessor: (row: Wilayah) => (
                <div className="flex items-center gap-1">
                    <Link href={`/admin/wilayah/${row.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/admin/wilayah/${row.id}/kampung`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Home className="h-4 w-4" />
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
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/wilayah/${row.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Detail Lengkap
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/wilayah/${row.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Wilayah
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/wilayah/${row.id}/kampung`}>
                                    <Home className="mr-2 h-4 w-4" />
                                    Kelola Kampung
                                </Link>
                            </DropdownMenuItem>
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => setDeleteId(row.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus Wilayah
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    // Group by kecamatan for summary
    const wilayahByKecamatan = wilayah.data.reduce((acc, item) => {
        if (!acc[item.kecamatan]) {
            acc[item.kecamatan] = [];
        }
        acc[item.kecamatan].push(item);
        return acc;
    }, {} as Record<string, Wilayah[]>);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Wilayah & Kampung" />
            
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header Section */}
                <div className="border-b bg-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                                    <Layers className="h-8 w-8 text-blue-500" />
                                    Manajemen Wilayah & Kampung
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Kelola wilayah operasional dan kampung cakupan
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
                                        <DropdownMenuItem onClick={() => { const p: Record<string, string> = { format: 'excel' }; if (searchTerm) p.search = searchTerm; window.open(`/admin/wilayah/export?${new URLSearchParams(p)}`, '_blank'); }}>
                                            Export Excel
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => { const p: Record<string, string> = { format: 'pdf' }; if (searchTerm) p.search = searchTerm; window.open(`/admin/wilayah/export?${new URLSearchParams(p)}`, '_blank'); }}>
                                            Export PDF
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => { const p: Record<string, string> = { format: 'csv' }; if (searchTerm) p.search = searchTerm; window.open(`/admin/wilayah/export?${new URLSearchParams(p)}`, '_blank'); }}>
                                            Export CSV
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                
                                <Link href="/admin/wilayah/create">
                                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Wilayah
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-6">
                    {/* Stats Cards */}
                    {showStats && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                            <Card className="border-blue-100">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Wilayah</p>
                                            <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Globe className="h-5 w-5 text-blue-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-green-100">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Wilayah Aktif</p>
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
                                            <p className="text-sm font-medium text-gray-600">Wilayah Nonaktif</p>
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
                                            <p className="text-sm font-medium text-gray-600">Kampung Cakupan</p>
                                            <h3 className="text-2xl font-bold mt-1">{stats.totalKampung}</h3>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                            <Home className="h-5 w-5 text-purple-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-amber-100">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Rata-rata Kampung</p>
                                            <h3 className="text-2xl font-bold mt-1">{stats.avgKampungPerWilayah}</h3>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                                            <Target className="h-5 w-5 text-amber-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Filters and Actions */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Cari nama wilayah, kecamatan, atau kampung..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
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
                                        id="show-stats"
                                        checked={showStats}
                                        onCheckedChange={setShowStats}
                                    />
                                    <Label htmlFor="show-stats" className="text-sm">
                                        Tampilkan Statistik
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
                                    <Button
                                        variant={viewMode === 'map' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('map')}
                                    >
                                        <Map className="mr-2 h-4 w-4" />
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
                                <CardTitle>Daftar Wilayah & Kampung</CardTitle>
                                <CardDescription>
                                    {wilayah.total} wilayah ditemukan dengan total {stats.totalKampung} kampung
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
                                            {wilayah.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan={columns.length} className="py-12 text-center">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <MapPin className="h-12 w-12 text-gray-300 mb-4" />
                                                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                                                Tidak ada wilayah ditemukan
                                                            </h3>
                                                            <p className="text-gray-500 mb-4">
                                                                {searchTerm || statusFilter !== 'all'
                                                                    ? 'Coba ubah filter pencarian'
                                                                    : 'Mulai dengan menambahkan wilayah baru'}
                                                            </p>
                                                            <Link href="/admin/wilayah/create">
                                                                <Button>
                                                                    <Plus className="mr-2 h-4 w-4" />
                                                                    Tambah Wilayah
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                wilayah.data.map((row) => (
                                                    <tr 
                                                        key={row.id} 
                                                        className="border-b hover:bg-gray-50 transition-colors"
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
                            
                            {wilayah.data.length > 0 && (
                                <CardFooter className="flex items-center justify-between border-t">
                                    <div className="text-sm text-gray-600">
                                        Menampilkan {wilayah.data.length} dari {wilayah.total} wilayah
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {wilayah.links.map((link, index) => (
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
                    ) : viewMode === 'grid' ? (
                        <div className="space-y-6">
                            {wilayah.data.length === 0 ? (
                                <Card className="col-span-full">
                                    <CardContent className="py-12 text-center">
                                        <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                            Tidak ada wilayah ditemukan
                                        </h3>
                                        <p className="text-gray-500 mb-4">
                                            {searchTerm || statusFilter !== 'all'
                                                ? 'Coba ubah filter pencarian'
                                                : 'Mulai dengan menambahkan wilayah baru'}
                                        </p>
                                        <Link href="/admin/wilayah/create">
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Tambah Wilayah
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Accordion type="single" collapsible className="space-y-4">
                                    {wilayah.data.map((row) => (
                                        <AccordionItem key={row.id} value={`item-${row.id}`} className="border-0">
                                            <Card className="hover:shadow-lg transition-shadow border-b-0">
                                                <AccordionTrigger className="py-6 px-6 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                                                    <div className="flex items-center gap-3 flex-1 text-left">
                                                        <Avatar className="h-12 w-12">
                                                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                                                <MapPin className="h-6 w-6" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <CardTitle className="text-lg">{row.nama_wilayah}</CardTitle>
                                                            <CardDescription>
                                                                {row.kecamatan} • {row.kampung?.length || 0} kampung
                                                            </CardDescription>
                                                        </div>
                                                        <Badge variant={row.is_active ? "default" : "outline"} className="ml-auto">
                                                            {row.is_active ? 'Aktif' : 'Nonaktif'}
                                                        </Badge>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <CardContent className="pt-0">
                                                        <div className="space-y-4">
                                                            {/* Kampung List */}
                                                            <div>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h4 className="font-semibold flex items-center gap-2">
                                                                        <Home className="h-4 w-4" />
                                                                        Kampung Cakupan
                                                                    </h4>
                                                                    <Link
                                                                        href={`/admin/wilayah/${row.id}/kampung`}
                                                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                                    >
                                                                        Kelola
                                                                        <ArrowRight className="h-3 w-3" />
                                                                    </Link>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                    {row.kampung?.map((k: Kampung, index: number) => (
                                                                        <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                                                                            <span className="text-sm">{k.nama_kampung}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                {(!row.kampung || row.kampung.length === 0) && (
                                                                    <div className="text-center py-4 text-gray-500">
                                                                        Belum ada kampung ditambahkan
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Actions */}
                                                            <div className="flex justify-between pt-4 border-t">
                                                                <div className="flex gap-1">
                                                                    <Link href={`/admin/wilayah/${row.id}`}>
                                                                        <Button variant="ghost" size="sm">
                                                                            <Eye className="mr-2 h-4 w-4" />
                                                                            Detail
                                                                        </Button>
                                                                    </Link>
                                                                    <Link href={`/admin/wilayah/${row.id}/edit`}>
                                                                        <Button variant="ghost" size="sm">
                                                                            <Pencil className="mr-2 h-4 w-4" />
                                                                            Edit
                                                                        </Button>
                                                                    </Link>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-red-600 hover:text-red-700"
                                                                    onClick={() => setDeleteId(row.id)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Hapus
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </AccordionContent>
                                            </Card>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            )}
                        </div>
                    ) : (
                        /* Map View */
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Map className="h-5 w-5 text-green-500" />
                                    Peta Wilayah
                                </CardTitle>
                                <CardDescription>
                                    Visualisasi wilayah dan distribusi kampung
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="min-h-[400px]">
                                <div className="border rounded-lg p-4 h-full">
                                    <div className="flex flex-col items-center justify-center h-96">
                                        <Map className="h-32 w-32 text-gray-300 mb-4" />
                                        <p className="text-gray-500 mb-2">Map View (Coming Soon)</p>
                                        <p className="text-sm text-gray-400 text-center max-w-md">
                                            Fitur peta interaktif akan segera hadir untuk visualisasi wilayah dan kampung secara geografis
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                        {wilayah.data.slice(0, 3).map((row) => (
                                            <div key={row.id} className="border rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MapPin className="h-4 w-4 text-blue-500" />
                                                    <span className="font-medium">{row.nama_wilayah}</span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {row.kecamatan} • {row.kampung?.length || 0} kampung
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Kecamatan Summary */}
                    {viewMode !== 'map' && Object.keys(wilayahByKecamatan).length > 0 && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5 text-purple-500" />
                                    Ringkasan per Kecamatan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(wilayahByKecamatan).map(([kecamatan, items]) => {
                                        const aktifCount = items.filter(w => w.is_active).length;
                                        const totalCount = items.length;
                                        const kampungCount = items.reduce((sum, w) => sum + (w.kampung?.length || 0), 0);
                                        const percentage = (aktifCount / totalCount) * 100;
                                        
                                        return (
                                            <div key={kecamatan} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold flex items-center gap-2">
                                                        <Building className="h-4 w-4" />
                                                        {kecamatan}
                                                    </h4>
                                                    <Badge variant="outline">{totalCount} wilayah</Badge>
                                                </div>
                                                <div className="space-y-3">
                                                    <div>
                                                        <div className="flex items-center justify-between text-sm mb-1">
                                                            <span className="text-gray-600">Status Aktif</span>
                                                            <span className="font-bold">{aktifCount}/{totalCount}</span>
                                                        </div>
                                                        <Progress value={percentage} className="h-2" />
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">Total Kampung</span>
                                                        <span className="font-bold">{kampungCount}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">Rata-rata Kampung</span>
                                                        <span className="font-bold">
                                                            {Math.round(kampungCount / Math.max(totalCount, 1))}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={deleteId !== null}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="Hapus Wilayah"
                description="Apakah Anda yakin ingin menghapus wilayah ini? Semua data kampung yang terkait juga akan dihapus."
                confirmText="Hapus"
                cancelText="Batal"
                variant="destructive"
                onConfirm={() => deleteId && handleDelete(deleteId)}
            />
        </AppLayout>
    );
}