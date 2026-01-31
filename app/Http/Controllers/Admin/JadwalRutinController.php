<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Hari;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreJadwalRutinRequest;
use App\Models\Armada;
use App\Models\JadwalRutin;
use App\Models\Wilayah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JadwalRutinController extends Controller
{
    public function index(Request $request): Response
    {
        $query = JadwalRutin::with(['armada.wilayah', 'armada.petugas.user', 'kampung'])
            ->when($request->hari, fn ($q, $hari) => $q->where('hari', $hari))
            ->when($request->armada_id, fn ($q, $id) => $q->where('armada_id', $id))
            ->orderBy('hari')
            ->orderBy('armada_id');

        $jadwalRutin = $query->get();

        return Inertia::render('admin/jadwal-rutin/index', [
            'jadwalRutin' => $jadwalRutin,
            'armada' => Armada::with('wilayah')->where('status', 'aktif')->whereNotNull('wilayah_id')->get(),
            'wilayah' => Wilayah::with('kampung')->where('is_active', true)->get(),
            'hariOptions' => Hari::toArray(),
            'filters' => $request->only(['hari', 'armada_id']),
        ]);
    }

    public function store(StoreJadwalRutinRequest $request): RedirectResponse
    {
        $armada = Armada::with('petugas')->findOrFail($request->armada_id);
        $petugas = $armada->petugas->first();
        if ($petugas && $petugas->isLibur((int) $request->hari)) {
            return redirect()->back()->withErrors([
                'hari' => 'Petugas/leader armada ini libur pada hari yang dipilih.',
            ]);
        }

        $jadwal = JadwalRutin::updateOrCreate(
            [
                'armada_id' => $request->armada_id,
                'hari' => $request->hari,
            ],
            []
        );

        $sync = [];
        foreach ($request->kampung_ids as $i => $kampungId) {
            $sync[$kampungId] = ['urutan' => $i];
        }
        $jadwal->kampung()->sync($sync);

        return redirect()->back()->with('success', 'Jadwal rutin berhasil ditambahkan.');
    }

    public function destroy(JadwalRutin $jadwalRutin): RedirectResponse
    {
        $jadwalRutin->delete();

        return redirect()->back()->with('success', 'Jadwal rutin berhasil dihapus.');
    }
}
