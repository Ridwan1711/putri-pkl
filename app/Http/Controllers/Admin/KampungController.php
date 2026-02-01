<?php

namespace App\Http\Controllers\Admin;

use App\Exports\KampungExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreKampungRequest;
use App\Http\Requests\Admin\UpdateKampungRequest;
use App\Models\Kampung;
use App\Models\Wilayah;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Response as HttpFoundationResponse;

class KampungController extends Controller
{
    public function index(Wilayah $wilayah): Response
    {
        $kampung = $wilayah->kampung()->orderBy('urutan_rute')->orderBy('nama_kampung')->get();
        $kampung = $kampung->map(function ($k) {
            $k->is_active = $k->status === 'active';

            return $k;
        });

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
        $wilayah->kampung()->create([
            'nama_kampung' => $request->nama_kampung,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'urutan_rute' => $request->urutan_rute,
            'status' => $request->is_active ? 'active' : 'inactive',
        ]);

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

    public function export(Wilayah $wilayah, Request $request): HttpFoundationResponse
    {
        $format = $request->get('format', 'excel');
        $kampung = $wilayah->kampung()->orderBy('urutan_rute')->orderBy('nama_kampung')->get();
        $filename = 'kampung-'.$wilayah->nama_wilayah.'-'.now()->format('Y-m-d');

        if ($format === 'excel') {
            return Excel::download(new KampungExport($kampung), $filename.'.xlsx');
        }

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('pdf.kampung', ['kampung' => $kampung, 'wilayah' => $wilayah]);

            return $pdf->download($filename.'.pdf');
        }

        if ($format === 'csv') {
            $headers = [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="'.$filename.'.csv"',
            ];

            return response()->streamDownload(function () use ($kampung) {
                $handle = fopen('php://output', 'w');
                fputcsv($handle, ['No', 'Nama Kampung', 'Latitude', 'Longitude', 'Urutan Rute', 'Tanggal']);
                foreach ($kampung as $i => $k) {
                    fputcsv($handle, [
                        $i + 1,
                        $k->nama_kampung,
                        $k->latitude ?? '',
                        $k->longitude ?? '',
                        $k->urutan_rute ?? 0,
                        $k->created_at?->format('d/m/Y H:i') ?? '',
                    ]);
                }
                fclose($handle);
            }, $filename.'.csv', $headers);
        }

        abort(400, 'Format tidak valid');
    }
}
