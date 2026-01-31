<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreWilayahRequest;
use App\Http\Requests\Admin\UpdateWilayahRequest;
use App\Models\Wilayah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WilayahController extends Controller
{
    public function index(Request $request): Response
    {
        $wilayah = Wilayah::query()
            ->when($request->search, fn ($query, $search) => $query->where('nama_wilayah', 'like', "%{$search}%")
                ->orWhere('kecamatan', 'like', "%{$search}%"))
            ->with('kampung')
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/wilayah/index', [
            'wilayah' => $wilayah,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/wilayah/create');
    }

    public function store(StoreWilayahRequest $request): RedirectResponse
    {
        Wilayah::create($request->validated());

        return redirect()->route('admin.wilayah.index')
            ->with('success', 'Wilayah berhasil ditambahkan.');
    }

    public function show(Wilayah $wilayah): Response
    {
        return Inertia::render('admin/wilayah/show', [
            'wilayah' => $wilayah->load(['petugas.user', 'petugas.armada', 'kampung', 'pengajuanPengangkutan', 'armada']),
        ]);
    }

    public function edit(Wilayah $wilayah): Response
    {
        return Inertia::render('admin/wilayah/edit', [
            'wilayah' => $wilayah,
        ]);
    }

    public function update(UpdateWilayahRequest $request, Wilayah $wilayah): RedirectResponse
    {
        $wilayah->update($request->validated());

        return redirect()->route('admin.wilayah.index')
            ->with('success', 'Wilayah berhasil diperbarui.');
    }

    public function destroy(Wilayah $wilayah): RedirectResponse
    {
        $wilayah->delete();

        return redirect()->route('admin.wilayah.index')
            ->with('success', 'Wilayah berhasil dihapus.');
    }
}
