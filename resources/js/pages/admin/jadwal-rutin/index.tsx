import { Head, router, useForm } from '@inertiajs/react';
import { 
  Trash2, Plus, Calendar, Filter, RefreshCw, 
  Users, Truck, MapPin, Clock, Check, X, 
  MoreVertical, Download, Eye, AlertCircle,
  ChevronRight, Grid3x3, List, BarChart3,
  Settings2, CalendarDays, UserCheck
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'react-hot-toast';
import type { BreadcrumbItem } from '@/types';
import type { Petugas, Armada, Wilayah } from '@/types/models';

export type JadwalRutin = {
    id: number;
    petugas_id: number;
    armada_id: number;
    hari: number;
    wilayah_id: number;
    petugas?: Petugas;
    armada?: Armada;
    wilayah?: Wilayah;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Jadwal Rutin', href: '/admin/jadwal-rutin' },
];

const HARI_LABELS: Record<number, string> = {
    1: 'Senin',
    2: 'Selasa',
    3: 'Rabu',
    4: 'Kamis',
    5: 'Jumat',
    6: 'Sabtu',
    7: 'Minggu',
};

const HARI_OPTIONS = [
    { value: '1', label: 'Senin', short: 'Sen' },
    { value: '2', label: 'Selasa', short: 'Sel' },
    { value: '3', label: 'Rabu', short: 'Rab' },
    { value: '4', label: 'Kamis', short: 'Kam' },
    { value: '5', label: 'Jumat', short: 'Jum' },
    { value: '6', label: 'Sabtu', short: 'Sab' },
    { value: '7', label: 'Minggu', short: 'Min' },
];

interface Props {
    jadwalRutin: JadwalRutin[];
    petugas: Petugas[];
    armada: Armada[];
    wilayah: Wilayah[];
    hariOptions: Record<number, string>;
    filters: { hari?: string; petugas_id?: string };
}

export default function JadwalRutinIndex({
    jadwalRutin,
    petugas,
    armada,
    wilayah,
    filters,
}: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid' | 'calendar'>('grid');
    const [selectedHari, setSelectedHari] = useState(filters.hari || 'all');
    const [selectedPetugas, setSelectedPetugas] = useState(filters.petugas_id || 'all');
    const [showAddForm, setShowAddForm] = useState(false);
    
    const form = useForm({
        petugas_id: '',
        armada_id: '',
        hari: '',
        wilayah_ids: [] as number[],
    });

    const handleFilter = () => {
        const params: any = {};
        if (selectedHari !== 'all') params.hari = selectedHari;
        if (selectedPetugas !== 'all') params.petugas_id = selectedPetugas;
        
        router.get('/admin/jadwal-rutin', params, { 
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleResetFilters = () => {
        setSelectedHari('all');
        setSelectedPetugas('all');
        router.get('/admin/jadwal-rutin', {}, { 
            preserveState: true,
            preserveScroll: true,
        });
    };

    const toggleWilayah = (id: number) => {
        const next = form.data.wilayah_ids.includes(id)
            ? form.data.wilayah_ids.filter((w) => w !== id)
            : [...form.data.wilayah_ids, id];
        form.setData('wilayah_ids', next);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.data.wilayah_ids.length === 0) {
            form.setError('wilayah_ids', 'Pilih minimal satu wilayah');
            toast.error('Pilih minimal satu wilayah');
            return;
        }
        form.post('/admin/jadwal-rutin', {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setShowAddForm(false);
                toast.success('Jadwal rutin berhasil ditambahkan');
            },
            onError: () => {
                toast.error('Gagal menambahkan jadwal rutin');
            },
        });
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/jadwal-rutin/${deleteId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteId(null);
                    toast.success('Jadwal rutin berhasil dihapus');
                },
                onError: () => {
                    toast.error('Gagal menghapus jadwal rutin');
                },
            });
        }
    };

    // Group jadwal by hari for grid view
    const jadwalByHari = jadwalRutin.reduce((acc, jadwal) => {
        const hari = jadwal.hari;
        if (!acc[hari]) {
            acc[hari] = [];
        }
        acc[hari].push(jadwal);
        return acc;
    }, {} as Record<number, JadwalRutin[]>);

    // Calculate stats
    const stats = {
        totalJadwal: jadwalRutin.length,
        petugasAktif: Array.from(new Set(jadwalRutin.map(j => j.petugas_id))).length,
        wilayahTercover: Array.from(new Set(jadwalRutin.map(j => j.wilayah_id))).length,
        armadaTerpakai: Array.from(new Set(jadwalRutin.map(j => j.armada_id))).length,
    };

    // Get unique hari from jadwal for calendar view
    const hariTerisi = Array.from(new Set(jadwalRutin.map(j => j.hari))).sort();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwal Rutin Petugas & Armada" />
            
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header Section */}
                <div className="border-b bg-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                                    <CalendarDays className="h-8 w-8 text-blue-500" />
                                    Jadwal Rutin
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Kelola jadwal rutin petugas dan armada per wilayah
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
                                
                                <Button 
                                    onClick={() => setShowAddForm(true)}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Jadwal
                                </Button>
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
                                        <p className="text-sm font-medium text-gray-600">Total Jadwal</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.totalJadwal}</h3>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-green-100">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Petugas Aktif</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.petugasAktif}</h3>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-purple-100">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Wilayah Tercover</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.wilayahTercover}</h3>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-orange-100">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Armada Terpakai</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.armadaTerpakai}</h3>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                        <Truck className="h-5 w-5 text-orange-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters and View Controls */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex flex-wrap gap-4">
                                    <div className="grid gap-2">
                                        <Label className="text-sm">Hari</Label>
                                        <Select
                                            value={selectedHari}
                                            onValueChange={setSelectedHari}
                                        >
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue placeholder="Semua Hari" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Semua Hari</SelectItem>
                                                {HARI_OPTIONS.map((hari) => (
                                                    <SelectItem key={hari.value} value={hari.value}>
                                                        {hari.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="grid gap-2">
                                        <Label className="text-sm">Petugas</Label>
                                        <Select
                                            value={selectedPetugas}
                                            onValueChange={setSelectedPetugas}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Semua Petugas" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Semua Petugas</SelectItem>
                                                {petugas.map((p) => (
                                                    <SelectItem key={p.id} value={p.id.toString()}>
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-5 w-5">
                                                                <AvatarFallback className="text-xs">
                                                                    {p.user?.name?.charAt(0) || 'P'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            {p.user?.name || '-'}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="flex items-end gap-2">
                                        <Button onClick={handleFilter}>
                                            <Filter className="mr-2 h-4 w-4" />
                                            Filter
                                        </Button>
                                        <Button variant="outline" onClick={handleResetFilters}>
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Reset
                                        </Button>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <Grid3x3 className="mr-2 h-4 w-4" />
                                        Grid
                                    </Button>
                                    <Button
                                        variant={viewMode === 'table' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('table')}
                                    >
                                        <List className="mr-2 h-4 w-4" />
                                        Tabel
                                    </Button>
                                    <Button
                                        variant={viewMode === 'calendar' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('calendar')}
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Kalender
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Jadwal Display */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {HARI_OPTIONS.map((hari) => {
                                const jadwalHariIni = jadwalByHari[parseInt(hari.value)] || [];
                                return (
                                    <Card key={hari.value} className={`border-l-4 ${jadwalHariIni.length > 0 ? 'border-l-blue-500' : 'border-l-gray-200'}`}>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">{hari.label}</CardTitle>
                                                    <CardDescription>
                                                        {jadwalHariIni.length} jadwal
                                                    </CardDescription>
                                                </div>
                                                <Badge variant={jadwalHariIni.length > 0 ? "default" : "outline"}>
                                                    {jadwalHariIni.length > 0 ? 'Terisi' : 'Kosong'}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            {jadwalHariIni.length === 0 ? (
                                                <div className="py-8 text-center">
                                                    <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                                    <p className="text-gray-500">Tidak ada jadwal</p>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="mt-2"
                                                        onClick={() => {
                                                            setShowAddForm(true);
                                                            form.setData('hari', hari.value);
                                                        }}
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Tambah Jadwal
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {jadwalHariIni.map((jadwal) => (
                                                        <div key={jadwal.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Avatar className="h-8 w-8">
                                                                        <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                                                            {jadwal.petugas?.user?.name?.charAt(0) || 'P'}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <p className="font-medium text-sm">
                                                                            {jadwal.petugas?.user?.name || '-'}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {jadwal.armada?.kode_armada || '-'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                                                            <MoreVertical className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem>
                                                                            <Eye className="mr-2 h-4 w-4" />
                                                                            Detail
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem>
                                                                            <Settings2 className="mr-2 h-4 w-4" />
                                                                            Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem 
                                                                            className="text-red-600"
                                                                            onClick={() => setDeleteId(jadwal.id)}
                                                                        >
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            Hapus
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <MapPin className="h-3 w-3" />
                                                                <span>{jadwal.wilayah?.nama_wilayah || '-'}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : viewMode === 'table' ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Daftar Jadwal Rutin</CardTitle>
                                <CardDescription>
                                    {jadwalRutin.length} jadwal ditemukan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto rounded-lg border">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b bg-gray-50">
                                                <th className="px-4 py-3 text-left font-medium">Hari</th>
                                                <th className="px-4 py-3 text-left font-medium">Petugas</th>
                                                <th className="px-4 py-3 text-left font-medium">Armada</th>
                                                <th className="px-4 py-3 text-left font-medium">Wilayah</th>
                                                <th className="px-4 py-3 text-right font-medium">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jadwalRutin.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-4 py-12 text-center">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                                                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                                                Tidak ada jadwal ditemukan
                                                            </h3>
                                                            <p className="text-gray-500 mb-4">
                                                                {selectedHari !== 'all' || selectedPetugas !== 'all'
                                                                    ? 'Coba ubah filter pencarian'
                                                                    : 'Mulai dengan menambahkan jadwal baru'}
                                                            </p>
                                                            <Button onClick={() => setShowAddForm(true)}>
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Tambah Jadwal
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                jadwalRutin.map((j) => (
                                                    <tr key={j.id} className="border-b hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <Badge variant="outline" className="font-normal">
                                                                {HARI_LABELS[j.hari] || '-'}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback className="text-xs">
                                                                        {j.petugas?.user?.name?.charAt(0) || 'P'}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="font-medium">{j.petugas?.user?.name || '-'}</p>
                                                                    <p className="text-xs text-gray-500">{j.petugas?.user?.email || '-'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <Truck className="h-4 w-4 text-gray-400" />
                                                                <div>
                                                                    <p className="font-medium">{j.armada?.kode_armada || '-'}</p>
                                                                    <p className="text-xs text-gray-500">{j.armada?.jenis_kendaraan || '-'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                                <div>
                                                                    <p className="font-medium">{j.wilayah?.nama_wilayah || '-'}</p>
                                                                    <p className="text-xs text-gray-500">{j.wilayah?.kecamatan || '-'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex justify-end gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    onClick={() => setDeleteId(j.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Kalender Jadwal</CardTitle>
                                <CardDescription>
                                    Tampilan kalender mingguan jadwal rutin
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-7 gap-2">
                                    {HARI_OPTIONS.map((hari) => {
                                        const jadwalHariIni = jadwalByHari[parseInt(hari.value)] || [];
                                        return (
                                            <div key={hari.value} className="border rounded-lg p-3">
                                                <div className="text-center font-semibold text-sm mb-2">
                                                    {hari.short}
                                                </div>
                                                <div className="space-y-2">
                                                    {jadwalHariIni.map((jadwal) => (
                                                        <div key={jadwal.id} className="bg-blue-50 border border-blue-200 rounded p-2 text-xs">
                                                            <p className="font-medium truncate">{jadwal.petugas?.user?.name}</p>
                                                            <p className="text-blue-600 truncate">{jadwal.wilayah?.nama_wilayah}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                {jadwalHariIni.length === 0 && (
                                                    <div className="text-center text-gray-400 text-xs py-4">
                                                        Kosong
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Add Jadwal Dialog */}
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            Tambah Jadwal Rutin
                        </DialogTitle>
                        <DialogDescription>
                            Tambahkan jadwal rutin untuk petugas dan armada di wilayah tertentu
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="petugas_id">Petugas *</Label>
                                <Select
                                    value={form.data.petugas_id}
                                    onValueChange={(v) => form.setData('petugas_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Petugas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {petugas.map((p) => (
                                            <SelectItem key={p.id} value={p.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-5 w-5">
                                                        <AvatarFallback className="text-xs">
                                                            {p.user?.name?.charAt(0) || 'P'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{p.user?.name || '-'}</p>
                                                        <p className="text-xs text-gray-500">{p.wilayah?.nama_wilayah || '-'}</p>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.petugas_id} />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="armada_id">Armada *</Label>
                                <Select
                                    value={form.data.armada_id}
                                    onValueChange={(v) => form.setData('armada_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Armada" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {armada.map((a) => (
                                            <SelectItem key={a.id} value={a.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <Truck className="h-4 w-4 text-gray-400" />
                                                    <div>
                                                        <p className="font-medium">{a.kode_armada}</p>
                                                        <p className="text-xs text-gray-500">{a.jenis_kendaraan}</p>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.armada_id} />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="hari">Hari *</Label>
                                <Select value={form.data.hari} onValueChange={(v) => form.setData('hari', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Hari" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {HARI_OPTIONS.map((hari) => (
                                            <SelectItem key={hari.value} value={hari.value}>
                                                {hari.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.hari} />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="wilayah_ids">Wilayah *</Label>
                                <div className="text-sm text-gray-500 mb-2">
                                    Pilih minimal 1 wilayah
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Daftar Wilayah</Label>
                            <div className="max-h-60 overflow-y-auto border rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {wilayah.map((w) => (
                                        <div key={w.id} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`wilayah_${w.id}`}
                                                checked={form.data.wilayah_ids.includes(w.id)}
                                                onCheckedChange={() => toggleWilayah(w.id)}
                                            />
                                            <Label
                                                htmlFor={`wilayah_${w.id}`}
                                                className="cursor-pointer text-sm flex-1"
                                            >
                                                <div className="font-medium">{w.nama_wilayah}</div>
                                                <div className="text-gray-500 text-xs">{w.kecamatan}</div>
                                            </Label>
                                            {form.data.wilayah_ids.includes(w.id) && (
                                                <Badge variant="outline" className="text-xs">
                                                    Terpilih
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <InputError message={form.errors.wilayah_ids} />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowAddForm(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Tambah Jadwal'
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteId !== null}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Jadwal Rutin"
                description="Apakah Anda yakin ingin menghapus jadwal ini? Tindakan ini tidak dapat dibatalkan."
                variant="destructive"
                confirmText="Hapus"
                cancelText="Batal"
            />
        </AppLayout>
    );
}