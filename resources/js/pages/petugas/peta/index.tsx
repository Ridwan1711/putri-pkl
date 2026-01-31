import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MapViewer } from '@/components/map/MapViewer';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Peta Lokasi Pengajuan', href: '/petugas/peta' },
];

const STATUS_LEGEND = [
    { status: 'diajukan', label: 'Menunggu Konfirmasi', color: 'bg-gray-500' },
    { status: 'diverifikasi', label: 'Menunggu Konfirmasi', color: 'bg-gray-500' },
    { status: 'dijadwalkan', label: 'Sedang Diproses', color: 'bg-blue-500' },
    { status: 'diangkut', label: 'Dalam Perjalanan', color: 'bg-yellow-500' },
    { status: 'selesai', label: 'Selesai', color: 'bg-green-500' },
    { status: 'ditolak', label: 'Gagal', color: 'bg-red-500' },
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
}

export default function PetaIndex({ markers, routePoints = [], total }: Props) {
    const mapMarkers = markers.map((m) => ({
        lat: m.lat,
        lng: m.lng,
        title: `${m.alamat} (${m.status})`,
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Peta Lokasi Pengangkutan" />
            <div className="flex h-full flex-1 flex-col gap-4">
                <h1 className="text-2xl font-bold text-green-700">Peta Lokasi Pengangkutan</h1>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-wrap gap-4">
                        {STATUS_LEGEND.map((item) => (
                            <div key={item.status} className="flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full ${item.color}`} title={item.label} />
                                <span className="text-sm">{item.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="rounded-lg bg-green-600 px-4 py-2 text-white">Jumlah: {total}</div>
                </div>

                <div className="min-h-[500px] flex-1">
                    <MapViewer markers={mapMarkers} routePoints={routePoints} height="500px" />
                </div>
            </div>
        </AppLayout>
    );
}
