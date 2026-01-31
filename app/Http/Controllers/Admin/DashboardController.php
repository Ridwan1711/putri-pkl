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
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $statistikBulanan->push([
                'bulan' => $date->format('Y-m'),
                'label' => $date->locale('id')->translatedFormat('M Y'),
                'total' => PengajuanPengangkutan::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
            ]);
        }

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
            ],
        ]);
    }
}
