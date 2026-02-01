<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Hari;
use App\Exports\JadwalRutinExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreJadwalRutinRequest;
use App\Models\Armada;
use App\Models\JadwalRutin;
use App\Models\Wilayah;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Response as HttpFoundationResponse;

class JadwalRutinController extends Controller
{
    public function index(Request $request): Response
    {
        $query = JadwalRutin::with(['armada.wilayah', 'armada.leader.user', 'armada.anggota', 'kampung'])
            ->when($request->wilayah_id, fn ($q, $wilayahId) => $q->whereHas('armada', fn ($aq) => $aq->where('wilayah_id', $wilayahId)))
            ->when($request->hari, fn ($q, $hari) => $q->where('hari', $hari))
            ->when($request->armada_id, fn ($q, $id) => $q->where('armada_id', $id))
            ->orderBy('hari')
            ->orderBy('armada_id');

        $jadwalRutin = $query->get();

        // Group jadwal by armada for the print view
        $jadwalByArmada = $jadwalRutin->groupBy('armada_id')->map(function ($jadwalGroup) {
            $armada = $jadwalGroup->first()->armada;

            return [
                'armada' => $armada,
                'petugas' => $armada?->leader?->user?->name ?? '-',
                'anggota' => $armada?->anggota?->pluck('nama')->take(5)->toArray() ?? [],
                'jadwal' => $jadwalGroup->groupBy('hari')->map(fn ($items) => $items->first())->sortKeys(),
            ];
        });

        return Inertia::render('admin/jadwal-rutin/index', [
            'jadwalRutin' => $jadwalRutin,
            'jadwalByArmada' => $jadwalByArmada->values(),
            'armada' => Armada::with('wilayah')->where('status', 'aktif')->whereNotNull('wilayah_id')
                ->when($request->wilayah_id, fn ($q, $id) => $q->where('wilayah_id', $id))
                ->get(),
            'wilayah' => Wilayah::with('kampung')->where('is_active', true)->get(),
            'hariOptions' => Hari::toArray(),
            'filters' => $request->only(['hari', 'armada_id', 'wilayah_id']),
        ]);
    }

    public function store(StoreJadwalRutinRequest $request): RedirectResponse
    {
        $armada = Armada::with('leader')->findOrFail($request->armada_id);
        $leader = $armada->leader;
        if ($leader && $leader->isLibur((int) $request->hari)) {
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

    public function export(Request $request): HttpFoundationResponse
    {
        $format = $request->get('format', 'excel');
        $jadwalRutin = JadwalRutin::with(['armada.wilayah', 'kampung'])
            ->when($request->wilayah_id, fn ($q, $wilayahId) => $q->whereHas('armada', fn ($aq) => $aq->where('wilayah_id', $wilayahId)))
            ->when($request->hari, fn ($q, $h) => $q->where('hari', $h))
            ->when($request->armada_id, fn ($q, $id) => $q->where('armada_id', $id))
            ->orderBy('hari')
            ->orderBy('armada_id')
            ->get();
        $filename = 'jadwal-rutin-'.now()->format('Y-m-d');

        if ($format === 'excel') {
            return Excel::download(new JadwalRutinExport($jadwalRutin), $filename.'.xlsx');
        }

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('pdf.jadwal-rutin', ['jadwalRutin' => $jadwalRutin]);

            return $pdf->download($filename.'.pdf');
        }

        if ($format === 'csv') {
            $headers = [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="'.$filename.'.csv"',
            ];

            return response()->streamDownload(function () use ($jadwalRutin) {
                $handle = fopen('php://output', 'w');
                fputcsv($handle, ['No', 'Armada', 'Hari', 'Kampung', 'Wilayah']);
                foreach ($jadwalRutin as $i => $j) {
                    $hariLabel = Hari::tryFrom($j->hari)?->label() ?? $j->hari;
                    $kampungList = $j->kampung?->pluck('nama_kampung')->implode(', ') ?? '-';
                    fputcsv($handle, [
                        $i + 1,
                        $j->armada?->kode_armada ?? '-',
                        $hariLabel,
                        $kampungList,
                        $j->armada?->wilayah?->nama_wilayah ?? '-',
                    ]);
                }
                fclose($handle);
            }, $filename.'.csv', $headers);
        }

        abort(400, 'Format tidak valid');
    }

    public function print(Request $request): HttpFoundationResponse
    {
        $jadwalRutin = JadwalRutin::with(['armada.wilayah', 'armada.leader.user', 'armada.anggota', 'kampung'])
            ->when($request->wilayah_id, fn ($q, $wilayahId) => $q->whereHas('armada', fn ($aq) => $aq->where('wilayah_id', $wilayahId)))
            ->when($request->armada_id, fn ($q, $id) => $q->where('armada_id', $id))
            ->orderBy('armada_id')
            ->orderBy('hari')
            ->get();

        // Group by armada
        $jadwalByArmada = $jadwalRutin->groupBy('armada_id')->map(function ($jadwalGroup) {
            $armada = $jadwalGroup->first()->armada;

            return [
                'armada' => $armada,
                'kode_armada' => $armada?->kode_armada ?? '-',
                'jenis_kendaraan' => $armada?->jenis_kendaraan ?? '-',
                'wilayah' => $armada?->wilayah?->nama_wilayah ?? '-',
                'petugas' => $armada?->leader?->user?->name ?? '-',
                'anggota' => $armada?->anggota?->pluck('nama')->take(5)->toArray() ?? [],
                'jadwal' => $jadwalGroup->groupBy('hari')->map(function ($items) {
                    $jadwal = $items->first();

                    return [
                        'hari' => Hari::tryFrom($jadwal->hari)?->label() ?? $jadwal->hari,
                        'kampung' => $jadwal->kampung->map(fn ($k, $i) => [
                            'nama' => $k->nama_kampung,
                            'urutan' => $k->pivot->urutan ?? $i,
                        ])->sortBy('urutan')->values()->toArray(),
                    ];
                })->sortKeys()->values()->toArray(),
            ];
        })->values();

        $wilayah = $request->wilayah_id
            ? Wilayah::find($request->wilayah_id)
            : null;

        $filename = 'jadwal-rutin-per-armada-'.now()->format('Y-m-d').'.pdf';

        $pdf = Pdf::loadView('pdf.jadwal-rutin-armada', [
            'jadwalByArmada' => $jadwalByArmada,
            'wilayah' => $wilayah,
        ]);

        $pdf->setPaper('a4', 'portrait');

        return $pdf->download($filename);
    }
}
