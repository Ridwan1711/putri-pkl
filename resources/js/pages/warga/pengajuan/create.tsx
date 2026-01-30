import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { MapPicker } from '@/components/map/MapPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';
import type { Wilayah } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengajuan',
        href: '#',
    },
    {
        title: 'Buat Pengajuan',
        href: '#',
    },
];

export default function CreatePengajuan({ wilayah }: { wilayah: Wilayah[] }) {
    const { data, setData, post, processing, errors } = useForm({
        wilayah_id: '',
        alamat_lengkap: '',
        latitude: null as number | null,
        longitude: null as number | null,
        estimasi_volume: '',
        foto_sampah: null as File | null,
    });

    const handleLocationSelect = (lat: number, lng: number) => {
        setData({
            ...data,
            latitude: lat,
            longitude: lng,
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/warga/pengajuan', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Pengajuan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Buat Pengajuan Pengangkutan</h1>
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="wilayah_id">Wilayah</Label>
                        <Select
                            value={data.wilayah_id}
                            onValueChange={(value) => setData('wilayah_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Wilayah" />
                            </SelectTrigger>
                            <SelectContent>
                                {wilayah.map((w) => (
                                    <SelectItem key={w.id} value={w.id.toString()}>
                                        {w.nama_wilayah} - {w.kecamatan}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.wilayah_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="alamat_lengkap">Alamat Lengkap</Label>
                        <Input
                            id="alamat_lengkap"
                            value={data.alamat_lengkap}
                            onChange={(e) => setData('alamat_lengkap', e.target.value)}
                            required
                        />
                        <InputError message={errors.alamat_lengkap} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Pilih Lokasi di Peta</Label>
                        <MapPicker
                            latitude={data.latitude}
                            longitude={data.longitude}
                            onLocationSelect={handleLocationSelect}
                        />
                        <InputError message={errors.latitude || errors.longitude} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="estimasi_volume">Estimasi Volume</Label>
                        <Input
                            id="estimasi_volume"
                            value={data.estimasi_volume}
                            onChange={(e) => setData('estimasi_volume', e.target.value)}
                            placeholder="Contoh: 2 m³"
                        />
                        <InputError message={errors.estimasi_volume} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="foto_sampah">Foto Sampah</Label>
                        <Input
                            id="foto_sampah"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('foto_sampah', e.target.files?.[0] || null)}
                        />
                        <InputError message={errors.foto_sampah} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
