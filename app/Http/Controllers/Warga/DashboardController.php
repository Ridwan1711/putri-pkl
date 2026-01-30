<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use App\Models\Aduan;
use App\Models\PengajuanPengangkutan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $pengajuanTerbaru = PengajuanPengangkutan::where('user_id', $user->id)
            ->with(['wilayah', 'penugasan.petugas.user'])
            ->latest()
            ->limit(5)
            ->get();

        $aduanTerbaru = Aduan::where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('warga/dashboard', [
            'pengajuan_terbaru' => $pengajuanTerbaru,
            'aduan_terbaru' => $aduanTerbaru,
            'stats' => [
                'total_pengajuan' => PengajuanPengangkutan::where('user_id', $user->id)->count(),
                'pengajuan_selesai' => PengajuanPengangkutan::where('user_id', $user->id)->where('status', 'selesai')->count(),
                'total_aduan' => Aduan::where('user_id', $user->id)->count(),
                'aduan_selesai' => Aduan::where('user_id', $user->id)->where('status', 'selesai')->count(),
            ],
        ]);
    }
}
