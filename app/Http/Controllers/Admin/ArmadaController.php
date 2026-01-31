<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreArmadaRequest;
use App\Http\Requests\Admin\UpdateArmadaRequest;
use App\Models\Armada;
use App\Models\Wilayah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArmadaController extends Controller
{
    public function index(Request $request): Response
    {
        $armada = Armada::with('wilayah')
            ->when($request->search, fn ($query, $search) => $query->where('kode_armada', 'like', "%{$search}%")
                ->orWhere('plat_nomor', 'like', "%{$search}%")
                ->orWhere('jenis_kendaraan', 'like', "%{$search}%"))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/armada/index', [
            'armada' => $armada,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/armada/create', [
            'wilayah' => Wilayah::where('is_active', true)->get(),
        ]);
    }

    public function store(StoreArmadaRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $anggota = $data['anggota'] ?? [];
        unset($data['anggota']);
        $armada = Armada::create($data);
        foreach ($anggota as $i => $a) {
            if (! empty($a['nama'] ?? null)) {
                $armada->anggota()->create([
                    'nama' => $a['nama'],
                    'no_hp' => $a['no_hp'] ?? null,
                    'urutan' => $i,
                ]);
            }
        }

        return redirect()->route('admin.armada.index')
            ->with('success', 'Armada berhasil ditambahkan.');
    }

    public function show(Armada $armada): Response
    {
        return Inertia::render('admin/armada/show', [
            'armada' => $armada->load(['wilayah', 'anggota', 'petugas.user', 'petugas.wilayah', 'penugasan.pengajuanPengangkutan', 'penugasan.petugas.user']),
        ]);
    }

    public function edit(Armada $armada): Response
    {
        return Inertia::render('admin/armada/edit', [
            'armada' => $armada->load('anggota'),
            'wilayah' => Wilayah::where('is_active', true)->get(),
        ]);
    }

    public function update(UpdateArmadaRequest $request, Armada $armada): RedirectResponse
    {
        $data = $request->validated();
        $anggota = $data['anggota'] ?? [];
        unset($data['anggota']);
        $armada->update($data);
        $armada->anggota()->delete();
        foreach ($anggota as $i => $a) {
            if (! empty($a['nama'] ?? null)) {
                $armada->anggota()->create([
                    'nama' => $a['nama'],
                    'no_hp' => $a['no_hp'] ?? null,
                    'urutan' => $i,
                ]);
            }
        }

        return redirect()->route('admin.armada.index')
            ->with('success', 'Armada berhasil diperbarui.');
    }

    public function destroy(Armada $armada): RedirectResponse
    {
        $armada->delete();

        return redirect()->route('admin.armada.index')
            ->with('success', 'Armada berhasil dihapus.');
    }

    public function updateStatus(Request $request, Armada $armada): RedirectResponse
    {
        $request->validate(['status' => ['required', 'in:aktif,perbaikan,nonaktif']]);
        $armada->update(['status' => $request->status]);

        return back()->with('success', 'Status armada berhasil diperbarui.');
    }
}
