import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import type { BreadcrumbItem, User } from '@/types';
import type { Armada, Wilayah } from '@/types/models';

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

const HARI_LIBUR_OPTIONS = [
    { value: 1, label: 'Senin' },
    { value: 2, label: 'Selasa' },
    { value: 3, label: 'Rabu' },
    { value: 4, label: 'Kamis' },
    { value: 5, label: 'Jumat' },
    { value: 6, label: 'Sabtu' },
    { value: 7, label: 'Minggu' },
] as const;

type UserMode = 'existing' | 'new';

export default function PetugasCreate({ users, armada, wilayah }: Props) {
    const [mode, setMode] = useState<UserMode>(users.length > 0 ? 'existing' : 'new');

    const emptyCreateUser = () => ({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        create_user: users.length > 0 ? null : emptyCreateUser(),
        armada_id: '',
        wilayah_id: '',
        is_available: true,
        hari_libur: [] as number[],
    });

    const toggleHariLibur = (value: number) => {
        const current = data.hari_libur || [];
        const next = current.includes(value)
            ? current.filter((h) => h !== value)
            : current.length < 3
              ? [...current, value]
              : current;
        setData('hari_libur', next);
    };

    const switchMode = (m: UserMode) => {
        setMode(m);
        if (m === 'existing') {
            setData({ ...data, user_id: '', create_user: null });
        } else {
            setData({ ...data, user_id: '', create_user: emptyCreateUser() });
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/petugas', { preserveScroll: true });
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
                    {/* Mode: Pilih user ada / Buat akun baru */}
                    <div className="space-y-4 rounded-lg border p-4">
                        <Label>Akun Petugas</Label>
                        <div className="flex flex-wrap gap-4">
                            <button
                                type="button"
                                onClick={() => switchMode('existing')}
                                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                                    mode === 'existing'
                                        ? 'border-green-600 bg-green-50 text-green-700'
                                        : 'border-border hover:bg-muted/50'
                                }`}
                                disabled={users.length === 0}
                            >
                                <Users className="h-4 w-4" />
                                Pilih user yang sudah ada
                                {users.length === 0 && (
                                    <span className="text-xs text-muted-foreground">(tidak ada)</span>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => switchMode('new')}
                                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                                    mode === 'new'
                                        ? 'border-green-600 bg-green-50 text-green-700'
                                        : 'border-border hover:bg-muted/50'
                                }`}
                            >
                                <UserPlus className="h-4 w-4" />
                                Buat akun baru
                            </button>
                        </div>

                        {mode === 'existing' ? (
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
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="create_user_name">Nama *</Label>
                                    <Input
                                        id="create_user_name"
                                        value={data.create_user?.name ?? ''}
                                        onChange={(e) =>
                                            setData('create_user', {
                                                ...(data.create_user ?? {
                                                    name: '',
                                                    email: '',
                                                    password: '',
                                                    password_confirmation: '',
                                                }),
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="Nama lengkap"
                                        required={mode === 'new'}
                                    />
                                    <InputError message={(errors as Record<string, string>)['create_user.name']} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="create_user_email">Email *</Label>
                                    <Input
                                        id="create_user_email"
                                        type="email"
                                        value={data.create_user?.email ?? ''}
                                        onChange={(e) =>
                                            setData('create_user', {
                                                ...(data.create_user ?? {
                                                    name: '',
                                                    email: '',
                                                    password: '',
                                                    password_confirmation: '',
                                                }),
                                                email: e.target.value,
                                            })
                                        }
                                        placeholder="email@contoh.com"
                                        required={mode === 'new'}
                                    />
                                    <InputError message={(errors as Record<string, string>)['create_user.email']} />
                                </div>
                                <div className="grid gap-2 sm:col-span-2">
                                    <Label htmlFor="create_user_password">Password *</Label>
                                    <Input
                                        id="create_user_password"
                                        type="password"
                                        value={data.create_user?.password ?? ''}
                                        onChange={(e) =>
                                            setData('create_user', {
                                                ...(data.create_user ?? {
                                                    name: '',
                                                    email: '',
                                                    password: '',
                                                    password_confirmation: '',
                                                }),
                                                password: e.target.value,
                                            })
                                        }
                                        placeholder="Min. 8 karakter"
                                        required={mode === 'new'}
                                        minLength={8}
                                    />
                                    <InputError message={(errors as Record<string, string>)['create_user.password']} />
                                </div>
                                <div className="grid gap-2 sm:col-span-2">
                                    <Label htmlFor="create_user_password_confirmation">Konfirmasi Password *</Label>
                                    <Input
                                        id="create_user_password_confirmation"
                                        type="password"
                                        value={data.create_user?.password_confirmation ?? ''}
                                        onChange={(e) =>
                                            setData('create_user', {
                                                ...(data.create_user ?? {
                                                    name: '',
                                                    email: '',
                                                    password: '',
                                                    password_confirmation: '',
                                                }),
                                                password_confirmation: e.target.value,
                                            })
                                        }
                                        placeholder="Ulangi password"
                                        required={mode === 'new'}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="armada_id">Armada</Label>
                        <Select
                            value={data.armada_id || '_none'}
                            onValueChange={(value) => setData('armada_id', value === '_none' ? '' : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Armada (Opsional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="_none">Tidak ada</SelectItem>
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
                        <Select
                            value={data.wilayah_id || '_none'}
                            onValueChange={(value) => setData('wilayah_id', value === '_none' ? '' : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Wilayah (Opsional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="_none">Tidak ada</SelectItem>
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
                        <Label>Hari Libur (maks. 3 hari)</Label>
                        <div className="flex flex-wrap gap-4">
                            {HARI_LIBUR_OPTIONS.map((opt) => (
                                <div key={opt.value} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`hari_libur_${opt.value}`}
                                        checked={(data.hari_libur || []).includes(opt.value)}
                                        onCheckedChange={() => toggleHariLibur(opt.value)}
                                    />
                                    <Label
                                        htmlFor={`hari_libur_${opt.value}`}
                                        className="cursor-pointer text-sm"
                                    >
                                        {opt.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.hari_libur} />
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
