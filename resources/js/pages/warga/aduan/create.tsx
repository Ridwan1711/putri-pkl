import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MapPicker } from '@/components/map/MapPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Aduan',
        href: '/warga/aduan',
    },
    {
        title: 'Buat Aduan',
        href: '/warga/aduan/create',
    },
];

export default function AduanCreate() {
    const { data, setData, post, processing, errors } = useForm({
        kategori: '',
        deskripsi: '',
        foto_bukti: null as File | null,
        latitude: null as number | null,
        longitude: null as number | null,
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
        post('/warga/aduan', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Aduan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href="/warga/aduan">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Buat Aduan</h1>
                </div>

                <form onSubmit={submit} className="space-y-6 max-w-2xl">
                    <div className="grid gap-2">
                        <Label htmlFor="kategori">Kategori *</Label>
                        <Select
                            value={data.kategori}
                            onValueChange={(value) => setData('kategori', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Sampah Menumpuk">Sampah Menumpuk</SelectItem>
                                <SelectItem value="Bau Tidak Sedap">Bau Tidak Sedap</SelectItem>
                                <SelectItem value="Lokasi Tidak Terjangkau">Lokasi Tidak Terjangkau</SelectItem>
                                <SelectItem value="Lainnya">Lainnya</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.kategori} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="deskripsi">Deskripsi *</Label>
                        <Textarea
                            id="deskripsi"
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            rows={5}
                            required
                            placeholder="Jelaskan aduan Anda secara detail..."
                        />
                        <InputError message={errors.deskripsi} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Pilih Lokasi di Peta (Opsional)</Label>
                        <MapPicker
                            latitude={data.latitude}
                            longitude={data.longitude}
                            onLocationSelect={handleLocationSelect}
                        />
                        <InputError message={errors.latitude || errors.longitude} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="foto_bukti">Foto Bukti (Opsional)</Label>
                        <Input
                            id="foto_bukti"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('foto_bukti', e.target.files?.[0] || null)}
                        />
                        <InputError message={errors.foto_bukti} />
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Mengirim...' : 'Kirim Aduan'}
                        </Button>
                        <Link href="/warga/aduan">
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
