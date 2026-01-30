<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\Penugasan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $petugas = $request->user()->petugas;

        if (! $petugas) {
            abort(403, 'Anda belum terdaftar sebagai petugas.');
        }

        $penugasanHariIni = Penugasan::where('petugas_id', $petugas->id)
            ->where('status', 'aktif')
            ->whereDate('jadwal_angkut', today())
            ->with(['pengajuanPengangkutan.user', 'pengajuanPengangkutan.wilayah', 'armada'])
            ->get();

        $penugasanMendatang = Penugasan::where('petugas_id', $petugas->id)
            ->where('status', 'aktif')
            ->whereDate('jadwal_angkut', '>', today())
            ->with(['pengajuanPengangkutan.user', 'pengajuanPengangkutan.wilayah', 'armada'])
            ->orderBy('jadwal_angkut')
            ->limit(5)
            ->get();

        return Inertia::render('petugas/dashboard', [
            'penugasan_hari_ini' => $penugasanHariIni,
            'penugasan_mendatang' => $penugasanMendatang,
            'stats' => [
                'total_penugasan_aktif' => Penugasan::where('petugas_id', $petugas->id)->where('status', 'aktif')->count(),
                'penugasan_selesai' => Penugasan::where('petugas_id', $petugas->id)->where('status', 'selesai')->count(),
            ],
        ]);
    }
}
