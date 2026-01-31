import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    ChevronDown,
    ClipboardList,
    Package,
    Truck,
    UserCheck,
    Sparkles,
    CheckCircle2,
    Menu,
    Calendar,
} from 'lucide-react';
import { dashboard, login, register, home } from '@/routes';
import { store as storeGuestPengajuan } from '@/routes/pengajuan/guest';
import type { SharedData } from '@/types';
import type { Wilayah } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { MapPicker } from '@/components/map/MapPicker';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useForm } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
    wilayah = [],
}: {
    canRegister?: boolean;
    wilayah?: Wilayah[];
}) {
    const { auth, flash } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const guestForm = useForm({
        nama_pemohon: '',
        no_telepon: '',
        email: '',
        wilayah_id: '',
        alamat_lengkap: '',
        latitude: null as number | null,
        longitude: null as number | null,
        estimasi_volume: '',
        foto_sampah: null as File | null,
    });

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    return (
        <>
            <Head title="Laporin - Pengangkutan Sampah Mudah" />

            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
                {/* Navbar */}
                <nav className="sticky top-0 z-50 border-b border-green-100/80 bg-white/90 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <Link href={home()} className="flex items-center gap-1">
                            <img src="/images/logo.png" alt="Laporin" className="h-10" />
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden items-center gap-8 md:flex">
                            <button
                                onClick={() => scrollToSection('ajukan')}
                                className="text-sm font-medium text-gray-600 transition hover:text-green-600"
                            >
                                Ajukan
                            </button>
                            <button
                                onClick={() => scrollToSection('cara-kerja')}
                                className="text-sm font-medium text-gray-600 transition hover:text-green-600"
                            >
                                Cara Kerja
                            </button>
                            <button
                                onClick={() => scrollToSection('keuntungan')}
                                className="text-sm font-medium text-gray-600 transition hover:text-green-600"
                            >
                                Keuntungan
                            </button>
                            <button
                                onClick={() => scrollToSection('faq')}
                                className="text-sm font-medium text-gray-600 transition hover:text-green-600"
                            >
                                FAQ
                            </button>
                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link href={dashboard()}>
                                        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                                            Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={login()}>
                                            <Button variant="outline" size="sm">
                                                Login
                                            </Button>
                                        </Link>
                                        {canRegister && (
                                            <Link href={register()}>
                                                <Button className="bg-gradient-to-r from-green-500 to-amber-500 hover:from-green-600 hover:to-amber-600">
                                                    Daftar
                                                </Button>
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        <div className="flex items-center gap-2 md:hidden">
                            {auth.user ? (
                                <Link href={dashboard()}>
                                    <Button size="sm" className="bg-gradient-to-r from-green-500 to-amber-500">
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()}>
                                        <Button
                                            size="sm"
                                            className="bg-gradient-to-r from-green-500 to-amber-500 text-white hover:from-green-600 hover:to-amber-600"
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                    {canRegister && (
                                        <Link href={register()}>
                                            <Button size="sm" variant="outline">
                                                Daftar
                                            </Button>
                                        </Link>
                                    )}
                                </>
                            )}
                            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[280px]">
                                    <SheetHeader>
                                        <SheetTitle>Menu</SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-6 flex flex-col gap-2">
                                        <Button
                                            variant="ghost"
                                            className="justify-start"
                                            onClick={() => scrollToSection('ajukan')}
                                        >
                                            Ajukan
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="justify-start"
                                            onClick={() => scrollToSection('cara-kerja')}
                                        >
                                            Cara Kerja
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="justify-start"
                                            onClick={() => scrollToSection('keuntungan')}
                                        >
                                            Keuntungan
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="justify-start"
                                            onClick={() => scrollToSection('faq')}
                                        >
                                            FAQ
                                        </Button>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </nav>

                <main>
                    <section className="relative min-h-[75vh] overflow-hidden md:min-h-[85vh]">
                        {/* Background image - dump/placeholder, ganti dengan foto real nanti */}
                        <img
                            src="/images/kebersihan.jpg"
                            alt="Kebersihan lingkungan"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        {/* Dark green overlay */}
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/30 to-[#000000]/90"
                            aria-hidden
                        />
                        {/* Content overlay */}
                        <div className="relative z-10 flex flex-col justify-end px-4 pb-8 pt-20 sm:px-6 sm:pb-12 md:min-h-[85vh] md:px-8 md:pb-16">
                            <div className="mx-auto grid grid-cols-2 md:grid-cols-1 gap-4 w-full max-w-2xl">
                                <div>
                                    <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-4xl lg:text-5xl">
                                        <span className="bg-gradient-to-r from-green-600 via-green-400 to-amber-400 bg-clip-text text-transparent">SOLUSI DIGITAL CERDAS</span>
                                        <br />
                                        LAYANAN SAMPAH MASYARAKAT
                                    </h1>
                                    <p className="mt-4 text-sm leading-relaxed text-white/95 sm:text-base md:text-lg">
                                        Memberikan layanan cepat, efesien, dan terintegrasi dalam pengelolaan persampahan modern.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </section>
                    {/* Hero Section - Full bleed dengan overlay seperti referensi mobile */}


                    {/* Form Pengajuan Guest */}
                    <section id="ajukan" className="border-t border-green-100/50 bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                        <div className="mx-auto max-w-2xl">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    Ajukan Pengangkutan Sampah
                                </h2>
                                <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-amber-400" />
                                <p className="mx-auto mt-4 text-gray-600">
                                    Isi form berikut untuk mengajukan pengangkutan tanpa perlu login.
                                </p>
                                {auth.user?.role === 'warga' && (
                                    <p className="mt-2 text-sm text-green-600">
                                        Atau kelola pengajuan di{' '}
                                        <Link href={dashboard()} className="font-medium underline">
                                            Dashboard
                                        </Link>
                                    </p>
                                )}
                            </div>
                            {flash?.success && (
                                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                                    {flash.success}
                                </div>
                            )}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    guestForm.post(storeGuestPengajuan.url(), {
                                        forceFormData: true,
                                    });
                                }}
                                className="mt-8 space-y-6"
                            >
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="nama_pemohon">Nama Pemohon</Label>
                                        <Input
                                            id="nama_pemohon"
                                            value={guestForm.data.nama_pemohon}
                                            onChange={(e) => guestForm.setData('nama_pemohon', e.target.value)}
                                            required
                                            placeholder="Nama lengkap"
                                        />
                                        <InputError message={guestForm.errors.nama_pemohon} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="no_telepon">No. Telepon</Label>
                                        <Input
                                            id="no_telepon"
                                            type="tel"
                                            value={guestForm.data.no_telepon}
                                            onChange={(e) => guestForm.setData('no_telepon', e.target.value)}
                                            required
                                            placeholder="08xxxxxxxxxx"
                                        />
                                        <InputError message={guestForm.errors.no_telepon} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={guestForm.data.email}
                                        onChange={(e) => guestForm.setData('email', e.target.value)}
                                        required
                                        placeholder="email@example.com"
                                    />
                                    <InputError message={guestForm.errors.email} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="wilayah_id">Wilayah</Label>
                                    <Select
                                        value={guestForm.data.wilayah_id}
                                        onValueChange={(value) => guestForm.setData('wilayah_id', value)}
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
                                    <InputError message={guestForm.errors.wilayah_id} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="alamat_lengkap">Alamat Lengkap</Label>
                                    <Input
                                        id="alamat_lengkap"
                                        value={guestForm.data.alamat_lengkap}
                                        onChange={(e) => guestForm.setData('alamat_lengkap', e.target.value)}
                                        required
                                        placeholder="Alamat lengkap lokasi pengangkutan"
                                    />
                                    <InputError message={guestForm.errors.alamat_lengkap} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Pilih Lokasi di Peta</Label>
                                    <MapPicker
                                        latitude={guestForm.data.latitude}
                                        longitude={guestForm.data.longitude}
                                        onLocationSelect={(lat, lng) =>
                                            guestForm.setData({ ...guestForm.data, latitude: lat, longitude: lng })
                                        }
                                        height="250px"
                                    />
                                    <InputError message={guestForm.errors.latitude || guestForm.errors.longitude} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="estimasi_volume">Estimasi Volume</Label>
                                    <Input
                                        id="estimasi_volume"
                                        value={guestForm.data.estimasi_volume}
                                        onChange={(e) => guestForm.setData('estimasi_volume', e.target.value)}
                                        placeholder="Contoh: 2 m³"
                                    />
                                    <InputError message={guestForm.errors.estimasi_volume} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="foto_sampah">Foto Sampah (wajib)</Label>
                                    <Input
                                        id="foto_sampah"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            guestForm.setData('foto_sampah', e.target.files?.[0] || null)
                                        }
                                        required
                                    />
                                    <InputError message={guestForm.errors.foto_sampah} />
                                </div>
                                <Button type="submit" disabled={guestForm.processing} className="w-full">
                                    {guestForm.processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                                </Button>
                            </form>
                        </div>
                    </section>

                    {/* Cara Kerja */}
                    <section id="cara-kerja" className="border-t border-green-100/50 bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    Cara Kerja
                                </h2>
                                <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-amber-400" />
                                <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                                    Empat langkah mudah untuk mengajukan pengangkutan sampah
                                </p>
                            </div>
                            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    
                                    {
                                        step: '01',
                                        icon: ClipboardList,
                                        title: 'Ajukan Pengajuan',
                                        desc: 'Isi form pengajuan dengan alamat dan estimasi volume sampah.',
                                    },
                                    {
                                        step: '02',
                                        icon: Truck,
                                        title: 'Petugas Jemput',
                                        desc: 'Petugas akan datang sesuai jadwal yang telah ditentukan.',
                                    },
                                    {
                                        step: '03',
                                        icon: CheckCircle2,
                                        title: 'Selesai',
                                        desc: 'Sampah diangkut ke tempat pengolahan. Lingkungan Anda bersih!',
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={item.step}
                                        className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-green-200 hover:shadow-lg"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                    >
                                        <span className="text-4xl font-bold text-green-600 group-hover:text-green-200">
                                            {item.step}
                                        </span>
                                        <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 group-hover:bg-green-200">
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="mt-4 font-semibold text-gray-900">{item.title}</h3>
                                        <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Cara Menyiapkan Sampah */}
                    <section className="border-t border-green-100/50 bg-green-50/30 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    Cara Menyiapkan Sampah
                                </h2>
                                <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-amber-400" />
                                <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                                    Persiapan yang benar memudahkan proses pengangkutan
                                </p>
                            </div>
                            <div className="relative mx-auto mt-12 max-w-2xl">
                                <div className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
                                    <img
                                        src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=600&auto=format&fit=crop"
                                        alt="Wanita memilah sampah"
                                        className="h-48 w-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
                                {[
                                    {
                                        num: '01',
                                        title: 'Bersihkan Sampah',
                                        desc: 'Pastikan sampah yang akan dikirim dalam keadaan bersih guna menghindari penyebaran kuman.',
                                    },
                                    {
                                        num: '02',
                                        title: 'Pastikan Sampah Kering',
                                        desc: 'Sampah yang akan dikirimkan harus dalam keadaan kering, tidak basah, atau pun lembab.',
                                    },
                                    {
                                        num: '03',
                                        title: 'Remas dan Lipat',
                                        desc: 'Remas dan lipat sampah untuk memaksimalkan ruang dan volume pengiriman.',
                                    },
                                    {
                                        num: '04',
                                        title: 'Kemas Rapih',
                                        desc: 'Kemas sampah menggunakan kardus atau kemasan lain. Jangan lupa tulis kode SYW pada paket.',
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.num}
                                        className="flex gap-4 rounded-xl border border-green-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 font-bold text-green-700">
                                            {item.num}
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                            <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className="relative min-h-[75vh] overflow-hidden md:min-h-[85vh]">
                        {/* Background image - dump/placeholder, ganti dengan foto real nanti */}
                        <img
                            src="/images/kebersihan.jpg"
                            alt="Kebersihan lingkungan"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        {/* Dark green overlay */}
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/30 to-[#000000]/90"
                            aria-hidden
                        />
                        {/* Content overlay */}
                        <div className="relative z-10 flex min-h-[75vh] flex-col justify-end px-4 pb-8 pt-20 sm:px-6 sm:pb-12 md:min-h-[85vh] md:px-8 md:pb-16">
                            <div className="mx-auto grid grid-cols-2 md:grid-cols-1 gap-4 w-full max-w-2xl">
                                <div>
                                    <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                                        <span className="text-emerald-300">Kelola Sampah</span>
                                        <br />
                                        Kini Lebih Mudah dan Praktis
                                    </h1>
                                    <p className="mt-4 text-sm leading-relaxed text-white/95 sm:text-base md:text-lg">
                                        Mari mulai kebiasaan baik dengan memilah sampah sejak dari rumah. Laporin membantu
                                        Anda mengirimkan sampah anorganik secara mudah dan teratur. Ajukan pengangkutan
                                        sampah Anda sekarang untuk wilayah Kecamatan Singaparna.
                                    </p>
                                </div>
                                <div className="mt-6">
                                    <Button
                                        size="lg"
                                        onClick={() => scrollToSection('ajukan')}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-base font-semibold hover:from-green-600 hover:to-emerald-700 sm:w-auto sm:px-8"
                                    >
                                        Ajukan Pengangkutan
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PENCAPAIAN KAMI - Card overlapping hero */}
                    <section className="relative z-20 px-4 -mt-12 sm:px-6 md:px-8">
                        <div className="mx-auto max-w-4xl">
                            <div className="overflow-hidden rounded-2xl border border-green-100 bg-white p-6 shadow-xl sm:p-8">
                                <h2 className="text-center text-lg font-bold uppercase tracking-wide text-green-700 sm:text-xl">
                                    Pencapaian Kami
                                </h2>
                                <p className="mt-1 text-center text-sm text-gray-500">Dampak Nyata dari Partisipasi Anda</p>
                                <div className="mt-6 flex flex-wrap justify-center gap-8 sm:gap-12">
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-green-600 sm:text-4xl">24+</p>
                                        <p className="mt-1 text-sm text-gray-500">Pengajuan Pengangkutan</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-green-600 sm:text-4xl">10+</p>
                                        <p className="mt-1 text-sm text-gray-500">Wilayah Tercover</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-green-600 sm:text-4xl">24/7</p>
                                        <p className="mt-1 text-sm text-gray-500">Layanan Online</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Keuntungan */}
                    <section id="keuntungan" className="border-t border-green-100/50 bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    Keuntungan
                                </h2>
                                <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-amber-400" />
                            </div>
                            <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
                                {[
                                    {
                                        icon: Calendar,
                                        title: 'Pengangkutan Terjadwal',
                                        desc: 'Pengajuan pengangkutan sampah dilakukan tepat waktu sesuai permintaan Anda.',
                                    },
                                    {
                                        icon: UserCheck,
                                        title: 'Petugas Berpengalaman',
                                        desc: 'Proses pengangkutan dilakukan oleh tim profesional yang aman dan terpercaya.',
                                    },
                                    {
                                        icon: Sparkles,
                                        title: 'Lebih Bersih & Rapi',
                                        desc: 'Sampah langsung diangkut ke tempat pengolahan sehingga area rumah tetap nyaman.',
                                    },
                                    {
                                        icon: Package,
                                        title: 'Pengajuan Sangat Mudah',
                                        desc: 'Anda cukup ajukan melalui aplikasi/website dan petugas akan segera menindaklanjuti.',
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-green-200 hover:shadow-lg"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-green-600">
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                            <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section id="faq" className="border-t border-green-100/50 bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                        <div className="mx-auto max-w-3xl">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    F.A.Q
                                </h2>
                                <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-amber-400" />
                                <p className="mt-4 text-gray-600">Pertanyaan yang paling sering ditanyakan</p>
                            </div>
                            <div className="mt-12 space-y-3">
                                {[
                                    {
                                        q: 'Apa saja jenis sampah yang dapat dikirimkan?',
                                        a: 'Kami menerima sampah anorganik seperti plastik, kertas, kardus, dan logam yang sudah dipilah.',
                                    },
                                    {
                                        q: 'Bagaimana cara mengemas sampah sebelum dikirim?',
                                        a: 'Pastikan sampah bersih, kering, dan dipadatkan sebelum dimasukkan ke dalam kardus atau karung.',
                                    },
                                    {
                                        q: 'Di mana titik pengumpulan sampah tersedia?',
                                        a: 'Titik pengumpulan tersedia di setiap kecamatan yang bekerja sama dengan kami. Cek peta di aplikasi.',
                                    },
                                    {
                                        q: 'Apakah ada biaya pengangkutan?',
                                        a: 'Layanan ini gratis untuk rumah tangga dengan volume standar. Biaya mungkin berlaku untuk volume industri.',
                                    },
                                ].map((item) => (
                                    <details
                                        key={item.q}
                                        className="group rounded-xl border border-gray-100 bg-white shadow-sm"
                                    >
                                        <summary className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50">
                                            <h4 className="font-semibold text-gray-800">{item.q}</h4>
                                            <ChevronDown className="h-5 w-5 shrink-0 text-green-600 transition-transform group-open:rotate-180" />
                                        </summary>
                                        <div className="border-t border-gray-100 px-4 pb-4 pt-2 text-sm text-gray-600">
                                            {item.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="border-t border-green-100/50 bg-gradient-to-b from-green-50 to-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                Siap Mengajukan Pengangkutan?
                            </h2>
                            <p className="mt-4 text-gray-600">
                                Daftar sekarang dan nikmati layanan pengangkutan sampah yang mudah dan terjadwal.
                            </p>
                            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                {auth.user ? (
                                    <Link href={dashboard()}>
                                        <Button
                                            size="lg"
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                        >
                                            Buka Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        {canRegister && (
                                            <Link href={register()}>
                                                <Button
                                                    size="lg"
                                                    className="w-full bg-gradient-to-r from-green-500 to-amber-500 sm:w-auto"
                                                >
                                                    Daftar Sekarang
                                                </Button>
                                            </Link>
                                        )}
                                        <Link href={login()}>
                                            <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                                Login
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="border-t border-green-100 bg-green-800 px-4 py-6 text-center">
                        <div className="mx-auto max-w-7xl">
                            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-green-100">
                                <Link href={home()} className="hover:text-white">
                                    Beranda
                                </Link>
                                <button
                                    onClick={() => scrollToSection('ajukan')}
                                    className="hover:text-white"
                                >
                                    Ajukan
                                </button>
                                <button
                                    onClick={() => scrollToSection('faq')}
                                    className="hover:text-white"
                                >
                                    FAQ
                                </button>
                                {!auth.user && (
                                    <Link href={login()} className="hover:text-white">
                                        Login
                                    </Link>
                                )}
                            </div>
                            <p className="mt-4 text-xs text-green-200">
                                &copy; {new Date().getFullYear()} Laporin. Bidang Lingkungan Hidup Kabupaten Tasikmalaya.
                            </p>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}
