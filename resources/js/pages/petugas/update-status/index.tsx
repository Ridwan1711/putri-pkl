import { Head, router } from '@inertiajs/react';
import { Check, Save } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/status-badge';
import type { BreadcrumbItem } from '@/types';
import type { Penugasan, Wilayah } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Update Status Pengajuan', href: '/petugas/update-status' },
];

const STATUS_OPTIONS = [
    { value: 'diverifikasi', label: 'Menunggu Konfirmasi' },
    { value: 'dijadwalkan', label: 'Sedang Diproses' },
    { value: 'diangkut', label: 'Dalam Perjalanan' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'ditolak', label: 'Gagal' },
];

interface Props {
    penugasan: {
        data: Penugasan[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    wilayah: Wilayah[];
    filters: { status?: string; wilayah_id?: string };
}

export default function UpdateStatusIndex({ penugasan, wilayah, filters }: Props) {
    const [showModal, setShowModal] = useState(false);

    const applyFilters = (updates: Record<string, string | undefined>) => {
        router.get('/petugas/update-status', { ...filters, ...updates }, { preserveState: true });
    };

    const handleSave = (penugasanId: number, status: string, tindakLanjut: string) => {
        router.post(`/petugas/penugasan/${penugasanId}/status-full`, {
            status,
            tindak_lanjut: tindakLanjut || undefined,
        }, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update Status Pengajuan" />
            <div className="flex h-full flex-1 flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-green-700">Update Status Pengajuan</h1>
                    <Button onClick={() => setShowModal(true)}>
                        <Check className="mr-2 h-4 w-4" />
                        Konfirmasi & Selesaikan
                    </Button>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="grid gap-2">
                        <Label>Status</Label>
                        <Select
                            value={filters.status || 'all'}
                            onValueChange={(v) => applyFilters({ status: v === 'all' ? undefined : v })}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Semua" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                {STATUS_OPTIONS.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>
                                        {o.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Wilayah</Label>
                        <Select
                            value={filters.wilayah_id || 'all'}
                            onValueChange={(v) => applyFilters({ wilayah_id: v === 'all' ? undefined : v })}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Semua" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                {wilayah.map((w) => (
                                    <SelectItem key={w.id} value={w.id.toString()}>
                                        {w.nama_wilayah}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-green-700 text-white">
                                <th className="px-4 py-3 text-left">Tindak Lanjut</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {penugasan.data.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                                        Tidak ada data
                                    </td>
                                </tr>
                            ) : (
                                penugasan.data.map((p) => (
                                    <RowWithForm key={p.id} penugasan={p} onSave={handleSave} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Pengangkutan Selesai</DialogTitle>
                    </DialogHeader>
                    <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                        Sistem hanya akan mengonfirmasi pengajuan dengan status Selesai dan Gagal
                        berdasarkan tanggal yang dipilih ke tabel Riwayat.
                    </p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setShowModal(false);
                        }}
                        className="space-y-4"
                    >
                        <div className="grid gap-2">
                            <Label>Tanggal Pengangkutan</Label>
                            <Input type="date" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Total Sampah Terangkut (Kg)</Label>
                            <Input type="text" placeholder="Contoh: 4000 atau 12.5" />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                Batal
                            </Button>
                            <Button type="submit">
                                <Check className="mr-2 h-4 w-4" />
                                Konfirmasi & Selesaikan
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

function RowWithForm({
    penugasan,
    onSave,
}: {
    penugasan: Penugasan;
    onSave: (id: number, status: string, tindakLanjut: string) => void;
}) {
    const [status, setStatus] = useState(penugasan.pengajuan_pengangkutan?.status ?? 'diverifikasi');
    const [tindakLanjut, setTindakLanjut] = useState(penugasan.tindak_lanjut ?? '');
    const pengajuanStatus = penugasan.pengajuan_pengangkutan?.status;

    return (
        <tr className="border-b">
            <td className="px-4 py-3">
                <span className="text-muted-foreground">{penugasan.tindak_lanjut || '-'}</span>
            </td>
            <td className="px-4 py-3">
                <StatusBadge status={(pengajuanStatus ?? penugasan.status) as never} />
            </td>
            <td className="px-4 py-3">
                <div className="flex flex-col gap-2">
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPTIONS.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                    {o.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Tindak lanjut"
                        value={tindakLanjut}
                        onChange={(e) => setTindakLanjut(e.target.value)}
                    />
                    <Button size="sm" onClick={() => onSave(penugasan.id, status, tindakLanjut)}>
                        <Save className="mr-1 h-4 w-4" />
                        Simpan
                    </Button>
                </div>
            </td>
        </tr>
    );
}
