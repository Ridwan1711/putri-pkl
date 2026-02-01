import { Head, Link, router } from '@inertiajs/react';
import {
    Bell, Filter, RotateCcw, Check, CheckCheck,
    Clock, Mail, Eye
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';
import type { Notifikasi } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/warga/dashboard' },
    { title: 'Notifikasi', href: '/warga/notifikasi' },
];

interface Props {
    notifikasi: {
        data: Notifikasi[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        filter?: string;
    };
    stats: {
        total: number;
        unread: number;
        read: number;
    };
}

export default function WargaNotifikasiIndex({ notifikasi, filters, stats }: Props) {
    const applyFilters = (updates: Record<string, string | undefined>) => {
        router.get(
            '/warga/notifikasi',
            { ...filters, ...updates },
            { preserveState: true, preserveScroll: true }
        );
    };

    const markAsRead = (id: number) => {
        router.patch(`/warga/notifikasi/${id}/read`, {}, {
            preserveScroll: true,
        });
    };

    const markAllAsRead = () => {
        router.post('/warga/notifikasi/read-all', {}, {
            preserveScroll: true,
        });
    };

    const hasActiveFilters = !!filters.filter;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifikasi" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                    <Bell className="h-8 w-8" />
                                    Notifikasi
                                </h1>
                                <p className="text-green-100 mt-1">
                                    Pantau update status pengajuan dan aduan Anda
                                </p>
                            </div>
                            {stats.unread > 0 && (
                                <Button
                                    onClick={markAllAsRead}
                                    className="bg-white text-green-600 hover:bg-green-50"
                                >
                                    <CheckCheck className="h-4 w-4 mr-2" />
                                    Tandai Semua Dibaca
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="border-gray-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-gray-100">
                                        <Bell className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stats.total}</p>
                                        <p className="text-xs text-muted-foreground">Total</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-orange-200 bg-orange-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-orange-100">
                                        <Mail className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-orange-600">{stats.unread}</p>
                                        <p className="text-xs text-orange-600">Belum Dibaca</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-green-200 bg-green-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-green-100">
                                        <Check className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-green-600">{stats.read}</p>
                                        <p className="text-xs text-green-600">Sudah Dibaca</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

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
                        <CardContent>
                            <div className="flex flex-wrap gap-4 items-end">
                                <div className="space-y-2 min-w-[180px]">
                                    <Label className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        Status
                                    </Label>
                                    <Select
                                        value={filters.filter || 'all'}
                                        onValueChange={(v) => applyFilters({ filter: v === 'all' ? undefined : v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua</SelectItem>
                                            <SelectItem value="unread">Belum Dibaca</SelectItem>
                                            <SelectItem value="read">Sudah Dibaca</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        onClick={() => applyFilters({ filter: undefined })}
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Notifikasi</CardTitle>
                            <CardDescription>
                                Menampilkan {notifikasi.data.length} dari {notifikasi.total} notifikasi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {notifikasi.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500">Tidak ada notifikasi</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {notifikasi.data.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`p-4 rounded-lg border transition-colors ${
                                                item.is_read
                                                    ? 'bg-gray-50 border-gray-200'
                                                    : 'bg-green-50 border-green-200'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {!item.is_read && (
                                                            <Badge variant="default" className="bg-green-600">Baru</Badge>
                                                        )}
                                                        <h4 className="font-semibold text-gray-900">
                                                            {item.judul}
                                                        </h4>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {item.pesan}
                                                    </p>
                                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(item.created_at).toLocaleString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>
                                                {!item.is_read && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => markAsRead(item.id)}
                                                        className="shrink-0"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {notifikasi.last_page > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-6">
                                    {notifikasi.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
