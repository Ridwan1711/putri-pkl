import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { MapPicker } from '@/components/map/MapPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';
import type { Wilayah } from '@/types/models';

interface Props {
    wilayah: Wilayah;
}

export default function KampungCreate({ wilayah }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nama_kampung: '',
        latitude: null as number | null,
        longitude: null as number | null,
        urutan_rute: 0,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/wilayah/${wilayah.id}/kampung`);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Wilayah', href: '/admin/wilayah' },
        { title: wilayah.nama_wilayah, href: `/admin/wilayah/${wilayah.id}` },
        { title: 'Kampung', href: `/admin/wilayah/${wilayah.id}/kampung` },
        { title: 'Tambah', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tambah Kampung - ${wilayah.nama_wilayah}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={`/admin/wilayah/${wilayah.id}/kampung`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Tambah Kampung - {wilayah.nama_wilayah}</h1>
                </div>

                <form onSubmit={submit} className="space-y-6 max-w-2xl">
                    <div className="grid gap-2">
                        <Label htmlFor="nama_kampung">Nama Kampung *</Label>
                        <Input
                            id="nama_kampung"
                            value={data.nama_kampung}
                            onChange={(e) => setData('nama_kampung', e.target.value)}
                            placeholder="Kp. Nama Kampung"
                            required
                        />
                        <InputError message={errors.nama_kampung} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Koordinat (untuk rute di peta)</Label>
                        <MapPicker
                            latitude={data.latitude}
                            longitude={data.longitude}
                            onLocationSelect={(lat, lng) => setData({ ...data, latitude: lat, longitude: lng })}
                            height="300px"
                        />
                        <p className="text-xs text-muted-foreground">
                            Klik peta untuk set titik kampung. Digunakan untuk menampilkan jalur rute.
                        </p>
                        <InputError message={errors.latitude} />
                        <InputError message={errors.longitude} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="urutan_rute">Urutan Rute</Label>
                        <Input
                            id="urutan_rute"
                            type="number"
                            min="0"
                            value={data.urutan_rute}
                            onChange={(e) => setData('urutan_rute', parseInt(e.target.value) || 0)}
                            placeholder="0"
                        />
                        <p className="text-xs text-muted-foreground">
                            Urutan kunjungan kampung dalam rute (0 = pertama)
                        </p>
                        <InputError message={errors.urutan_rute} />
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        <Link href={`/admin/wilayah/${wilayah.id}/kampung`}>
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
