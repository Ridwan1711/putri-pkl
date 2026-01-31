<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\Penugasan;
use App\Models\Wilayah;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UpdateStatusController extends Controller
{
    public function index(Request $request): Response
    {
        $petugas = $request->user()->petugas;

        if (! $petugas) {
            abort(403, 'Anda belum terdaftar sebagai petugas.');
        }

        $penugasan = Penugasan::where('petugas_id', $petugas->id)
            ->with(['pengajuanPengangkutan.user', 'pengajuanPengangkutan.wilayah'])
            ->when($request->status, fn ($q, $s) => $q->whereHas('pengajuanPengangkutan', fn ($pq) => $pq->where('status', $s)))
            ->when($request->wilayah_id, fn ($q, $w) => $q->whereHas('pengajuanPengangkutan', fn ($pq) => $pq->where('wilayah_id', $w)))
            ->latest('jadwal_angkut')
            ->paginate(15);

        return Inertia::render('petugas/update-status/index', [
            'penugasan' => $penugasan,
            'wilayah' => Wilayah::where('is_active', true)->get(),
            'filters' => $request->only(['status', 'wilayah_id']),
        ]);
    }
}
