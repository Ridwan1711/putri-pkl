<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\JadwalRutin;
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

        $hari = (int) now()->format('N');
        $jadwalHariIni = JadwalRutin::where('armada_id', $petugas->armada_id)
            ->hari($hari)
            ->with(['kampung' => fn ($q) => $q->orderByPivot('urutan')])
            ->first();

        $routePoints = [];
        if ($jadwalHariIni && $jadwalHariIni->kampung) {
            foreach ($jadwalHariIni->kampung as $k) {
                if ($k->latitude && $k->longitude) {
                    $routePoints[] = [
                        'lat' => (float) $k->latitude,
                        'lng' => (float) $k->longitude,
                    ];
                }
            }
        }

        return Inertia::render('petugas/peta/index', [
            'markers' => $markers,
            'routePoints' => $routePoints,
            'total' => $markers->count(),
        ]);
    }
}
