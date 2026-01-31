<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreKampungRequest;
use App\Http\Requests\Admin\UpdateKampungRequest;
use App\Models\Kampung;
use App\Models\Wilayah;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class KampungController extends Controller
{
    public function index(Wilayah $wilayah): Response
    {
        $kampung = $wilayah->kampung()->orderBy('urutan_rute')->orderBy('nama_kampung')->get();

        return Inertia::render('admin/kampung/index', [
            'wilayah' => $wilayah,
            'kampung' => $kampung,
        ]);
    }

    public function create(Wilayah $wilayah): Response
    {
        return Inertia::render('admin/kampung/create', [
            'wilayah' => $wilayah,
        ]);
    }

    public function store(StoreKampungRequest $request, Wilayah $wilayah): RedirectResponse
    {
        $wilayah->kampung()->create($request->validated());

        return redirect()->route('admin.wilayah.kampung.index', $wilayah)
            ->with('success', 'Kampung berhasil ditambahkan.');
    }

    public function edit(Wilayah $wilayah, Kampung $kampung): Response
    {
        abort_if($kampung->wilayah_id !== $wilayah->id, 404);

        return Inertia::render('admin/kampung/edit', [
            'wilayah' => $wilayah,
            'kampung' => $kampung,
        ]);
    }

    public function update(UpdateKampungRequest $request, Wilayah $wilayah, Kampung $kampung): RedirectResponse
    {
        abort_if($kampung->wilayah_id !== $wilayah->id, 404);
        $kampung->update($request->validated());

        return redirect()->route('admin.wilayah.kampung.index', $wilayah)
            ->with('success', 'Kampung berhasil diperbarui.');
    }

    public function destroy(Wilayah $wilayah, Kampung $kampung): RedirectResponse
    {
        abort_if($kampung->wilayah_id !== $wilayah->id, 404);
        $kampung->delete();

        return redirect()->route('admin.wilayah.kampung.index', $wilayah)
            ->with('success', 'Kampung berhasil dihapus.');
    }
}
