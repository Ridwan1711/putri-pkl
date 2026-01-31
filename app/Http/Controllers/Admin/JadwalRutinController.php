<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Hari;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreJadwalRutinRequest;
use App\Models\Armada;
use App\Models\JadwalRutin;
use App\Models\Petugas;
use App\Models\Wilayah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JadwalRutinController extends Controller
{
    public function index(Request $request): Response
    {
        $query = JadwalRutin::with(['petugas.user', 'armada', 'wilayah'])
            ->when($request->hari, fn ($q, $hari) => $q->where('hari', $hari))
            ->when($request->petugas_id, fn ($q, $id) => $q->where('petugas_id', $id))
            ->orderBy('hari')
            ->orderBy('petugas_id');

        $jadwalRutin = $query->get();

        return Inertia::render('admin/jadwal-rutin/index', [
            'jadwalRutin' => $jadwalRutin,
            'petugas' => Petugas::with('user')->get(),
            'armada' => Armada::where('status', 'aktif')->get(),
            'wilayah' => Wilayah::where('is_active', true)->get(),
            'hariOptions' => Hari::toArray(),
            'filters' => $request->only(['hari', 'petugas_id']),
        ]);
    }

    public function store(StoreJadwalRutinRequest $request): RedirectResponse
    {
        $petugas = Petugas::findOrFail($request->petugas_id);
        if ($petugas->isLibur((int) $request->hari)) {
            return redirect()->back()->withErrors([
                'hari' => 'Petugas ini memiliki hari libur pada hari yang dipilih.',
            ]);
        }

        foreach ($request->wilayah_ids as $wilayahId) {
            JadwalRutin::firstOrCreate(
                [
                    'petugas_id' => $request->petugas_id,
                    'armada_id' => $request->armada_id,
                    'hari' => $request->hari,
                    'wilayah_id' => $wilayahId,
                ]
            );
        }

        return redirect()->back()->with('success', 'Jadwal rutin berhasil ditambahkan.');
    }

    public function destroy(JadwalRutin $jadwalRutin): RedirectResponse
    {
        $jadwalRutin->delete();

        return redirect()->back()->with('success', 'Jadwal rutin berhasil dihapus.');
    }
}
