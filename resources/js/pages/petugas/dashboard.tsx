import { Head, Link } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import type { BreadcrumbItem } from '@/types';
import type { Penugasan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/petugas/dashboard',
    },
];

interface Props {
    penugasan_hari_ini: Penugasan[];
    penugasan_mendatang: Penugasan[];
    stats: {
        total_penugasan_aktif: number;
        penugasan_selesai: number;
    };
}

export default function PetugasDashboard({ penugasan_hari_ini, penugasan_mendatang, stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Petugas" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <h3 className="text-sm font-medium text-muted-foreground">Penugasan Aktif</h3>
                        </div>
                        <p className="mt-2 text-2xl font-bold">{stats.total_penugasan_aktif}</p>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h3 className="text-sm font-medium text-muted-foreground">Penugasan Selesai</h3>
                        </div>
                        <p className="mt-2 text-2xl font-bold">{stats.penugasan_selesai}</p>
                    </Card>
                </div>

                <Card className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                            <Calendar className="h-5 w-5" />
                            Penugasan Hari Ini ({penugasan_hari_ini.length})
                        </h2>
                        <Link href="/petugas/penugasan">
                            <Button variant="outline" size="sm">
                                Lihat Semua
                            </Button>
                        </Link>
                    </div>
                    {penugasan_hari_ini.length > 0 ? (
                        <div className="space-y-3">
                            {penugasan_hari_ini.map((penugasan) => (
                                <Link
                                    key={penugasan.id}
                                    href={`/petugas/penugasan/${penugasan.id}`}
                                    className="block rounded-lg border p-4 transition-colors hover:bg-muted"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {penugasan.pengajuan_pengangkutan?.alamat_lengkap}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {penugasan.pengajuan_pengangkutan?.user?.name}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {new Date(penugasan.jadwal_angkut).toLocaleTimeString('id-ID', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                        <StatusBadge status={penugasan.status} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Tidak ada penugasan hari ini</p>
                    )}
                </Card>

                <Card className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                            <Calendar className="h-5 w-5" />
                            Penugasan Mendatang
                        </h2>
                        <Link href="/petugas/penugasan">
                            <Button variant="outline" size="sm">
                                Lihat Semua
                            </Button>
                        </Link>
                    </div>
                    {penugasan_mendatang.length > 0 ? (
                        <div className="space-y-3">
                            {penugasan_mendatang.map((penugasan) => (
                                <Link
                                    key={penugasan.id}
                                    href={`/petugas/penugasan/${penugasan.id}`}
                                    className="block rounded-lg border p-4 transition-colors hover:bg-muted"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {penugasan.pengajuan_pengangkutan?.alamat_lengkap}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {penugasan.pengajuan_pengangkutan?.user?.name}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {new Date(penugasan.jadwal_angkut).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                        <StatusBadge status={penugasan.status} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Tidak ada penugasan mendatang</p>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
