<?php

namespace App\Http\Controllers\Admin;

use App\Exports\WilayahExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreWilayahRequest;
use App\Http\Requests\Admin\UpdateWilayahRequest;
use App\Models\Wilayah;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Response as HttpFoundationResponse;

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

    public function export(Request $request): HttpFoundationResponse
    {
        $format = $request->get('format', 'excel');
        $wilayah = Wilayah::query()
            ->when($request->search, fn ($q, $s) => $q->where('nama_wilayah', 'like', "%{$s}%")->orWhere('kecamatan', 'like', "%{$s}%"))
            ->withCount('pengajuanPengangkutan')
            ->with('kampung')
            ->latest()
            ->get();
        $filename = 'wilayah-'.now()->format('Y-m-d');

        if ($format === 'excel') {
            return Excel::download(new WilayahExport($wilayah), $filename.'.xlsx');
        }

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('pdf.wilayah', ['wilayah' => $wilayah]);

            return $pdf->download($filename.'.pdf');
        }

        if ($format === 'csv') {
            $headers = [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="'.$filename.'.csv"',
            ];

            return response()->streamDownload(function () use ($wilayah) {
                $handle = fopen('php://output', 'w');
                fputcsv($handle, ['No', 'Nama Wilayah', 'Kecamatan', 'Jumlah Kampung', 'Status', 'Tanggal']);
                foreach ($wilayah as $i => $w) {
                    fputcsv($handle, [
                        $i + 1,
                        $w->nama_wilayah,
                        $w->kecamatan,
                        $w->kampung->count(),
                        $w->is_active ? 'Aktif' : 'Nonaktif',
                        $w->created_at?->format('d/m/Y H:i') ?? '',
                    ]);
                }
                fclose($handle);
            }, $filename.'.csv', $headers);
        }

        abort(400, 'Format tidak valid');
    }

    public function exportShow(Wilayah $wilayah, Request $request): HttpFoundationResponse
    {
        $type = $request->get('type', 'detail');
        $wilayah->load(['kampung', 'petugas.user', 'pengajuanPengangkutan', 'armada']);
        $filename = 'wilayah-'.str($wilayah->nama_wilayah)->slug().'-'.now()->format('Y-m-d');

        if ($type === 'peta' && $wilayah->geojson) {
            return response($wilayah->geojson, 200, [
                'Content-Type' => 'application/geo+json',
                'Content-Disposition' => 'attachment; filename="'.$filename.'.geojson"',
            ]);
        }

        $format = $request->get('format', 'pdf');
        $data = [
            'wilayah' => $wilayah,
            'kampung' => $wilayah->kampung,
            'petugas' => $wilayah->petugas,
            'pengajuan' => $wilayah->pengajuanPengangkutan,
            'armada' => $wilayah->armada,
        ];

        if ($type === 'statistik') {
            $data['statistik'] = [
                'jumlah_kampung' => $wilayah->kampung->count(),
                'jumlah_petugas' => $wilayah->petugas->count(),
                'jumlah_pengajuan' => $wilayah->pengajuanPengangkutan->count(),
                'jumlah_armada' => $wilayah->armada->count(),
            ];
        }

        if ($format === 'pdf') {
            $view = $type === 'statistik' ? 'pdf.wilayah-statistik' : 'pdf.wilayah-detail';
            $pdf = Pdf::loadView($view, $data);

            return $pdf->download($filename.'-'.$type.'.pdf');
        }

        abort(400, 'Format tidak valid untuk tipe ini');
    }
}
