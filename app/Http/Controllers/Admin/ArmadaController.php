<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreArmadaRequest;
use App\Http\Requests\Admin\UpdateArmadaRequest;
use App\Models\Armada;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArmadaController extends Controller
{
    public function index(Request $request): Response
    {
        $armada = Armada::query()
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
        return Inertia::render('admin/armada/create');
    }

    public function store(StoreArmadaRequest $request): RedirectResponse
    {
        Armada::create($request->validated());

        return redirect()->route('admin.armada.index')
            ->with('success', 'Armada berhasil ditambahkan.');
    }

    public function show(Armada $armada): Response
    {
        return Inertia::render('admin/armada/show', [
            'armada' => $armada->load(['petugas', 'penugasan']),
        ]);
    }

    public function edit(Armada $armada): Response
    {
        return Inertia::render('admin/armada/edit', [
            'armada' => $armada,
        ]);
    }

    public function update(UpdateArmadaRequest $request, Armada $armada): RedirectResponse
    {
        $armada->update($request->validated());

        return redirect()->route('admin.armada.index')
            ->with('success', 'Armada berhasil diperbarui.');
    }

    public function destroy(Armada $armada): RedirectResponse
    {
        $armada->delete();

        return redirect()->route('admin.armada.index')
            ->with('success', 'Armada berhasil dihapus.');
    }
}
