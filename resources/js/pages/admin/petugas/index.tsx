import { Head, Link, router } from '@inertiajs/react';
import { 
  Plus, Pencil, Trash2, Eye, Filter, Search, 
  User, Truck, MapPin, CheckCircle, XCircle,
  MoreVertical, Download, RefreshCw, Shield,
  BarChart3, Calendar, Users, SortAsc
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'react-hot-toast';
import type { BreadcrumbItem } from '@/types';
import type { Petugas, Wilayah } from '@/types/models';
import { Switch } from '@/components/ui/switch';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
  },
  {
    title: 'Petugas',
    href: '/admin/petugas',
  },
];

interface Props {
  petugas: {
    data: Petugas[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
  };
  wilayah: Wilayah[];
  filters: {
    search?: string;
    wilayah_id?: string;
  };
}

export default function PetugasIndex({ petugas, wilayah, filters }: Props) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedWilayah, setSelectedWilayah] = useState(filters.wilayah_id || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [showStats, setShowStats] = useState(true);

  const handleDelete = (id: number) => {
    router.delete(`/admin/petugas/${id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteId(null);
        toast.success('Petugas berhasil dihapus');
      },
      onError: () => {
        toast.error('Gagal menghapus petugas');
      },
    });
  };

  const handleFilter = () => {
    const params: any = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedWilayah && selectedWilayah !== 'all') params.wilayah_id = selectedWilayah;
    
    router.visit('/admin/petugas', {
      data: params,
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedWilayah('all');
    router.visit('/admin/petugas', {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const toggleAvailability = (petugas: Petugas) => {
    router.patch(`/admin/petugas/${petugas.id}/toggle-availability`, {
      is_available: !petugas.is_available,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(`Status ketersediaan berhasil diubah`);
      },
    });
  };

  // Calculate stats
  const stats = {
    total: petugas.total,
    available: petugas.data.filter(p => p.is_available).length,
    unavailable: petugas.data.filter(p => !p.is_available).length,
    withArmada: petugas.data.filter(p => p.armada_id).length,
  };

  const columns = [
    {
      header: 'Petugas',
      accessor: (row: Petugas) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {row.user?.name?.charAt(0) || 'P'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{row.user?.name || '-'}</p>
            <p className="text-sm text-gray-500">{row.user?.email || '-'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Armada',
      accessor: (row: Petugas) => (
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-gray-400" />
          <span>{row.armada?.kode_armada || '-'}</span>
          {row.armada && (
            <Badge variant="outline" className="ml-2 text-xs">
              {row.armada.jenis_kendaraan}
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Wilayah',
      accessor: (row: Petugas) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{row.wilayah?.nama_wilayah || '-'}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row: Petugas) => (
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className={`h-2 w-2 rounded-full ${row.is_available ? 'bg-green-500' : 'bg-gray-400'}`}>
              <div className={`absolute inset-0 ${row.is_available ? 'animate-ping bg-green-500' : ''} rounded-full`}></div>
            </div>
          </div>
          <Badge variant={row.is_available ? "default" : "outline"}>
            {row.is_available ? 'Tersedia' : 'Tidak Tersedia'}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Aksi',
      accessor: (row: Petugas) => (
        <div className="flex items-center gap-1">
          <Link href={`/admin/petugas/${row.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/admin/petugas/${row.id}/edit`}>
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
              <DropdownMenuItem onClick={() => toggleAvailability(row)}>
                {row.is_available ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Tandai Tidak Tersedia
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Tandai Tersedia
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                Lihat Jadwal
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => setDeleteId(row.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Petugas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manajemen Petugas" />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header Section */}
        <div className="border-b bg-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="h-8 w-8 text-blue-500" />
                  Manajemen Petugas
                </h1>
                <p className="text-gray-600 mt-1">
                  Kelola data petugas dan penugasan sampah
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
                
                <Link href="/admin/petugas/create">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Petugas
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Petugas</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tersedia</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.available}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={(stats.available / stats.total) * 100} className="h-2 bg-green-100" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tidak Tersedia</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.unavailable}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <XCircle className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={(stats.unavailable / stats.total) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Memiliki Armada</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.withArmada}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Truck className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={(stats.withArmada / stats.total) * 100} className="h-2 bg-purple-100" />
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
                      placeholder="Cari nama petugas, email, atau armada..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
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
                <div className="flex items-center gap-4">
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
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    <SortAsc className="mr-2 h-4 w-4" />
                    Tabel
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Grid
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          {viewMode === 'table' ? (
            <Card>
              <CardHeader>
                <CardTitle>Daftar Petugas</CardTitle>
                <CardDescription>
                  {petugas.total} petugas ditemukan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        {columns.map((column, index) => (
                          <th key={index} className="text-left py-3 px-4 font-semibold text-gray-700">
                            {column.header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {petugas.data.length === 0 ? (
                        <tr>
                          <td colSpan={columns.length} className="py-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <Users className="h-12 w-12 text-gray-300 mb-4" />
                              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                Tidak ada petugas ditemukan
                              </h3>
                              <p className="text-gray-500 mb-4">
                                {searchTerm || selectedWilayah !== 'all' 
                                  ? 'Coba ubah filter pencarian'
                                  : 'Mulai dengan menambahkan petugas baru'}
                              </p>
                              <Link href="/admin/petugas/create">
                                <Button>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Tambah Petugas
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        petugas.data.map((row) => (
                          <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
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
              
              {petugas.data.length > 0 && (
                <CardFooter className="flex items-center justify-between border-t">
                  <div className="text-sm text-gray-600">
                    Menampilkan {petugas.data.length} dari {petugas.total} petugas
                  </div>
                  <div className="flex items-center gap-2">
                    {petugas.links.map((link, index) => (
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
              {petugas.data.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">
                    <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Tidak ada petugas ditemukan
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || selectedWilayah !== 'all' 
                        ? 'Coba ubah filter pencarian'
                        : 'Mulai dengan menambahkan petugas baru'}
                    </p>
                    <Link href="/admin/petugas/create">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Petugas
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                petugas.data.map((row) => (
                  <Card key={row.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {row.user?.name?.charAt(0) || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{row.user?.name || '-'}</CardTitle>
                            <CardDescription>{row.user?.email || '-'}</CardDescription>
                          </div>
                        </div>
                        <Badge variant={row.is_available ? "default" : "outline"}>
                          {row.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          <strong>Armada:</strong> {row.armada?.kode_armada || 'Tidak ada'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          <strong>Wilayah:</strong> {row.wilayah?.nama_wilayah || 'Tidak ada'}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Terdaftar: {new Date(row.created_at).toLocaleDateString('id-ID')}
                        </span>
                        <Button
                          size="sm"
                          variant={row.is_available ? "outline" : "default"}
                          onClick={() => toggleAvailability(row)}
                        >
                          {row.is_available ? 'Nonaktifkan' : 'Aktifkan'}
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <div className="flex w-full justify-between">
                        <Link href={`/admin/petugas/${row.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Detail
                          </Button>
                        </Link>
                        <Link href={`/admin/petugas/${row.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
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
                    </CardFooter>
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
        title="Hapus Petugas"
        description="Apakah Anda yakin ingin menghapus petugas ini? Data yang telah dihapus tidak dapat dikembalikan."
        confirmText="Hapus"
        cancelText="Batal"
        variant="destructive"
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </AppLayout>
  );
}