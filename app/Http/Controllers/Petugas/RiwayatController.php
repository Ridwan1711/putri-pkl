<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\Penugasan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RiwayatController extends Controller
{
    public function index(Request $request): Response
    {
        $petugas = $request->user()->petugas;

        if (! $petugas) {
            abort(403, 'Anda belum terdaftar sebagai petugas.');
        }

        $penugasan = Penugasan::where('petugas_id', $petugas->id)
            ->whereIn('status', ['selesai', 'batal'])
            ->with(['pengajuanPengangkutan.user', 'pengajuanPengangkutan.wilayah'])
            ->when($request->tanggal, fn ($q, $t) => $q->whereDate('jadwal_angkut', $t))
            ->latest('jadwal_angkut')
            ->paginate(15);

        return Inertia::render('petugas/riwayat/index', [
            'penugasan' => $penugasan,
            'filters' => $request->only(['tanggal']),
        ]);
    }
}
