import { Head, Link, router } from '@inertiajs/react';
import {
    Check, Save, RefreshCw, Filter, RotateCcw, MapPin, Calendar,
    CheckCircle, AlertCircle, Truck, Clock, XCircle, Eye, FileText
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/status-badge';
import { toast } from 'react-hot-toast';
import type { BreadcrumbItem } from '@/types';
import type { Penugasan, Wilayah } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/petugas/dashboard' },
    { title: 'Update Status', href: '/petugas/update-status' },
];

const STATUS_OPTIONS = [
    { value: 'diverifikasi', label: 'Diverifikasi', icon: CheckCircle, color: 'text-blue-500' },
    { value: 'dijadwalkan', label: 'Dijadwalkan', icon: Calendar, color: 'text-purple-500' },
    { value: 'diangkut', label: 'Diangkut', icon: Truck, color: 'text-orange-500' },
    { value: 'selesai', label: 'Selesai', icon: CheckCircle, color: 'text-green-500' },
    { value: 'ditolak', label: 'Ditolak', icon: XCircle, color: 'text-red-500' },
];

interface Props {
    penugasan: {
        data: Penugasan[];
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    wilayah: Wilayah[];
    filters: { status?: string; wilayah_id?: string };
}

export default function UpdateStatusIndex({ penugasan, wilayah, filters }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [batchDate, setBatchDate] = useState('');
    const [batchSampah, setBatchSampah] = useState('');

    const applyFilters = (updates: Record<string, string | undefined>) => {
        router.get('/petugas/update-status', { ...filters, ...updates }, { preserveState: true, preserveScroll: true });
    };

    const handleSave = (penugasanId: number, status: string, tindakLanjut: string) => {
        router.post(`/petugas/penugasan/${penugasanId}/status-full`, {
            status,
            tindak_lanjut: tindakLanjut || undefined,
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success('Status berhasil diperbarui'),
            onError: () => toast.error('Gagal memperbarui status'),
        });
    };

    const handleBatchConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would implement the batch confirmation logic
        toast.success('Batch konfirmasi berhasil');
        setShowModal(false);
        setBatchDate('');
        setBatchSampah('');
    };

    const hasActiveFilters = filters.status || filters.wilayah_id;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update Status Pengajuan" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                    <RefreshCw className="h-8 w-8" />
                                    Update Status Pengajuan
                                </h1>
                                <p className="text-green-100 mt-1">
                                    Perbarui status penugasan dengan cepat
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="bg-white/20 text-white border-0 text-lg px-4 py-2">
                                    {penugasan.data.length} Penugasan
                                </Badge>
                                <Button
                                    onClick={() => setShowModal(true)}
                                    className="bg-white text-green-700 hover:bg-green-50"
                                >
                                    <Check className="mr-2 h-4 w-4" />
                                    Batch Konfirmasi
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6 space-y-6">
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
                                        <CheckCircle className="h-3 w-3" />
                                        Status
                                    </Label>
                                    <Select
                                        value={filters.status || 'all'}
                                        onValueChange={(v) => applyFilters({ status: v === 'all' ? undefined : v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Status</SelectItem>
                                            {STATUS_OPTIONS.map((o) => (
                                                <SelectItem key={o.value} value={o.value}>
                                                    <div className="flex items-center gap-2">
                                                        <o.icon className={`h-3 w-3 ${o.color}`} />
                                                        {o.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 min-w-[200px]">
                                    <Label className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        Wilayah
                                    </Label>
                                    <Select
                                        value={filters.wilayah_id || 'all'}
                                        onValueChange={(v) => applyFilters({ wilayah_id: v === 'all' ? undefined : v })}
                                    >
                                        <SelectTrigger>
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
                                </div>
                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        onClick={() => applyFilters({ status: undefined, wilayah_id: undefined })}
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Penugasan Cards */}
                    {penugasan.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500">Tidak ada penugasan yang perlu diupdate</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {penugasan.data.map((p) => (
                                <UpdateCard key={p.id} penugasan={p} onSave={handleSave} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Batch Confirmation Modal */}
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-600" />
                                Konfirmasi Batch Pengangkutan
                            </DialogTitle>
                            <DialogDescription>
                                Konfirmasi semua pengajuan yang sudah selesai atau gagal
                            </DialogDescription>
                        </DialogHeader>
                        <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                            <AlertCircle className="h-4 w-4 inline mr-2" />
                            Sistem hanya akan mengonfirmasi pengajuan dengan status Selesai dan Gagal
                            berdasarkan tanggal yang dipilih ke tabel Riwayat.
                        </div>
                        <form onSubmit={handleBatchConfirm} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Tanggal Pengangkutan
                                </Label>
                                <Input
                                    type="date"
                                    value={batchDate}
                                    onChange={(e) => setBatchDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1">
                                    <Truck className="h-3 w-3" />
                                    Total Sampah Terangkut (Kg)
                                </Label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={batchSampah}
                                    onChange={(e) => setBatchSampah(e.target.value)}
                                    placeholder="Contoh: 4000"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                    <Check className="mr-2 h-4 w-4" />
                                    Konfirmasi
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

function UpdateCard({
    penugasan,
    onSave,
}: {
    penugasan: Penugasan;
    onSave: (id: number, status: string, tindakLanjut: string) => void;
}) {
    const [status, setStatus] = useState(penugasan.pengajuan_pengangkutan?.status ?? 'diverifikasi');
    const [tindakLanjut, setTindakLanjut] = useState(penugasan.tindak_lanjut ?? '');
    const [isSaving, setIsSaving] = useState(false);
    const pengajuanStatus = penugasan.pengajuan_pengangkutan?.status;
    const wargaName = penugasan.pengajuan_pengangkutan?.user?.name ?? penugasan.pengajuan_pengangkutan?.nama_pemohon ?? '-';

    const handleSave = () => {
        setIsSaving(true);
        onSave(penugasan.id, status, tindakLanjut);
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <Card className="overflow-hidden">
            <div className="grid md:grid-cols-3 gap-0">
                {/* Action Column - FIRST */}
                <div className="p-4 bg-gray-50 border-b md:border-b-0 md:border-r flex flex-col gap-3">
                    <div className="flex items-center justify-between md:hidden">
                        <Badge variant="outline">#{penugasan.id}</Badge>
                        <StatusBadge status={(pengajuanStatus ?? penugasan.status) as never} />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Ubah Status</Label>
                        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                            <SelectTrigger className="bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>
                                        <div className="flex items-center gap-2">
                                            <o.icon className={`h-4 w-4 ${o.color}`} />
                                            {o.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Tindak Lanjut</Label>
                        <Textarea
                            placeholder="Catatan tindak lanjut..."
                            value={tindakLanjut}
                            onChange={(e) => setTindakLanjut(e.target.value)}
                            className="bg-white resize-none"
                            rows={2}
                        />
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full bg-green-600 hover:bg-green-700"
                    >
                        {isSaving ? (
                            <>
                                <Clock className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Perubahan
                            </>
                        )}
                    </Button>
                </div>

                {/* Info Column */}
                <div className="p-4 md:col-span-2">
                    <div className="hidden md:flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">#{penugasan.id}</Badge>
                            <StatusBadge status={(pengajuanStatus ?? penugasan.status) as never} />
                        </div>
                        <Link href={`/petugas/penugasan/${penugasan.id}`}>
                            <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Detail
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <p className="text-lg font-semibold">{wargaName}</p>
                            <p className="text-sm text-muted-foreground">
                                {penugasan.pengajuan_pengangkutan?.alamat_lengkap ?? '-'}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {penugasan.pengajuan_pengangkutan?.wilayah?.nama_wilayah ?? '-'}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {new Date(penugasan.jadwal_angkut).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </div>
                            {penugasan.armada && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Truck className="h-4 w-4" />
                                    {penugasan.armada.kode_armada}
                                </div>
                            )}
                        </div>

                        {penugasan.tindak_lanjut && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Tindak Lanjut Sebelumnya:</p>
                                <p className="text-sm">{penugasan.tindak_lanjut}</p>
                            </div>
                        )}
                    </div>

                    {/* Mobile Action */}
                    <div className="mt-4 pt-4 border-t md:hidden">
                        <Link href={`/petugas/penugasan/${penugasan.id}`} className="block">
                            <Button variant="outline" className="w-full">
                                <Eye className="h-4 w-4 mr-2" />
                                Lihat Detail
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    );
}
