<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\PengajuanPengangkutan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanController extends Controller
{
    public function index(Request $request): Response
    {
        $petugas = $request->user()->petugas;

        if (! $petugas) {
            abort(403, 'Anda belum terdaftar sebagai petugas.');
        }

        $pengajuan = PengajuanPengangkutan::where('wilayah_id', $petugas->wilayah_id)
            ->with(['user', 'wilayah', 'penugasan'])
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(15);

        return Inertia::render('petugas/pengajuan/index', [
            'pengajuan' => $pengajuan,
            'filters' => $request->only(['status']),
        ]);
    }
}
