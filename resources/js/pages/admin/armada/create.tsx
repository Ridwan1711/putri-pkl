import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Armada',
        href: '/admin/armada',
    },
    {
        title: 'Tambah',
        href: '/admin/armada/create',
    },
];

export default function ArmadaCreate() {
    const { data, setData, post, processing, errors } = useForm({
        kode_armada: '',
        jenis_kendaraan: '',
        plat_nomor: '',
        kapasitas: '',
        status: 'aktif' as 'aktif' | 'perbaikan' | 'nonaktif',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/armada');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Armada" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/armada">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Tambah Armada</h1>
                </div>

                <form onSubmit={submit} className="space-y-6 max-w-2xl">
                    <div className="grid gap-2">
                        <Label htmlFor="kode_armada">Kode Armada *</Label>
                        <Input
                            id="kode_armada"
                            value={data.kode_armada}
                            onChange={(e) => setData('kode_armada', e.target.value)}
                            placeholder="ARM-001"
                            required
                        />
                        <InputError message={errors.kode_armada} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="jenis_kendaraan">Jenis Kendaraan *</Label>
                        <Input
                            id="jenis_kendaraan"
                            value={data.jenis_kendaraan}
                            onChange={(e) => setData('jenis_kendaraan', e.target.value)}
                            placeholder="Truk, Pickup, Dump Truck, dll"
                            required
                        />
                        <InputError message={errors.jenis_kendaraan} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="plat_nomor">Plat Nomor *</Label>
                        <Input
                            id="plat_nomor"
                            value={data.plat_nomor}
                            onChange={(e) => setData('plat_nomor', e.target.value)}
                            placeholder="B 1234 ABC"
                            required
                        />
                        <InputError message={errors.plat_nomor} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="kapasitas">Kapasitas (m³) *</Label>
                        <Input
                            id="kapasitas"
                            type="number"
                            step="0.01"
                            value={data.kapasitas}
                            onChange={(e) => setData('kapasitas', e.target.value)}
                            placeholder="10.00"
                            required
                        />
                        <InputError message={errors.kapasitas} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select value={data.status} onValueChange={(value: any) => setData('status', value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="aktif">Aktif</SelectItem>
                                <SelectItem value="perbaikan">Perbaikan</SelectItem>
                                <SelectItem value="nonaktif">Nonaktif</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        <Link href="/admin/armada">
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
