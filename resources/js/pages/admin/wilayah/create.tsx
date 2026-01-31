import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MapPicker } from '@/components/map/MapPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wilayah',
        href: '/admin/wilayah',
    },
    {
        title: 'Tambah',
        href: '/admin/wilayah/create',
    },
];

export default function WilayahCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nama_wilayah: '',
        kecamatan: '',
        geojson: '',
        latitude: null as number | null,
        longitude: null as number | null,
        is_active: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/wilayah');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Wilayah" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/wilayah">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Tambah Wilayah</h1>
                </div>

                <form onSubmit={submit} className="space-y-6 max-w-2xl">
                    <div className="grid gap-2">
                        <Label htmlFor="nama_wilayah">Nama Desa *</Label>
                        <Input
                            id="nama_wilayah"
                            value={data.nama_wilayah}
                            onChange={(e) => setData('nama_wilayah', e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Hanya tambahkan Desa dalam Kecamatan yang sudah kerja sama.
                        </p>
                        <InputError message={errors.nama_wilayah} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="kecamatan">Kecamatan *</Label>
                        <Input
                            id="kecamatan"
                            value={data.kecamatan}
                            onChange={(e) => setData('kecamatan', e.target.value)}
                            required
                        />
                        <InputError message={errors.kecamatan} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Markas Desa (untuk auto-assign pengajuan ke petugas dalam radius 4km)</Label>
                        <MapPicker
                            latitude={data.latitude}
                            longitude={data.longitude}
                            onLocationSelect={(lat, lng) => setData({ ...data, latitude: lat, longitude: lng })}
                            height="300px"
                        />
                        <p className="text-xs text-muted-foreground">
                            Klik peta untuk set titik pusat wilayah. Diperlukan untuk fitur auto-assign pengajuan ke petugas dalam radius 4km.
                        </p>
                        <InputError message={errors.latitude} />
                        <InputError message={errors.longitude} />
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) => setData('is_active', checked === true)}
                        />
                        <Label htmlFor="is_active" className="cursor-pointer">
                            Aktif
                        </Label>
                        <InputError message={errors.is_active} />
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        <Link href="/admin/wilayah">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
