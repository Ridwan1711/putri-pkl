import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '#',
    },
];

interface Stats {
    total_wilayah: number;
    total_armada: number;
    total_petugas: number;
    pengajuan_diajukan: number;
    pengajuan_dijadwalkan: number;
    pengajuan_selesai: number;
}

export default function AdminDashboard({ stats }: { stats: Stats }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Dashboard Admin</h1>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Wilayah</h3>
                        <p className="text-2xl font-bold">{stats.total_wilayah}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Armada</h3>
                        <p className="text-2xl font-bold">{stats.total_armada}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Petugas</h3>
                        <p className="text-2xl font-bold">{stats.total_petugas}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Pengajuan Diajukan</h3>
                        <p className="text-2xl font-bold">{stats.pengajuan_diajukan}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Pengajuan Dijadwalkan</h3>
                        <p className="text-2xl font-bold">{stats.pengajuan_dijadwalkan}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Pengajuan Selesai</h3>
                        <p className="text-2xl font-bold">{stats.pengajuan_selesai}</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
