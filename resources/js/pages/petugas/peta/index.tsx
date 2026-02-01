import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Map, MapPin, ChevronDown, ChevronUp, Filter, RotateCcw } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapViewer } from '@/components/map/MapViewer';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/petugas/dashboard' },
    { title: 'Peta Lokasi', href: '/petugas/peta' },
];

const STATUS_LEGEND = [
    { status: 'diajukan', label: 'Diajukan', color: 'bg-gray-500', textColor: 'text-gray-500' },
    { status: 'diverifikasi', label: 'Diverifikasi', color: 'bg-blue-400', textColor: 'text-blue-400' },
    { status: 'dijadwalkan', label: 'Dijadwalkan', color: 'bg-purple-500', textColor: 'text-purple-500' },
    { status: 'diangkut', label: 'Diangkut', color: 'bg-orange-500', textColor: 'text-orange-500' },
    { status: 'selesai', label: 'Selesai', color: 'bg-green-500', textColor: 'text-green-500' },
    { status: 'ditolak', label: 'Ditolak', color: 'bg-red-500', textColor: 'text-red-500' },
];

interface MarkerItem {
    id: number;
    lat: number;
    lng: number;
    status: string;
    alamat: string;
}

interface RoutePoint {
    lat: number;
    lng: number;
}

interface Props {
    markers: MarkerItem[];
    routePoints?: RoutePoint[];
    total: number;
    filters?: {
        status?: string;
    };
}

export default function PetaIndex({ markers, routePoints = [], total, filters = {} }: Props) {
    const [showLegend, setShowLegend] = useState(true);

    const mapMarkers = markers.map((m) => ({
        lat: m.lat,
        lng: m.lng,
        title: `${m.alamat} (${m.status})`,
    }));

    // Count markers by status
    const statusCounts = markers.reduce((acc, m) => {
        acc[m.status] = (acc[m.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const applyFilters = (updates: Record<string, string | undefined>) => {
        router.get(
            '/petugas/peta',
            { ...filters, ...updates },
            { preserveState: true, preserveScroll: true }
        );
    };

    const hasActiveFilters = !!filters.status;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Peta Lokasi Pengangkutan" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                    <Map className="h-8 w-8" />
                                    Peta Lokasi Pengangkutan
                                </h1>
                                <p className="text-green-100 mt-1">
                                    Visualisasi lokasi pengajuan pengangkutan
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="bg-white/20 text-white border-0 text-lg px-4 py-2">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {total} Lokasi
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6 space-y-6">
                    <div className="grid gap-6 lg:grid-cols-4">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-4">
                            {/* Filter Card */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Filter className="h-5 w-5" />
                                        Filter
                                        {hasActiveFilters && (
                                            <Badge variant="secondary" className="ml-2">Aktif</Badge>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select
                                            value={filters.status || 'all'}
                                            onValueChange={(v) => applyFilters({ status: v === 'all' ? undefined : v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Semua Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Semua Status</SelectItem>
                                                {STATUS_LEGEND.map((item) => (
                                                    <SelectItem key={item.status} value={item.status}>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`h-3 w-3 rounded-full ${item.color}`} />
                                                            {item.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {hasActiveFilters && (
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => applyFilters({ status: undefined })}
                                        >
                                            <RotateCcw className="h-4 w-4 mr-2" />
                                            Reset Filter
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Legend Card */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <button
                                        onClick={() => setShowLegend(!showLegend)}
                                        className="flex items-center justify-between w-full"
                                    >
                                        <CardTitle className="text-lg">Legenda</CardTitle>
                                        {showLegend ? (
                                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </button>
                                </CardHeader>
                                {showLegend && (
                                    <CardContent className="pt-2">
                                        <div className="space-y-2">
                                            {STATUS_LEGEND.map((item) => (
                                                <div
                                                    key={item.status}
                                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-4 w-4 rounded-full ${item.color}`} />
                                                        <span className="text-sm">{item.label}</span>
                                                    </div>
                                                    <Badge variant="outline" className={`${item.textColor}`}>
                                                        {statusCounts[item.status] || 0}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                )}
                            </Card>

                            {/* Stats Summary */}
                            <Card className="bg-green-50 border-green-200">
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <p className="text-4xl font-bold text-green-600">{total}</p>
                                        <p className="text-sm text-green-700 mt-1">Total Lokasi</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Map Card */}
                        <div className="lg:col-span-3">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-green-600" />
                                        Peta Lokasi
                                    </CardTitle>
                                    <CardDescription>
                                        Klik marker untuk melihat detail lokasi
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-lg overflow-hidden border">
                                        <MapViewer
                                            markers={mapMarkers}
                                            routePoints={routePoints}
                                            height="600px"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Mobile Legend (visible on small screens) */}
                    <div className="lg:hidden">
                        <Card>
                            <CardHeader className="pb-2">
                                <button
                                    onClick={() => setShowLegend(!showLegend)}
                                    className="flex items-center justify-between w-full"
                                >
                                    <CardTitle className="text-lg">Legenda Status</CardTitle>
                                    {showLegend ? (
                                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </button>
                            </CardHeader>
                            {showLegend && (
                                <CardContent className="pt-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        {STATUS_LEGEND.map((item) => (
                                            <div
                                                key={item.status}
                                                className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
                                            >
                                                <div className={`h-3 w-3 rounded-full ${item.color}`} />
                                                <span className="text-sm">{item.label}</span>
                                                <Badge variant="outline" className="ml-auto text-xs">
                                                    {statusCounts[item.status] || 0}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
