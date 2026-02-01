<?php

namespace App\Http\Controllers\Admin;

use App\Exports\PetugasExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePetugasRequest;
use App\Http\Requests\Admin\UpdatePetugasRequest;
use App\Models\Petugas;
use App\Models\User;
use App\Models\Wilayah;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Response as HttpFoundationResponse;

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

        Petugas::create(collect($validated)->only(['user_id', 'wilayah_id', 'is_available', 'hari_libur'])->all());

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

    public function export(Request $request): HttpFoundationResponse
    {
        $format = $request->get('format', 'excel');
        $petugas = Petugas::with(['user', 'armada', 'wilayah'])
            ->when($request->search, fn ($q, $s) => $q->whereHas('user', fn ($u) => $u->where('name', 'like', "%{$s}%")))
            ->when($request->wilayah_id, fn ($q, $id) => $q->where('wilayah_id', $id))
            ->latest()
            ->get();
        $filename = 'petugas-'.now()->format('Y-m-d');

        if ($format === 'excel') {
            return Excel::download(new PetugasExport($petugas), $filename.'.xlsx');
        }

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('pdf.petugas', ['petugas' => $petugas]);

            return $pdf->download($filename.'.pdf');
        }

        if ($format === 'csv') {
            $headers = [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="'.$filename.'.csv"',
            ];

            return response()->streamDownload(function () use ($petugas) {
                $handle = fopen('php://output', 'w');
                fputcsv($handle, ['No', 'Nama', 'Email', 'Wilayah', 'Armada', 'Status', 'Tanggal']);
                foreach ($petugas as $i => $p) {
                    fputcsv($handle, [
                        $i + 1,
                        $p->user?->name ?? '-',
                        $p->user?->email ?? '-',
                        $p->wilayah?->nama_wilayah ?? '-',
                        $p->armada?->kode_armada ?? '-',
                        $p->is_available ? 'Aktif' : 'Tidak Aktif',
                        $p->created_at?->format('d/m/Y H:i') ?? '',
                    ]);
                }
                fclose($handle);
            }, $filename.'.csv', $headers);
        }

        abort(400, 'Format tidak valid');
    }
}
