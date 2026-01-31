<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Armada;
use App\Models\PengajuanPengangkutan;
use App\Models\Penugasan;
use App\Models\Petugas;
use App\Models\Wilayah;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $totalPengajuan = PengajuanPengangkutan::count();
        $wilayahAktif = Wilayah::where('is_active', true)->count();
        $wilayahTidakAktif = Wilayah::where('is_active', false)->count();
        $petugasAktif = Petugas::where('is_available', true)->count();
        $petugasTidakAktif = Petugas::where('is_available', false)->count();

        $sampahTerkumpulKg = (float) Penugasan::sum('total_sampah_terangkut');
        $sampahTerkumpulTon = round($sampahTerkumpulKg / 1000, 3);

        $pengangkutanTerbanyakWilayah = PengajuanPengangkutan::query()
            ->select('wilayah_id')
            ->selectRaw('count(*) as total')
            ->groupBy('wilayah_id')
            ->orderByDesc('total')
            ->with('wilayah:id,nama_wilayah')
            ->first();
        $pengangkutanTerbanyakDesa = $pengangkutanTerbanyakWilayah?->wilayah?->nama_wilayah ?? '-';

        $performa = [
            'menunggu' => PengajuanPengangkutan::where('status', 'diajukan')->count(),
            'diproses' => PengajuanPengangkutan::whereIn('status', ['diverifikasi', 'dijadwalkan'])->count(),
            'dalam_perjalanan' => PengajuanPengangkutan::where('status', 'diangkut')->count(),
            'selesai' => PengajuanPengangkutan::where('status', 'selesai')->count(),
            'gagal' => PengajuanPengangkutan::where('status', 'ditolak')->count(),
        ];

        $statistikBulanan = collect();
        $avgMonthly = (int) ceil(PengajuanPengangkutan::count() / max(1, 12));
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $total = PengajuanPengangkutan::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
            $statistikBulanan->push([
                'bulan' => $date->format('Y-m'),
                'label' => $date->locale('id')->translatedFormat('M Y'),
                'total' => $total,
                'target' => max($avgMonthly, 10),
            ]);
        }

        $pengajuanMingguIni = PengajuanPengangkutan::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count();
        $pengajuanMingguLalu = PengajuanPengangkutan::whereBetween('created_at', [now()->subWeek()->startOfWeek(), now()->subWeek()->endOfWeek()])->count();
        $pertumbuhan = $pengajuanMingguLalu > 0
            ? round((($pengajuanMingguIni - $pengajuanMingguLalu) / $pengajuanMingguLalu) * 100, 1)
            : ($pengajuanMingguIni > 0 ? 100 : 0);

        $statusArmada = Armada::query()
            ->select('status')
            ->selectRaw('count(*) as total')
            ->groupBy('status')
            ->get()
            ->keyBy('status')
            ->map(fn ($row) => (int) $row->total);
        $grafikStatusArmada = [
            'aktif' => $statusArmada->get('aktif', 0),
            'perbaikan' => $statusArmada->get('perbaikan', 0),
            'nonaktif' => $statusArmada->get('nonaktif', 0),
        ];

        $analytics = [
            'pengajuan_per_wilayah' => PengajuanPengangkutan::query()
                ->select('wilayah_id')
                ->selectRaw('count(*) as total')
                ->groupBy('wilayah_id')
                ->with('wilayah:id,nama_wilayah')
                ->orderByDesc('total')
                ->limit(10)
                ->get()
                ->map(fn ($row) => [
                    'wilayah' => $row->wilayah?->nama_wilayah ?? 'Tidak diketahui',
                    'total' => (int) $row->total,
                ])
                ->values()
                ->toArray(),
            'pengajuan_per_hari' => collect([
                ['day' => 1, 'label' => 'Minggu'],
                ['day' => 2, 'label' => 'Senin'],
                ['day' => 3, 'label' => 'Selasa'],
                ['day' => 4, 'label' => 'Rabu'],
                ['day' => 5, 'label' => 'Kamis'],
                ['day' => 6, 'label' => 'Jumat'],
                ['day' => 7, 'label' => 'Sabtu'],
            ])->map(fn ($item) => [
                'hari' => $item['label'],
                'total' => PengajuanPengangkutan::whereRaw('DAYOFWEEK(created_at) = ?', [$item['day']])->count(),
            ])->values()->toArray(),
            'pengajuan_7_hari_terakhir' => collect(range(6, 0))->map(fn ($i) => [
                'tanggal' => now()->subDays($i)->format('Y-m-d'),
                'label' => now()->subDays($i)->locale('id')->translatedFormat('D, d M'),
                'total' => PengajuanPengangkutan::whereDate('created_at', now()->subDays($i))->count(),
            ])->values()->toArray(),
            'sumber_pengajuan' => [
                'guest' => PengajuanPengangkutan::whereNull('user_id')->count(),
                'terdaftar' => PengajuanPengangkutan::whereNotNull('user_id')->count(),
            ],
            'petugas_terproduktif' => Penugasan::query()
                ->select('petugas_id')
                ->selectRaw('count(*) as total')
                ->groupBy('petugas_id')
                ->with('petugas.user:id,name')
                ->orderByDesc('total')
                ->limit(5)
                ->get()
                ->map(fn ($row) => [
                    'nama' => $row->petugas?->user?->name ?? 'Petugas #'.$row->petugas_id,
                    'total' => (int) $row->total,
                ])
                ->values()
                ->toArray(),
            'top_kampung' => PengajuanPengangkutan::query()
                ->select('kampung_id')
                ->selectRaw('count(*) as total')
                ->whereNotNull('kampung_id')
                ->groupBy('kampung_id')
                ->with('kampung:id,nama_kampung')
                ->orderByDesc('total')
                ->limit(8)
                ->get()
                ->map(fn ($row) => [
                    'kampung' => $row->kampung?->nama_kampung ?? '-',
                    'total' => (int) $row->total,
                ])
                ->values()
                ->toArray(),
        ];

        $reports = [
            'ringkasan' => [
                'total_pengajuan' => $totalPengajuan,
                'selesai' => $performa['selesai'],
                'ditolak' => $performa['gagal'],
                'sampah_kg' => round($sampahTerkumpulKg, 2),
                'sampah_ton' => $sampahTerkumpulTon,
                'tanggal_cetak' => now()->locale('id')->translatedFormat('l, d F Y H:i'),
            ],
            'per_wilayah' => Wilayah::query()
                ->withCount('pengajuanPengangkutan')
                ->orderByDesc('pengajuan_pengangkutan_count')
                ->get()
                ->map(fn ($w) => [
                    'nama' => $w->nama_wilayah,
                    'kecamatan' => $w->kecamatan,
                    'total_pengajuan' => $w->pengajuan_pengangkutan_count,
                    'is_active' => $w->is_active,
                ])
                ->toArray(),
            'pengajuan_terbaru' => PengajuanPengangkutan::with(['wilayah:id,nama_wilayah', 'kampung:id,nama_kampung'])
                ->latest()
                ->limit(20)
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'nama_pemohon' => $p->nama_pemohon,
                    'alamat' => $p->alamat_lengkap,
                    'wilayah' => $p->wilayah?->nama_wilayah ?? '-',
                    'kampung' => $p->kampung?->nama_kampung ?? '-',
                    'status' => $p->status,
                    'created_at' => $p->created_at->format('d/m/Y H:i'),
                ])
                ->toArray(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_pengajuan' => $totalPengajuan,
                'wilayah_aktif' => $wilayahAktif,
                'wilayah_tidak_aktif' => $wilayahTidakAktif,
                'petugas_aktif' => $petugasAktif,
                'petugas_tidak_aktif' => $petugasTidakAktif,
                'sampah_terkumpul_ton' => $sampahTerkumpulTon,
                'pengangkutan_terbanyak_desa' => $pengangkutanTerbanyakDesa,
                'performa' => $performa,
                'statistik_bulanan' => $statistikBulanan,
                'grafik_status_armada' => $grafikStatusArmada,
                'pengajuan_minggu_ini' => $pengajuanMingguIni,
                'pengajuan_minggu_lalu' => $pengajuanMingguLalu,
                'pertumbuhan' => $pertumbuhan,
                'rating_kepuasan' => 4.5,
                'analytics' => $analytics,
                'reports' => $reports,
            ],
        ]);
    }
}
