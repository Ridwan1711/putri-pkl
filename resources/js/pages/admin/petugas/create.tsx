import { Head, useForm, Link } from '@inertiajs/react';
import {
    ArrowLeft, Save, MapPin, Calendar,
    CheckCircle, XCircle, Users, Settings2,
    Clock, Eye,
    Building, UserPlus, Users2, BadgeCheck,
    Mail, Lock, User as UserIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import InputError from '@/components/input-error';
import type { BreadcrumbItem, User } from '@/types';
import type { Wilayah } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin',
    },
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
    wilayah: Wilayah[];
}

const HARI_LIBUR_OPTIONS = [
    { value: 1, label: 'Senin', short: 'Sen' },
    { value: 2, label: 'Selasa', short: 'Sel' },
    { value: 3, label: 'Rabu', short: 'Rab' },
    { value: 4, label: 'Kamis', short: 'Kam' },
    { value: 5, label: 'Jumat', short: 'Jum' },
    { value: 6, label: 'Sabtu', short: 'Sab' },
    { value: 7, label: 'Minggu', short: 'Min' },
] as const;

type UserMode = 'existing' | 'new';

export default function PetugasCreate({ users, wilayah }: Props) {
    const [mode, setMode] = useState<UserMode>(users.length > 0 ? 'existing' : 'new');
    const [activeTab, setActiveTab] = useState('akun');
    const [hariLiburCount, setHariLiburCount] = useState(0);

    const emptyCreateUser = () => ({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        create_user: users.length > 0 ? null : emptyCreateUser(),
        wilayah_id: '',
        is_available: true,
        hari_libur: [] as number[],
    });

    useEffect(() => {
        setHariLiburCount(data.hari_libur.length);
    }, [data.hari_libur]);

    const toggleHariLibur = (value: number) => {
        const current = data.hari_libur || [];
        let next;

        if (current.includes(value)) {
            next = current.filter((h) => h !== value);
        } else {
            if (current.length < 3) {
                next = [...current, value];
            } else {
                toast.error('Maksimal 3 hari libur yang dapat dipilih');
                return;
            }
        }

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

    const handleUserSelect = (userId: string) => {
        setData('user_id', userId);
        const selectedUser = users.find(u => u.id.toString() === userId);
        if (selectedUser) {
            toast.success(`User ${selectedUser.name} dipilih`);
        }
    };

    const getHariLiburLabel = (value: number) => {
        return HARI_LIBUR_OPTIONS.find(opt => opt.value === value)?.label || '';
    };

    const selectedUser = users.find(u => u.id.toString() === data.user_id);
    const previewName = mode === 'existing' ? selectedUser?.name : data.create_user?.name;
    const previewEmail = mode === 'existing' ? selectedUser?.email : data.create_user?.email;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'existing' && !data.user_id) {
            toast.error('Pilih user terlebih dahulu');
            return;
        }

        if (mode === 'new') {
            if (!data.create_user?.name || !data.create_user?.email || !data.create_user?.password) {
                toast.error('Lengkapi data akun baru');
                return;
            }
        }

        post('/admin/petugas', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Petugas berhasil ditambahkan');
            },
            onError: () => {
                toast.error('Gagal menambahkan petugas');
            },
        });
    };

    const handleReset = () => {
        reset();
        setMode(users.length > 0 ? 'existing' : 'new');
        toast.success('Form telah direset');
    };

    const isFormValid = () => {
        if (mode === 'existing') {
            return !!data.user_id;
        }
        return !!(data.create_user?.name && data.create_user?.email && data.create_user?.password);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Petugas" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header Section */}
                <div className="border-b bg-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Link href="/admin/petugas">
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                                        <UserPlus className="h-8 w-8 text-green-500" />
                                        Tambah Petugas
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Daftarkan petugas baru ke dalam sistem
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleReset}
                                    disabled={processing}
                                >
                                    Reset Form
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Left Column - Form */}
                        <div className="lg:col-span-2">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="akun" className="flex items-center gap-2">
                                        <Users2 className="h-4 w-4" />
                                        Akun
                                    </TabsTrigger>
                                    <TabsTrigger value="wilayah" className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Wilayah
                                    </TabsTrigger>
                                    <TabsTrigger value="jadwal" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Jadwal
                                    </TabsTrigger>
                                </TabsList>

                                <form onSubmit={submit}>
                                    {/* Akun Tab */}
                                    <TabsContent value="akun" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Users2 className="h-5 w-5 text-green-500" />
                                                    Akun Petugas
                                                </CardTitle>
                                                <CardDescription>
                                                    Pilih user yang sudah ada atau buat akun baru
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                {/* Mode Selection */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div
                                                        onClick={() => users.length > 0 && switchMode('existing')}
                                                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                            mode === 'existing'
                                                                ? 'border-green-500 bg-green-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        } ${users.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <div className="flex flex-col items-center text-center gap-2">
                                                            <div className={`p-3 rounded-full ${mode === 'existing' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                                <Users className={`h-6 w-6 ${mode === 'existing' ? 'text-green-600' : 'text-gray-600'}`} />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">Pilih User</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {users.length > 0 ? `${users.length} user tersedia` : 'Tidak ada user'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {mode === 'existing' && (
                                                            <div className="absolute top-2 right-2">
                                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div
                                                        onClick={() => switchMode('new')}
                                                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                            mode === 'new'
                                                                ? 'border-green-500 bg-green-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <div className="flex flex-col items-center text-center gap-2">
                                                            <div className={`p-3 rounded-full ${mode === 'new' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                                <UserPlus className={`h-6 w-6 ${mode === 'new' ? 'text-green-600' : 'text-gray-600'}`} />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">Buat Akun Baru</p>
                                                                <p className="text-xs text-gray-500">Daftarkan user baru</p>
                                                            </div>
                                                        </div>
                                                        {mode === 'new' && (
                                                            <div className="absolute top-2 right-2">
                                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <Separator />

                                                {/* Mode: Existing User */}
                                                {mode === 'existing' ? (
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="user_id" className="flex items-center gap-2">
                                                                <UserIcon className="h-4 w-4" />
                                                                Pilih User *
                                                            </Label>
                                                            <Select
                                                                value={data.user_id}
                                                                onValueChange={handleUserSelect}
                                                                disabled={processing}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Pilih User" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {users.map((user) => (
                                                                        <SelectItem key={user.id} value={user.id.toString()}>
                                                                            <div className="flex items-center gap-2">
                                                                                <Avatar className="h-6 w-6">
                                                                                    <AvatarFallback className="text-xs">
                                                                                        {user.name?.charAt(0)}
                                                                                    </AvatarFallback>
                                                                                </Avatar>
                                                                                <div>
                                                                                    <p className="font-medium">{user.name}</p>
                                                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                                                </div>
                                                                            </div>
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <InputError message={errors.user_id} />
                                                            <p className="text-xs text-gray-500">
                                                                Hanya user dengan role petugas yang belum terdaftar sebagai petugas
                                                            </p>
                                                        </div>

                                                        {selectedUser && (
                                                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                                                <p className="text-sm font-medium text-green-800 mb-2">User terpilih:</p>
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar className="h-10 w-10">
                                                                        <AvatarFallback className="bg-green-100 text-green-600">
                                                                            {selectedUser.name?.charAt(0)}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <p className="font-medium">{selectedUser.name}</p>
                                                                        <p className="text-sm text-gray-600">{selectedUser.email}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    /* Mode: Create New User */
                                                    <div className="space-y-4">
                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="create_user_name" className="flex items-center gap-2">
                                                                    <UserIcon className="h-4 w-4" />
                                                                    Nama Lengkap *
                                                                </Label>
                                                                <Input
                                                                    id="create_user_name"
                                                                    value={data.create_user?.name ?? ''}
                                                                    onChange={(e) =>
                                                                        setData('create_user', {
                                                                            ...(data.create_user ?? emptyCreateUser()),
                                                                            name: e.target.value,
                                                                        })
                                                                    }
                                                                    placeholder="Masukkan nama lengkap"
                                                                    disabled={processing}
                                                                />
                                                                <InputError message={(errors as Record<string, string>)['create_user.name']} />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="create_user_email" className="flex items-center gap-2">
                                                                    <Mail className="h-4 w-4" />
                                                                    Email *
                                                                </Label>
                                                                <Input
                                                                    id="create_user_email"
                                                                    type="email"
                                                                    value={data.create_user?.email ?? ''}
                                                                    onChange={(e) =>
                                                                        setData('create_user', {
                                                                            ...(data.create_user ?? emptyCreateUser()),
                                                                            email: e.target.value,
                                                                        })
                                                                    }
                                                                    placeholder="email@contoh.com"
                                                                    disabled={processing}
                                                                />
                                                                <InputError message={(errors as Record<string, string>)['create_user.email']} />
                                                            </div>
                                                        </div>

                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="create_user_password" className="flex items-center gap-2">
                                                                    <Lock className="h-4 w-4" />
                                                                    Password *
                                                                </Label>
                                                                <Input
                                                                    id="create_user_password"
                                                                    type="password"
                                                                    value={data.create_user?.password ?? ''}
                                                                    onChange={(e) =>
                                                                        setData('create_user', {
                                                                            ...(data.create_user ?? emptyCreateUser()),
                                                                            password: e.target.value,
                                                                        })
                                                                    }
                                                                    placeholder="Min. 8 karakter"
                                                                    disabled={processing}
                                                                />
                                                                <InputError message={(errors as Record<string, string>)['create_user.password']} />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="create_user_password_confirmation" className="flex items-center gap-2">
                                                                    <Lock className="h-4 w-4" />
                                                                    Konfirmasi Password *
                                                                </Label>
                                                                <Input
                                                                    id="create_user_password_confirmation"
                                                                    type="password"
                                                                    value={data.create_user?.password_confirmation ?? ''}
                                                                    onChange={(e) =>
                                                                        setData('create_user', {
                                                                            ...(data.create_user ?? emptyCreateUser()),
                                                                            password_confirmation: e.target.value,
                                                                        })
                                                                    }
                                                                    placeholder="Ulangi password"
                                                                    disabled={processing}
                                                                />
                                                            </div>
                                                        </div>

                                                        <p className="text-xs text-gray-500">
                                                            Akun baru akan otomatis dibuat dengan role petugas
                                                        </p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Wilayah Tab */}
                                    <TabsContent value="wilayah" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <MapPin className="h-5 w-5 text-blue-500" />
                                                    Wilayah Penugasan
                                                </CardTitle>
                                                <CardDescription>
                                                    Tentukan wilayah kerja petugas (opsional)
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="wilayah_id" className="flex items-center gap-2">
                                                        <Building className="h-4 w-4" />
                                                        Wilayah
                                                    </Label>
                                                    <Select
                                                        value={data.wilayah_id || '_none'}
                                                        onValueChange={(value) => setData('wilayah_id', value === '_none' ? '' : value)}
                                                        disabled={processing}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Wilayah (Opsional)" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="_none">
                                                                <div className="flex items-center gap-2 text-gray-500">
                                                                    <XCircle className="h-4 w-4" />
                                                                    Tidak ada wilayah
                                                                </div>
                                                            </SelectItem>
                                                            {wilayah.map((w) => (
                                                                <SelectItem key={w.id} value={w.id.toString()}>
                                                                    <div className="flex items-center gap-2">
                                                                        <Building className="h-4 w-4" />
                                                                        <div>
                                                                            <p className="font-medium">{w.nama_wilayah}</p>
                                                                            <p className="text-xs text-gray-500">{w.kecamatan}</p>
                                                                        </div>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError message={errors.wilayah_id} />
                                                    <p className="text-xs text-gray-500">
                                                        Wilayah utama penugasan petugas
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Status Card */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Settings2 className="h-5 w-5 text-purple-500" />
                                                    Status Ketersediaan
                                                </CardTitle>
                                                <CardDescription>
                                                    Atur ketersediaan petugas untuk penugasan
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-full ${data.is_available ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                            {data.is_available ? (
                                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                            ) : (
                                                                <XCircle className="h-5 w-5 text-gray-600" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="is_available" className="font-medium cursor-pointer">
                                                                Status Ketersediaan
                                                            </Label>
                                                            <p className="text-sm text-gray-500">
                                                                {data.is_available ? 'Petugas tersedia untuk penugasan' : 'Petugas tidak tersedia'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        id="is_available"
                                                        checked={data.is_available}
                                                        onCheckedChange={(checked) => setData('is_available', checked)}
                                                        disabled={processing}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Jadwal Tab */}
                                    <TabsContent value="jadwal" className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Calendar className="h-5 w-5 text-orange-500" />
                                                    Hari Libur
                                                </CardTitle>
                                                <CardDescription>
                                                    Pilih hari libur petugas (maksimal 3 hari)
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            Hari Libur Terpilih
                                                        </Label>
                                                        <Badge variant="outline">
                                                            {hariLiburCount}/3 hari
                                                        </Badge>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        {HARI_LIBUR_OPTIONS.map((opt) => (
                                                            <div
                                                                key={opt.value}
                                                                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                                                    data.hari_libur.includes(opt.value)
                                                                        ? 'border-green-500 bg-green-50'
                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                                onClick={() => toggleHariLibur(opt.value)}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Checkbox
                                                                        id={`hari_libur_${opt.value}`}
                                                                        checked={data.hari_libur.includes(opt.value)}
                                                                        onCheckedChange={() => toggleHariLibur(opt.value)}
                                                                        className="data-[state=checked]:bg-green-500"
                                                                    />
                                                                    <Label
                                                                        htmlFor={`hari_libur_${opt.value}`}
                                                                        className="cursor-pointer flex-1"
                                                                    >
                                                                        <div className="font-medium">{opt.label}</div>
                                                                        <div className="text-xs text-gray-500">{opt.short}</div>
                                                                    </Label>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {data.hari_libur.length > 0 && (
                                                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                                            <p className="text-sm font-medium mb-1">Hari libur terpilih:</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {data.hari_libur.map((hari) => (
                                                                    <Badge key={hari} variant="secondary" className="gap-1">
                                                                        <Calendar className="h-3 w-3" />
                                                                        {getHariLiburLabel(hari)}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <InputError message={errors.hari_libur} />
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Hari libur akan mempengaruhi penugasan otomatis pada hari tersebut
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Form Buttons */}
                                    <div className="sticky bottom-6 mt-8">
                                        <Card className="shadow-lg">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                    <div className="flex items-center gap-2">
                                                        {processing ? (
                                                            <div className="flex items-center gap-2 text-green-600">
                                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                                <span className="text-sm font-medium">Menyimpan...</span>
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm text-gray-600">
                                                                Pastikan semua data sudah benar sebelum menyimpan
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Link href="/admin/petugas">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                disabled={processing}
                                                            >
                                                                Batal
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            type="submit"
                                                            disabled={processing}
                                                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                                        >
                                                            <Save className="mr-2 h-4 w-4" />
                                                            {processing ? 'Menyimpan...' : 'Simpan Petugas'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </form>
                            </Tabs>
                        </div>

                        {/* Right Column - Preview & Info */}
                        <div className="space-y-6">
                            {/* Preview Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-5 w-5 text-gray-500" />
                                        Preview Petugas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col items-center">
                                        <Avatar className="h-20 w-20 mb-3">
                                            <AvatarFallback className="text-xl bg-gradient-to-r from-green-500 to-green-600 text-white">
                                                {previewName?.charAt(0) || 'P'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <h3 className="text-lg font-bold">{previewName || 'Nama Petugas'}</h3>
                                        <p className="text-sm text-gray-500">{previewEmail || 'email@contoh.com'}</p>

                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <Badge variant={data.is_available ? "default" : "outline"}>
                                                {data.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                                            </Badge>
                                            <Badge variant="outline">
                                                {mode === 'existing' ? 'User Existing' : 'User Baru'}
                                            </Badge>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Wilayah</p>
                                                <p className="font-medium">
                                                    {!data.wilayah_id || data.wilayah_id === '_none'
                                                        ? 'Tidak ada'
                                                        : wilayah.find(w => w.id.toString() === data.wilayah_id)?.nama_wilayah || '-'}
                                                </p>
                                            </div>
                                        </div>

                                        {data.hari_libur.length > 0 && (
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Hari Libur</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {data.hari_libur.map((hari) => (
                                                            <Badge key={hari} variant="outline" className="text-xs">
                                                                {getHariLiburLabel(hari)}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Status & Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BadgeCheck className="h-5 w-5 text-green-500" />
                                        Status Form
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Validasi Form</span>
                                        {isFormValid() ? (
                                            <Badge variant="default" className="bg-green-500">Valid</Badge>
                                        ) : (
                                            <Badge variant="destructive">Belum Lengkap</Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Mode Akun</span>
                                        <Badge variant="outline">
                                            {mode === 'existing' ? 'Pilih User' : 'Buat Baru'}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Status Petugas</span>
                                        <Badge variant={data.is_available ? "default" : "outline"}>
                                            {data.is_available ? 'Aktif' : 'Non-aktif'}
                                        </Badge>
                                    </div>

                                    <Separator />

                                    <div className="text-sm text-gray-600">
                                        <p className="font-medium mb-1">Tips:</p>
                                        <ul className="space-y-1 list-disc pl-4">
                                            <li>Pilih user atau buat akun baru</li>
                                            <li>Hari libur maksimal 3 hari</li>
                                            <li>Wilayah bersifat opsional</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
