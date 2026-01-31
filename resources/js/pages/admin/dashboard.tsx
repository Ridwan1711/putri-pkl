import { Head } from '@inertiajs/react';
import {
  FileText, MapPin, Users, Trash2, MapPinCheck,
  UserCheck, BarChart3, Truck, Home, Calendar,
  TrendingUp, TrendingDown, CheckCircle, Clock,
  AlertCircle, Package, Filter, Download, Settings,
  RefreshCw, Eye, ArrowUpRight, ArrowDownRight,
  Activity, DollarSign, Target, Shield, Globe,
  ChevronRight, MoreVertical, Star, Zap
} from 'lucide-react';
import {
  Bar, BarChart, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
  Area, AreaChart, CartesianGrid, Line, LineChart
} from 'recharts';
import AppLayout from '@/layouts/app-layout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '#',
  },
];

interface Performa {
  menunggu: number;
  diproses: number;
  dalam_perjalanan: number;
  selesai: number;
  gagal: number;
}

interface StatistikBulanan {
  bulan: string;
  label: string;
  total: number;
  target: number;
}

interface GrafikStatusArmada {
  aktif: number;
  perbaikan: number;
  nonaktif: number;
}

interface Analytics {
  pengajuan_per_wilayah: Array<{ wilayah: string; total: number }>;
  pengajuan_per_hari: Array<{ hari: string; total: number }>;
  pengajuan_7_hari_terakhir: Array<{ tanggal: string; label: string; total: number }>;
  sumber_pengajuan: { guest: number; terdaftar: number };
  petugas_terproduktif: Array<{ nama: string; total: number }>;
  top_kampung: Array<{ kampung: string; total: number }>;
}

interface ReportWilayah {
  nama: string;
  kecamatan: string;
  total_pengajuan: number;
  is_active: boolean;
}

interface ReportPengajuan {
  id: number;
  nama_pemohon: string;
  alamat: string;
  wilayah: string;
  kampung: string;
  status: string;
  created_at: string;
}

interface Reports {
  ringkasan: {
    total_pengajuan: number;
    selesai: number;
    ditolak: number;
    sampah_kg: number;
    sampah_ton: number;
    tanggal_cetak: string;
  };
  per_wilayah: ReportWilayah[];
  pengajuan_terbaru: ReportPengajuan[];
}

interface Stats {
  total_pengajuan: number;
  wilayah_aktif: number;
  wilayah_tidak_aktif: number;
  petugas_aktif: number;
  petugas_tidak_aktif: number;
  sampah_terkumpul_ton: number;
  pengangkutan_terbanyak_desa: string;
  performa: Performa;
  statistik_bulanan: StatistikBulanan[];
  grafik_status_armada: GrafikStatusArmada;
  pengajuan_minggu_ini: number;
  pengajuan_minggu_lalu: number;
  pertumbuhan: number;
  rating_kepuasan: number;
  analytics: Analytics;
  reports: Reports;
}

const CHART_COLORS = {
  primary: 'hsl(221.2 83.2% 53.3%)',
  success: 'hsl(142.1 76.2% 36.3%)',
  warning: 'hsl(32.1 94.6% 43.7%)',
  danger: 'hsl(0 84.2% 60.2%)',
  info: 'hsl(221.2 83.2% 53.3%)',
  purple: 'hsl(262.1 83.3% 57.8%)',
  gray: 'hsl(215.4 16.3% 46.9%)',
};

const PERFORMANCE_COLORS = {
  menunggu: 'hsl(215.4 16.3% 46.9%)',
  diproses: 'hsl(32.1 94.6% 43.7%)',
  dalam_perjalanan: 'hsl(221.2 83.2% 53.3%)',
  selesai: 'hsl(142.1 76.2% 36.3%)',
  gagal: 'hsl(0 84.2% 60.2%)',
};

const ARMADA_COLORS = {
  aktif: 'hsl(142.1 76.2% 36.3%)',
  perbaikan: 'hsl(32.1 94.6% 43.7%)',
  nonaktif: 'hsl(0 84.2% 60.2%)',
};

const defaultAnalytics: Analytics = {
  pengajuan_per_wilayah: [],
  pengajuan_per_hari: [],
  pengajuan_7_hari_terakhir: [],
  sumber_pengajuan: { guest: 0, terdaftar: 0 },
  petugas_terproduktif: [],
  top_kampung: [],
};

const defaultReports: Reports = {
  ringkasan: { total_pengajuan: 0, selesai: 0, ditolak: 0, sampah_kg: 0, sampah_ton: 0, tanggal_cetak: '' },
  per_wilayah: [],
  pengajuan_terbaru: [],
};

export default function AdminDashboard({ stats }: { stats: Stats }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('monthly');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const analytics = stats.analytics ?? defaultAnalytics;
  const reports = stats.reports ?? defaultReports;

  const armadaChartData = [
    { name: 'Aktif', value: stats.grafik_status_armada.aktif, color: ARMADA_COLORS.aktif },
    { name: 'Perbaikan', value: stats.grafik_status_armada.perbaikan, color: ARMADA_COLORS.perbaikan },
    { name: 'Nonaktif', value: stats.grafik_status_armada.nonaktif, color: ARMADA_COLORS.nonaktif },
  ].filter((d) => d.value > 0);

  const performanceData = [
    { name: 'Menunggu', value: stats.performa.menunggu, icon: Clock, color: PERFORMANCE_COLORS.menunggu },
    { name: 'Diproses', value: stats.performa.diproses, icon: Activity, color: PERFORMANCE_COLORS.diproses },
    { name: 'Dalam Perjalanan', value: stats.performa.dalam_perjalanan, icon: Truck, color: PERFORMANCE_COLORS.dalam_perjalanan },
    { name: 'Selesai', value: stats.performa.selesai, icon: CheckCircle, color: PERFORMANCE_COLORS.selesai },
    { name: 'Gagal', value: stats.performa.gagal, icon: AlertCircle, color: PERFORMANCE_COLORS.gagal },
  ];

  const statistikBulananData = stats.statistik_bulanan.map(item => ({
    ...item,
    fill: CHART_COLORS.primary,
    targetColor: CHART_COLORS.gray,
  }));

  // Calculate totals for overview
  const totalWilayah = stats.wilayah_aktif + stats.wilayah_tidak_aktif;
  const totalPetugas = stats.petugas_aktif + stats.petugas_tidak_aktif;
  const completionRate = stats.performa.selesai / Math.max(stats.total_pengajuan, 1) * 100;

  const growthPercentage = stats.pertumbuhan || 0;
  const isGrowthPositive = growthPercentage >= 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Admin Dashboard" />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <div className="border-b bg-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Home className="h-8 w-8 text-blue-500" />
                  Dashboard Admin
                </h1>
                <p className="text-gray-600 mt-1">
                  Overview sistem manajemen pengangkutan sampah
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 print:hidden">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hari Ini</SelectItem>
                    <SelectItem value="weekly">Minggu Ini</SelectItem>
                    <SelectItem value="monthly">Bulan Ini</SelectItem>
                    <SelectItem value="quarterly">Kuartal Ini</SelectItem>
                    <SelectItem value="yearly">Tahun Ini</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={() => setShowExportDialog(true)}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>

                <Button>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 print:hidden">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Performa
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Pengajuan</p>
                        <h3 className="text-2xl font-bold mt-1">{stats.total_pengajuan.toLocaleString()}</h3>
                        <div className="flex items-center gap-1 mt-2">
                          {isGrowthPositive ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          )}
                          <span className={`text-sm font-medium ${isGrowthPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.abs(growthPercentage)}% dari minggu lalu
                          </span>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={completionRate} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Completion Rate</span>
                        <span>{completionRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Sampah Terkumpul</p>
                        <h3 className="text-2xl font-bold mt-1">
                          {stats.sampah_terkumpul_ton.toLocaleString('id-ID')} Ton
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                          ≈ {(stats.sampah_terkumpul_ton * 1000).toLocaleString()} Kg
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Package className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Badge variant="outline" className="gap-1">
                        <Target className="h-3 w-3" />
                        Target: {(stats.sampah_terkumpul_ton * 1.2).toFixed(1)} Ton
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Wilayah Aktif</p>
                        <h3 className="text-2xl font-bold mt-1">{stats.wilayah_aktif}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 rounded-full" 
                              style={{ width: `${(stats.wilayah_aktif / Math.max(totalWilayah, 1)) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{totalWilayah} total</span>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Globe className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Rating Kepuasan</p>
                        <div className="flex items-center gap-2 mt-1">
                          <h3 className="text-2xl font-bold">{stats.rating_kepuasan || 4.5}</h3>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-4 w-4 ${star <= Math.floor(stats.rating_kepuasan || 4.5) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Berdasarkan feedback warga</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <Star className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Overview */}
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      Statistik Pengajuan Bulanan
                    </CardTitle>
                    <CardDescription>
                      Trend pengajuan bulanan dengan target pencapaian
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statistikBulananData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="label" 
                            tick={{ fontSize: 11 }}
                            stroke="hsl(var(--muted-foreground))"
                          />
                          <YAxis 
                            tick={{ fontSize: 11 }}
                            stroke="hsl(var(--muted-foreground))"
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px'
                            }}
                          />
                          <Legend />
                          <Bar 
                            dataKey="total" 
                            name="Aktual" 
                            fill={CHART_COLORS.primary} 
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                          />
                          <Bar 
                            dataKey="target" 
                            name="Target" 
                            fill={CHART_COLORS.gray} 
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-500" />
                      Status Petugas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <UserCheck className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Petugas Aktif</p>
                            <p className="text-sm text-gray-500">Siap bertugas</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{stats.petugas_aktif}</p>
                          <Badge variant="default">✓ Online</Badge>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">Petugas Tidak Aktif</p>
                            <p className="text-sm text-gray-500">Libur/cuti</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{stats.petugas_tidak_aktif}</p>
                          <Badge variant="secondary">✗ Offline</Badge>
                        </div>
                      </div>

                      <div className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Rasio Aktif</span>
                          <span className="text-sm font-bold">
                            {((stats.petugas_aktif / Math.max(totalPetugas, 1)) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={(stats.petugas_aktif / Math.max(totalPetugas, 1)) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Row */}
              <div className="grid gap-6 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-orange-500" />
                      Status Armada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      {armadaChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={armadaChartData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={60}
                              paddingAngle={5}
                              labelLine={false}
                            >
                              {armadaChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend 
                              verticalAlign="bottom"
                              height={36}
                              formatter={(value) => <span className="text-xs">{value}</span>}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center">
                          <Truck className="h-12 w-12 text-gray-300 mb-3" />
                          <p className="text-gray-500">Tidak ada data armada</p>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {armadaChartData.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="text-lg font-bold">{item.value}</div>
                          <div className="text-xs text-gray-500">{item.name}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPinCheck className="h-5 w-5 text-purple-500" />
                      Top Performance
                    </CardTitle>
                    <CardDescription>
                      Desa dengan pengangkutan terbanyak
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-white rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-purple-600 font-bold">1</span>
                          </div>
                          <div>
                            <p className="font-bold">{stats.pengangkutan_terbanyak_desa}</p>
                            <p className="text-sm text-gray-500">Pengangkutan Terbanyak</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="gap-1">
                          <Zap className="h-3 w-3" />
                          Top 1
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Wilayah Aktif</span>
                          <span className="text-sm font-bold">{stats.wilayah_aktif}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Wilayah Tidak Aktif</span>
                          <span className="text-sm font-bold">{stats.wilayah_tidak_aktif}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Wilayah</span>
                          <span className="text-sm font-bold">{totalWilayah}</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Rasio Aktif Wilayah</span>
                          <span className="text-sm font-bold">
                            {((stats.wilayah_aktif / Math.max(totalWilayah, 1)) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={(stats.wilayah_aktif / Math.max(totalWilayah, 1)) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      Aktivitas Terbaru
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">Pengajuan baru diterima</p>
                          <p className="text-xs text-gray-500">2 menit yang lalu</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">Pengangkutan selesai</p>
                          <p className="text-xs text-gray-500">1 jam yang lalu</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Truck className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">Armada kembali ke depot</p>
                          <p className="text-xs text-gray-500">3 jam yang lalu</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">Petugas baru ditambahkan</p>
                          <p className="text-xs text-gray-500">5 jam yang lalu</p>
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

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Ringkasan Performa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {performanceData.map((item, index) => {
                        const Icon = item.icon;
                        const percentage = (item.value / Math.max(stats.total_pengajuan, 1)) * 100;
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: `${item.color}20` }}
                                >
                                  <Icon className="h-4 w-4" style={{ color: item.color }} />
                                </div>
                                <span className="font-medium">{item.name}</span>
                              </div>
                              <span className="font-bold">{item.value}</span>
                            </div>
                            <Progress value={percentage} className="h-2"  />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{percentage.toFixed(1)}% dari total</span>
                              <span>{item.value} pengajuan</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      Target Pencapaian
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Pengajuan Bulanan</span>
                          <Badge variant="outline">
                            {stats.statistik_bulanan.reduce((sum, item) => sum + item.total, 0)} / 500
                          </Badge>
                        </div>
                        <Progress 
                          value={(stats.statistik_bulanan.reduce((sum, item) => sum + item.total, 0) / 500) * 100} 
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Sampah Terangkut</span>
                          <Badge variant="outline">
                            {stats.sampah_terkumpul_ton} / 100 Ton
                          </Badge>
                        </div>
                        <Progress 
                          value={(stats.sampah_terkumpul_ton / 100) * 100} 
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Kepuasan Warga</span>
                          <Badge variant="outline">
                            {stats.rating_kepuasan || 4.5} / 5.0
                          </Badge>
                        </div>
                        <Progress 
                          value={((stats.rating_kepuasan || 4.5) / 5) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analitika Pengajuan */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      Pengajuan per Wilayah (Top 10)
                    </CardTitle>
                    <CardDescription>
                      Desa dengan jumlah pengajuan terbanyak
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      {analytics.pengajuan_per_wilayah.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={analytics.pengajuan_per_wilayah}
                            layout="vertical"
                            margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                            <YAxis
                              type="category"
                              dataKey="wilayah"
                              width={75}
                              tick={{ fontSize: 10 }}
                              stroke="hsl(var(--muted-foreground))"
                            />
                            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid hsl(var(--border))', borderRadius: '6px' }} />
                            <Bar dataKey="total" name="Pengajuan" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} maxBarSize={24} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-gray-500">
                          <BarChart3 className="h-12 w-12 mb-3 text-gray-300" />
                          <p>Belum ada data pengajuan per wilayah</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      Pengajuan 7 Hari Terakhir
                    </CardTitle>
                    <CardDescription>
                      Trend pengajuan harian
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      {analytics.pengajuan_7_hari_terakhir.some((d) => d.total > 0) ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analytics.pengajuan_7_hari_terakhir} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid hsl(var(--border))', borderRadius: '6px' }} />
                            <Area type="monotone" dataKey="total" name="Pengajuan" stroke={CHART_COLORS.primary} fillOpacity={1} fill="url(#colorTotal)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-gray-500">
                          <Activity className="h-12 w-12 mb-3 text-gray-300" />
                          <p>Tidak ada pengajuan 7 hari terakhir</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      Sumber Pengajuan
                    </CardTitle>
                    <CardDescription>
                      Guest vs Pengguna Terdaftar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      {(analytics.sumber_pengajuan.guest + analytics.sumber_pengajuan.terdaftar) > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Guest / Tanpa Login', value: analytics.sumber_pengajuan.guest, color: CHART_COLORS.warning },
                                { name: 'Pengguna Terdaftar', value: analytics.sumber_pengajuan.terdaftar, color: CHART_COLORS.success },
                              ].filter((d) => d.value > 0)}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={2}
                              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                            >
                              {[
                                { name: 'Guest', value: analytics.sumber_pengajuan.guest, color: CHART_COLORS.warning },
                                { name: 'Terdaftar', value: analytics.sumber_pengajuan.terdaftar, color: CHART_COLORS.success },
                              ]
                                .filter((d) => d.value > 0)
                                .map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-gray-500">
                          <UserCheck className="h-12 w-12 mb-3 text-gray-300" />
                          <p>Belum ada data sumber pengajuan</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-orange-500" />
                      Pengajuan per Hari dalam Minggu
                    </CardTitle>
                    <CardDescription>
                      Distribusi pengajuan berdasarkan hari
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      {analytics.pengajuan_per_hari.some((d) => d.total > 0) ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analytics.pengajuan_per_hari} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="hari" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid hsl(var(--border))', borderRadius: '6px' }} />
                            <Bar dataKey="total" name="Pengajuan" fill={CHART_COLORS.purple} radius={[4, 4, 0, 0]} maxBarSize={32} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-gray-500">
                          <Calendar className="h-12 w-12 mb-3 text-gray-300" />
                          <p>Belum ada data per hari</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-blue-500" />
                      Petugas Terproduktif (Top 5)
                    </CardTitle>
                    <CardDescription>
                      Petugas dengan penugasan terbanyak
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics.petugas_terproduktif.length > 0 ? (
                      <div className="space-y-3">
                        {analytics.petugas_terproduktif.map((p, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                                {i + 1}
                              </div>
                              <span className="font-medium">{p.nama}</span>
                            </div>
                            <Badge variant="secondary">{p.total} penugasan</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <Users className="h-12 w-12 mb-3 text-gray-300" />
                        <p>Belum ada data petugas</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-green-500" />
                      Top Kampung Pengajuan (Top 8)
                    </CardTitle>
                    <CardDescription>
                      Kampung dengan pengajuan terbanyak
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics.top_kampung.length > 0 ? (
                      <div className="space-y-2">
                        {analytics.top_kampung.map((k, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                            <span className="text-sm truncate">{k.kampung}</span>
                            <Badge variant="outline" className="shrink-0">{k.total}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <Home className="h-12 w-12 mb-3 text-gray-300" />
                        <p>Belum ada data kampung</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Laporan / Ringkasan untuk Dicetak */}
            <TabsContent value="reports" className="space-y-6">
              <div className="flex justify-end gap-2 mb-4 print:hidden">
                <Button variant="outline" onClick={() => window.print()}>
                  <Download className="mr-2 h-4 w-4" />
                  Cetak Laporan
                </Button>
              </div>
              <div className="print:bg-white">
                <Card className="print:shadow-none print:border">
                  <CardHeader className="print:pb-2">
                    <CardTitle className="text-xl">Ringkasan Eksekutif</CardTitle>
                    <CardDescription>Dicetak: {reports.ringkasan.tanggal_cetak}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-gray-500">Total Pengajuan</p>
                        <p className="text-2xl font-bold">{reports.ringkasan.total_pengajuan.toLocaleString()}</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-gray-500">Selesai</p>
                        <p className="text-2xl font-bold text-green-600">{reports.ringkasan.selesai.toLocaleString()}</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-gray-500">Ditolak</p>
                        <p className="text-2xl font-bold text-red-600">{reports.ringkasan.ditolak.toLocaleString()}</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-gray-500">Sampah Terkumpul</p>
                        <p className="text-2xl font-bold">{reports.ringkasan.sampah_ton} Ton</p>
                        <p className="text-xs text-gray-500">({reports.ringkasan.sampah_kg.toLocaleString()} Kg)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6 print:shadow-none print:border">
                  <CardHeader className="print:pb-2">
                    <CardTitle>Pengajuan per Wilayah</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reports.per_wilayah.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 font-medium">No</th>
                              <th className="text-left py-2 font-medium">Desa</th>
                              <th className="text-left py-2 font-medium">Kecamatan</th>
                              <th className="text-right py-2 font-medium">Total Pengajuan</th>
                              <th className="text-center py-2 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reports.per_wilayah.map((w, i) => (
                              <tr key={i} className="border-b">
                                <td className="py-2">{i + 1}</td>
                                <td className="py-2">{w.nama}</td>
                                <td className="py-2">{w.kecamatan}</td>
                                <td className="py-2 text-right">{w.total_pengajuan}</td>
                                <td className="py-2 text-center">
                                  <Badge variant={w.is_active ? 'default' : 'outline'}>
                                    {w.is_active ? 'Aktif' : 'Nonaktif'}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 py-4">Belum ada data wilayah</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="mt-6 print:shadow-none print:border">
                  <CardHeader className="print:pb-2">
                    <CardTitle>Pengajuan Terbaru (20 terakhir)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reports.pengajuan_terbaru.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 font-medium">#</th>
                              <th className="text-left py-2 font-medium">Pemohon</th>
                              <th className="text-left py-2 font-medium">Wilayah</th>
                              <th className="text-left py-2 font-medium">Kampung</th>
                              <th className="text-left py-2 font-medium">Status</th>
                              <th className="text-left py-2 font-medium">Tanggal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reports.pengajuan_terbaru.map((p, i) => (
                              <tr key={p.id} className="border-b">
                                <td className="py-2">{i + 1}</td>
                                <td className="py-2">{p.nama_pemohon}</td>
                                <td className="py-2">{p.wilayah}</td>
                                <td className="py-2">{p.kampung}</td>
                                <td className="py-2">
                                  <Badge variant={
                                    p.status === 'selesai' ? 'default' :
                                    p.status === 'ditolak' ? 'destructive' : 'secondary'
                                  }>
                                    {p.status}
                                  </Badge>
                                </td>
                                <td className="py-2">{p.created_at}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 py-4">Belum ada pengajuan</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
                    
      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Dashboard Data
            </DialogTitle>
            <DialogDescription>
              Pilih format dan periode untuk export data dashboard
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Format File</Label>
              <Select defaultValue="excel">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Periode Data</Label>
              <Select defaultValue={timeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="weekly">Minggu Ini</SelectItem>
                  <SelectItem value="monthly">Bulan Ini</SelectItem>
                  <SelectItem value="quarterly">Kuartal Ini</SelectItem>
                  <SelectItem value="yearly">Tahun Ini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={() => {
              setShowExportDialog(false);
              toast.success('Data sedang diproses untuk diunduh');
            }}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}