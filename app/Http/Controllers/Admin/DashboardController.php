<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Armada;
use App\Models\PengajuanPengangkutan;
use App\Models\Petugas;
use App\Models\Wilayah;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_wilayah' => Wilayah::where('is_active', true)->count(),
                'total_armada' => Armada::where('status', 'aktif')->count(),
                'total_petugas' => Petugas::where('is_available', true)->count(),
                'pengajuan_diajukan' => PengajuanPengangkutan::where('status', 'diajukan')->count(),
                'pengajuan_dijadwalkan' => PengajuanPengangkutan::where('status', 'dijadwalkan')->count(),
                'pengajuan_selesai' => PengajuanPengangkutan::where('status', 'selesai')->count(),
            ],
        ]);
    }
}
