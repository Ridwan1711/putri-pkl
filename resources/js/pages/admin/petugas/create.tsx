import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';
import type { User, Armada, Wilayah } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Petugas',
        href: '/admin/petugas',
    },
    {
        title: 'Tambah',
        href: '/admin/petugas/create',
    },
];

interface Props {
    users: User[];
    armada: Armada[];
    wilayah: Wilayah[];
}

export default function PetugasCreate({ users, armada, wilayah }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        armada_id: '',
        wilayah_id: '',
        is_available: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/petugas');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Petugas" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/petugas">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Tambah Petugas</h1>
                </div>

                <form onSubmit={submit} className="space-y-6 max-w-2xl">
                    <div className="grid gap-2">
                        <Label htmlFor="user_id">User (Petugas) *</Label>
                        <Select value={data.user_id} onValueChange={(value) => setData('user_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih User" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.name} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.user_id} />
                        <p className="text-xs text-muted-foreground">
                            Hanya user dengan role petugas yang belum memiliki petugas yang ditampilkan
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="armada_id">Armada</Label>
                        <Select value={data.armada_id} onValueChange={(value) => setData('armada_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Armada (Opsional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Tidak ada</SelectItem>
                                {armada.map((a) => (
                                    <SelectItem key={a.id} value={a.id.toString()}>
                                        {a.kode_armada} - {a.jenis_kendaraan}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.armada_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="wilayah_id">Wilayah</Label>
                        <Select value={data.wilayah_id} onValueChange={(value) => setData('wilayah_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Wilayah (Opsional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Tidak ada</SelectItem>
                                {wilayah.map((w) => (
                                    <SelectItem key={w.id} value={w.id.toString()}>
                                        {w.nama_wilayah} - {w.kecamatan}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.wilayah_id} />
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="is_available"
                            checked={data.is_available}
                            onCheckedChange={(checked) => setData('is_available', checked === true)}
                        />
                        <Label htmlFor="is_available" className="cursor-pointer">
                            Tersedia
                        </Label>
                        <InputError message={errors.is_available} />
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        <Link href="/admin/petugas">
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
