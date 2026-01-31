import { Head, Link, router } from '@inertiajs/react';
import { 
  Eye, MapPin, Filter, Search, Plus, Download, 
  BarChart3, Calendar, Users, Truck, AlertCircle,
  CheckCircle, Clock, XCircle, MoreVertical,
  ChevronRight, RefreshCw, Layers, FileText,
  Home, Mail, Phone, TrendingUp, ExternalLink
} from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Input } from '@/components/ui/input';
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
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { MapViewer } from '@/components/map/MapViewer';
import { toast } from 'react-hot-toast';
import type { BreadcrumbItem } from '@/types';
import type { PengajuanPengangkutan, Wilayah } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
  },
  {
    title: 'Pengajuan',
    href: '/admin/pengajuan',
  },
];

interface Props {
  pengajuan: {
    data: PengajuanPengangkutan[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
  };
  wilayah: Wilayah[];
  filters: {
    status?: string;
    wilayah_id?: string;
    search?: string;
  };
}

const statusConfig = {
  diajukan: { icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
  diverifikasi: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
  dijadwalkan: { icon: Calendar, color: "text-purple-500", bg: "bg-purple-50" },
  diangkut: { icon: Truck, color: "text-orange-500", bg: "bg-orange-50" },
  selesai: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
  ditolak: { icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
};

export default function PengajuanIndex({ pengajuan, wilayah, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
  const [selectedWilayah, setSelectedWilayah] = useState(filters.wilayah_id || 'all');
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const handleFilter = () => {
    const params: any = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedStatus !== 'all') params.status = selectedStatus;
    if (selectedWilayah !== 'all') params.wilayah_id = selectedWilayah;
    
    router.visit('/admin/pengajuan', {
      data: params,
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedWilayah('all');
    router.visit('/admin/pengajuan', {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleViewMap = (row: PengajuanPengangkutan) => {
    if (row.latitude && row.longitude) {
      setSelectedMapLocation({
        latitude: row.latitude,
        longitude: row.longitude,
        address: row.alamat_lengkap,
      });
      setShowMapDialog(true);
    }
  };

  const handleBulkAction = (action: string) => {
    toast.error(`Aksi bulk: ${action} (Akan datang)`);
  };

  // Calculate stats
  const stats = {
    total: pengajuan.total,
    diajukan: pengajuan.data.filter(p => p.status === 'diajukan').length,
    diverifikasi: pengajuan.data.filter(p => p.status === 'diverifikasi').length,
    dijadwalkan: pengajuan.data.filter(p => p.status === 'dijadwalkan').length,
    selesai: pengajuan.data.filter(p => p.status === 'selesai').length,
  };

  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'diajukan', label: 'Diajukan' },
    { value: 'diverifikasi', label: 'Diverifikasi' },
    { value: 'dijadwalkan', label: 'Dijadwalkan' },
    { value: 'diangkut', label: 'Diangkut' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'ditolak', label: 'Ditolak' },
  ];

  const columns = [
    {
        header: 'Aksi',
        accessor: (row: PengajuanPengangkutan) => (
          <div className="flex items-center gap-1">
            <Link href={`/admin/pengajuan/${row.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Eye className="h-4 w-4" />
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
                  <Link href={`/admin/pengajuan/${row.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Detail Lengkap
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewMap(row)} disabled={!row.latitude || !row.longitude}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Lihat Peta
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Cetak Laporan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <XCircle className="mr-2 h-4 w-4" />
                  Batalkan Pengajuan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    {
      header: 'Pengajuan',
      accessor: (row: PengajuanPengangkutan) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {row.user?.name?.charAt(0) || row.nama_pemohon?.charAt(0) || 'P'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold truncate">
                {row.user?.name || row.nama_pemohon || 'Anonim'}
              </p>
              {row.user_id ? (
                <Badge variant="outline" className="text-xs">Terdaftar</Badge>
              ) : (
                <Badge variant="outline" className="text-xs bg-amber-50">Tamu</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {row.user?.email || row.email ? (
                <Mail className="h-3 w-3" />
              ) : null}
              <span className="truncate">{row.user?.email || row.email || '-'}</span>
            </div>
            {row.no_telepon && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Phone className="h-3 w-3" />
                <span>{row.no_telepon}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Lokasi',
      accessor: (row: PengajuanPengangkutan) => (
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <Home className="h-4 w-4 text-gray-400 mt-0.5" />
            <p className="text-sm line-clamp-2">{row.alamat_lengkap}</p>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              {row.wilayah?.nama_wilayah || 'Tidak ada wilayah'}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Detail',
      accessor: (row: PengajuanPengangkutan) => (
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500">Estimasi Volume</p>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ 
                    width: `${Math.min(Number(row.estimasi_volume || 0) * 10, 100)}%` 
                  }} 
                />
              </div>
              <span className="font-bold text-sm">{row.estimasi_volume || '0'} m³</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Tanggal</p>
              <p className="text-sm font-medium">
                {new Date(row.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
            </div>
            {row.latitude && row.longitude && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewMap(row);
                }}
                className="h-7 px-2"
              >
                <MapPin className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row: PengajuanPengangkutan) => {
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
                {new Date(row.created_at).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
        );
      },
    },
    
  ];

  const getStatusCount = (status: string) => {
    return pengajuan.data.filter(p => p.status === status).length;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manajemen Pengajuan" />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header Section */}
        <div className="border-b bg-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="h-8 w-8 text-blue-500" />
                  Manajemen Pengajuan
                </h1>
                <p className="text-gray-600 mt-1">
                  Kelola pengajuan pengangkutan sampah dari warga
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
                
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Plus className="mr-2 h-4 w-4" />
                  Pengajuan Baru
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card className="border-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={100} className="h-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Diajukan</p>
                    <h3 className="text-2xl font-bold mt-1">{stats.diajukan}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
                <div className="mt-3">
                  <Progress 
                    value={(stats.diajukan / stats.total) * 100} 
                    className="h-1 bg-blue-100" 
                    
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Diverifikasi</p>
                    <h3 className="text-2xl font-bold mt-1">{stats.diverifikasi}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="mt-3">
                  <Progress 
                    value={(stats.diverifikasi / stats.total) * 100} 
                    className="h-1 bg-green-100" 
                    
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Dijadwalkan</p>
                    <h3 className="text-2xl font-bold mt-1">{stats.dijadwalkan}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
                <div className="mt-3">
                  <Progress 
                    value={(stats.dijadwalkan / stats.total) * 100} 
                    className="h-1 bg-purple-100" 
                    
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Selesai</p>
                    <h3 className="text-2xl font-bold mt-1">{stats.selesai}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
                <div className="mt-3">
                  <Progress 
                    value={(stats.selesai / stats.total) * 100} 
                    className="h-1 bg-emerald-100" 
                    
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="all">Semua ({stats.total})</TabsTrigger>
                  <TabsTrigger value="diajukan">Diajukan ({getStatusCount('diajukan')})</TabsTrigger>
                  <TabsTrigger value="diverifikasi">Diverifikasi ({getStatusCount('diverifikasi')})</TabsTrigger>
                  <TabsTrigger value="dijadwalkan">Dijadwalkan ({getStatusCount('dijadwalkan')})</TabsTrigger>
                  <TabsTrigger value="diangkut">Diangkut ({getStatusCount('diangkut')})</TabsTrigger>
                  <TabsTrigger value="selesai">Selesai ({getStatusCount('selesai')})</TabsTrigger>
                  <TabsTrigger value="ditolak">Ditolak ({getStatusCount('ditolak')})</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari nama, alamat, email, atau telepon..."
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
                      <SelectValue placeholder="Status" />
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

                  <Select value={selectedWilayah} onValueChange={setSelectedWilayah}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Semua Wilayah" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Wilayah</SelectItem>
                      {wilayah.map((w) => (
                        <SelectItem key={w.id} value={w.id.toString()}>
                          {w.nama_wilayah}
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
                <div className="text-sm text-gray-600">
                  {pengajuan.total} pengajuan ditemukan
                </div>
                
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="mr-2 h-4 w-4" />
                        Aksi Massal
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleBulkAction('verify')}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verifikasi Terpilih
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction('schedule')}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Jadwalkan Terpilih
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Terpilih
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Tabel
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Layers className="mr-2 h-4 w-4" />
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Daftar Pengajuan</CardTitle>
                    <CardDescription>
                      Menampilkan {pengajuan.data.length} dari {pengajuan.total} pengajuan
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analytics
                  </Button>
                </div>
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
                      {pengajuan.data.length === 0 ? (
                        <tr>
                          <td colSpan={columns.length} className="py-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <Layers className="h-12 w-12 text-gray-300 mb-4" />
                              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                Tidak ada pengajuan ditemukan
                              </h3>
                              <p className="text-gray-500 mb-4">
                                {searchTerm || selectedStatus !== 'all' || selectedWilayah !== 'all'
                                  ? 'Coba ubah filter pencarian'
                                  : 'Belum ada pengajuan yang dibuat'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        pengajuan.data.map((row) => (
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
              
              {pengajuan.data.length > 0 && (
                <CardFooter className="flex items-center justify-between border-t">
                  <div className="text-sm text-gray-600">
                    Halaman {pengajuan.current_page} dari {pengajuan.last_page}
                  </div>
                  <div className="flex items-center gap-2">
                    {pengajuan.links.map((link, index) => (
                      link.url ? (
                        <Button
                          key={index}
                          variant={link.active ? "default" : "outline"}
                          size="sm"
                          onClick={() => router.visit(link.url!)}
                          className={link.label.includes('Next') || link.label.includes('Previous') ? 'px-3' : 'w-8'}
                        >
                          {link.label.includes('Next') ? '→' : 
                           link.label.includes('Previous') ? '←' : 
                           <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                        </Button>
                      ) : null
                    ))}
                  </div>
                </CardFooter>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pengajuan.data.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">
                    <Layers className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Tidak ada pengajuan ditemukan
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || selectedStatus !== 'all' || selectedWilayah !== 'all'
                        ? 'Coba ubah filter pencarian'
                        : 'Belum ada pengajuan yang dibuat'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pengajuan.data.map((row) => (
                  <Card key={row.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {row.user?.name?.charAt(0) || row.nama_pemohon?.charAt(0) || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{row.user?.name || row.nama_pemohon || 'Anonim'}</CardTitle>
                            <CardDescription className="text-xs">
                              {row.user?.email || row.email || '-'}
                            </CardDescription>
                          </div>
                        </div>
                        <StatusBadge status={row.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Home className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">Alamat:</span>
                        </div>
                        <p className="text-sm text-gray-600 pl-6 line-clamp-2">{row.alamat_lengkap}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Wilayah</p>
                          <p className="text-sm font-medium">{row.wilayah?.nama_wilayah || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Volume</p>
                          <p className="text-sm font-medium">{row.estimasi_volume || '0'} m³</p>
                        </div>
                      </div>

                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {new Date(row.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="flex gap-1">
                          {row.latitude && row.longitude && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewMap(row);
                              }}
                              className="h-7 px-2"
                            >
                              <MapPin className="h-3 w-3" />
                            </Button>
                          )}
                          <Link href={`/admin/pengajuan/${row.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </Link>
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

      {/* Map Dialog */}
      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Lokasi Pengajuan
            </DialogTitle>
            <DialogDescription>
              {selectedMapLocation?.address}
            </DialogDescription>
          </DialogHeader>
          {selectedMapLocation && (
            <div className="space-y-4">
              <div className="h-[400px] w-full overflow-hidden rounded-lg border">
                <MapViewer
                  latitude={selectedMapLocation.latitude}
                  longitude={selectedMapLocation.longitude}
                  height="400px"
                  markers={[
                    {
                      lat: selectedMapLocation.latitude,
                      lng: selectedMapLocation.longitude,
                      title: selectedMapLocation.address,
                    },
                  ]}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Koordinat: {selectedMapLocation.latitude}, {selectedMapLocation.longitude}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedMapLocation.latitude},${selectedMapLocation.longitude}`, '_blank')} size="sm">
                    <ExternalLink  className="mr-2 h-4 w-4" />
                    Buka di Google Maps
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowMapDialog(false)}>
                    Tutup
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}