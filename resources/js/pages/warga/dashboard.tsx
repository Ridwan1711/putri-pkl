import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { PengajuanPengangkutan, Aduan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '#',
    },
];

interface Stats {
    total_pengajuan: number;
    pengajuan_selesai: number;
    total_aduan: number;
    aduan_selesai: number;
}

export default function WargaDashboard({
    pengajuan_terbaru,
    aduan_terbaru,
    stats,
}: {
    pengajuan_terbaru: PengajuanPengangkutan[];
    aduan_terbaru: Aduan[];
    stats: Stats;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Warga" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Pengajuan</h3>
                        <p className="text-2xl font-bold">{stats.total_pengajuan}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Pengajuan Selesai</h3>
                        <p className="text-2xl font-bold">{stats.pengajuan_selesai}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Aduan</h3>
                        <p className="text-2xl font-bold">{stats.total_aduan}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Aduan Selesai</h3>
                        <p className="text-2xl font-bold">{stats.aduan_selesai}</p>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-4 text-lg font-semibold">Pengajuan Terbaru</h2>
                        <div className="space-y-2">
                            {pengajuan_terbaru.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Tidak ada pengajuan</p>
                            ) : (
                                pengajuan_terbaru.map((p) => (
                                    <div key={p.id} className="rounded border p-2">
                                        <p className="font-medium">{p.alamat_lengkap}</p>
                                        <p className="text-sm text-muted-foreground">Status: {p.status}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-4 text-lg font-semibold">Aduan Terbaru</h2>
                        <div className="space-y-2">
                            {aduan_terbaru.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Tidak ada aduan</p>
                            ) : (
                                aduan_terbaru.map((a) => (
                                    <div key={a.id} className="rounded border p-2">
                                        <p className="font-medium">{a.kategori}</p>
                                        <p className="text-sm text-muted-foreground">Status: {a.status}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
