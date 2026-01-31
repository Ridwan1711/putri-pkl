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
        $validated = $request->validated();

        if (isset($validated['create_user'])) {
            $user = User::create([
                'name' => $validated['create_user']['name'],
                'email' => $validated['create_user']['email'],
                'password' => $validated['create_user']['password'],
                'role' => 'petugas',
                'is_active' => true,
            ]);
            $validated['user_id'] = $user->id;
            unset($validated['create_user']);
        }

        Petugas::create(collect($validated)->only(['user_id', 'armada_id', 'wilayah_id', 'is_available', 'hari_libur'])->all());

        return redirect()->route('admin.petugas.index')
            ->with('success', 'Petugas berhasil ditambahkan.');
    }

    public function show(Petugas $petuga): Response
    {
        return Inertia::render('admin/petugas/show', [
            'petugas' => $petuga->load(['user', 'armada', 'wilayah', 'penugasan']),
        ]);
    }

    public function edit(Petugas $petuga): Response
    {
        $props = [
            'petugas' => $petuga->load(['user', 'armada', 'wilayah']),
            'users' => User::where('role', 'petugas')
                ->where(function ($q) use ($petuga) {
                    $q->whereDoesntHave('petugas')->orWhere('id', $petuga->user_id);
                })
                ->get(),
            'armada' => Armada::where('status', 'aktif')->get(),
            'wilayah' => Wilayah::where('is_active', true)->get(),
        ];

        return Inertia::render('admin/petugas/edit', $props);
    }

    public function update(UpdatePetugasRequest $request, Petugas $petuga): RedirectResponse
    {
        $petuga->update($request->validated());

        return redirect()->route('admin.petugas.index')
            ->with('success', 'Petugas berhasil diperbarui.');
    }

    public function destroy(Petugas $petuga): RedirectResponse
    {
        $petuga->delete();

        return redirect()->route('admin.petugas.index')
            ->with('success', 'Petugas berhasil dihapus.');
    }
}
