<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\Penugasan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PetaController extends Controller
{
    public function index(Request $request): Response
    {
        $petugas = $request->user()->petugas;

        if (! $petugas) {
            abort(403, 'Anda belum terdaftar sebagai petugas.');
        }

        $penugasan = Penugasan::where('petugas_id', $petugas->id)
            ->with(['pengajuanPengangkutan.wilayah'])
            ->get();

        $markers = $penugasan
            ->filter(fn ($p) => $p->pengajuanPengangkutan?->latitude && $p->pengajuanPengangkutan?->longitude)
            ->map(fn ($p) => [
                'id' => $p->id,
                'lat' => (float) $p->pengajuanPengangkutan->latitude,
                'lng' => (float) $p->pengajuanPengangkutan->longitude,
                'status' => $p->pengajuanPengangkutan->status ?? $p->status,
                'alamat' => $p->pengajuanPengangkutan->alamat_lengkap ?? '',
            ])
            ->values();

        return Inertia::render('petugas/peta/index', [
            'markers' => $markers,
            'total' => $markers->count(),
        ]);
    }
}
