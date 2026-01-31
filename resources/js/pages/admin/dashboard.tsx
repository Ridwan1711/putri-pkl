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

export default function AdminDashboard({ stats }: { stats: Stats }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('monthly');
  const [showExportDialog, setShowExportDialog] = useState(false);

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
              
              <div className="flex flex-wrap gap-2">
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
            <TabsList className="grid w-full grid-cols-4">
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

            {/* Bakal Datang : Analitika Pengajuan */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="w-full h-full mt-35 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">Analitika Pengajuan</p>
                  <p className="text-sm text-gray-500">Coming soon</p>
                </div>
              </div>
            </TabsContent>
            {/* Bakal Datang : Laporan */}
            <TabsContent value="reports" className="space-y-6">
              <div className="w-full h-full mt-35 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">Laporan atau Ringkasan Untuk dicetak</p>
                  <p className="text-sm text-gray-500">Coming soon</p>
                </div>
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