import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, Image as ImageIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { StatusTimeline } from '@/components/status-timeline';
import { MapViewer } from '@/components/map/MapViewer';
import type { BreadcrumbItem } from '@/types';
import type { Aduan } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Aduan',
        href: '/warga/aduan',
    },
    {
        title: 'Detail',
        href: '#',
    },
];

interface Props {
    aduan: Aduan & {
        riwayat_status?: Array<{
            id: number;
            status: string;
            keterangan: string | null;
            changed_by: number;
            created_at: string;
            changed_by_user?: { name: string };
        }>;
        lampiran?: Array<{ id: number; file_path: string }>;
    };
}

export default function AduanShow({ aduan }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Aduan - ${aduan.kategori}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Link href="/warga/aduan">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                </Link>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Aduan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Kategori</p>
                                <p className="text-base">{aduan.kategori}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Deskripsi</p>
                                <p className="text-base whitespace-pre-wrap">{aduan.deskripsi}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <StatusBadge status={aduan.status} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Tanggal Dibuat</p>
                                <p className="text-base">
                                    {new Date(aduan.created_at).toLocaleString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {aduan.latitude && aduan.longitude && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Lokasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <MapViewer
                                    latitude={aduan.latitude}
                                    longitude={aduan.longitude}
                                    height="300px"
                                />
                            </CardContent>
                        </Card>
                    )}

                    {aduan.foto_bukti && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" />
                                    Foto Bukti
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <img
                                    src={`/storage/${aduan.foto_bukti}`}
                                    alt="Foto Bukti"
                                    className="w-full rounded-lg"
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>

                {aduan.riwayat_status && aduan.riwayat_status.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StatusTimeline
                                riwayat={aduan.riwayat_status.map((r) => ({
                                    id: r.id,
                                    ref_type: 'aduan' as const,
                                    ref_id: aduan.id,
                                    status: r.status,
                                    keterangan: r.keterangan,
                                    changed_by: r.changed_by,
                                    created_at: r.created_at,
                                    updated_at: r.created_at,
                                    changed_by_user: r.changed_by_user,
                                }))}
                            />
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
