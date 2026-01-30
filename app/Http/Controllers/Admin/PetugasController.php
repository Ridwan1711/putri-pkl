<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePetugasRequest;
use App\Http\Requests\Admin\UpdatePetugasRequest;
use App\Models\Armada;
use App\Models\Petugas;
use App\Models\User;
use App\Models\Wilayah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PetugasController extends Controller
{
    public function index(Request $request): Response
    {
        $petugas = Petugas::with(['user', 'armada', 'wilayah'])
            ->when($request->search, fn ($query, $search) => $query->whereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->wilayah_id, fn ($query, $wilayahId) => $query->where('wilayah_id', $wilayahId))
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/petugas/index', [
            'petugas' => $petugas,
            'wilayah' => Wilayah::where('is_active', true)->get(),
            'filters' => $request->only(['search', 'wilayah_id']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/petugas/create', [
            'users' => User::where('role', 'petugas')->whereDoesntHave('petugas')->get(),
            'armada' => Armada::where('status', 'aktif')->get(),
            'wilayah' => Wilayah::where('is_active', true)->get(),
        ]);
    }

    public function store(StorePetugasRequest $request): RedirectResponse
    {
        Petugas::create($request->validated());

        return redirect()->route('admin.petugas.index')
            ->with('success', 'Petugas berhasil ditambahkan.');
    }

    public function show(Petugas $petugas): Response
    {
        return Inertia::render('admin/petugas/show', [
            'petugas' => $petugas->load(['user', 'armada', 'wilayah', 'penugasan']),
        ]);
    }

    public function edit(Petugas $petugas): Response
    {
        return Inertia::render('admin/petugas/edit', [
            'petugas' => $petugas->load(['user', 'armada', 'wilayah']),
            'users' => User::where('role', 'petugas')->whereDoesntHave('petugas')->orWhere('id', $petugas->user_id)->get(),
            'armada' => Armada::where('status', 'aktif')->get(),
            'wilayah' => Wilayah::where('is_active', true)->get(),
        ]);
    }

    public function update(UpdatePetugasRequest $request, Petugas $petugas): RedirectResponse
    {
        $petugas->update($request->validated());

        return redirect()->route('admin.petugas.index')
            ->with('success', 'Petugas berhasil diperbarui.');
    }

    public function destroy(Petugas $petugas): RedirectResponse
    {
        $petugas->delete();

        return redirect()->route('admin.petugas.index')
            ->with('success', 'Petugas berhasil dihapus.');
    }
}
