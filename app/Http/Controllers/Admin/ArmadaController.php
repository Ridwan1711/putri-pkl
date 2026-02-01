<?php

namespace App\Http\Controllers\Admin;

use App\Exports\ArmadaExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreArmadaRequest;
use App\Http\Requests\Admin\UpdateArmadaRequest;
use App\Models\Armada;
use App\Models\Petugas;
use App\Models\Wilayah;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Response as HttpFoundationResponse;

class ArmadaController extends Controller
{
    public function index(Request $request): Response
    {
        $armada = Armada::with(['wilayah', 'leader.user'])
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
        // Petugas yang belum menjadi leader armada manapun
        $availablePetugas = Petugas::with('user')
            ->whereDoesntHave('armada')
            ->get();

        return Inertia::render('admin/armada/create', [
            'wilayah' => Wilayah::where('is_active', true)->get(),
            'availablePetugas' => $availablePetugas,
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
            'armada' => $armada->load(['wilayah', 'anggota', 'leader.user', 'leader.wilayah', 'penugasan.pengajuanPengangkutan', 'penugasan.petugas.user']),
        ]);
    }

    public function edit(Armada $armada): Response
    {
        // Petugas yang belum menjadi leader armada manapun, atau leader armada ini saat ini
        $availablePetugas = Petugas::with('user')
            ->where(function ($query) use ($armada) {
                $query->whereDoesntHave('armada')
                    ->orWhere('id', $armada->petugas_id);
            })
            ->get();

        return Inertia::render('admin/armada/edit', [
            'armada' => $armada->load(['anggota', 'leader.user']),
            'wilayah' => Wilayah::where('is_active', true)->get(),
            'availablePetugas' => $availablePetugas,
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

    public function export(Request $request): HttpFoundationResponse
    {
        $format = $request->get('format', 'excel');
        $armada = Armada::with('wilayah')
            ->when($request->search, fn ($q, $s) => $q->where('kode_armada', 'like', "%{$s}%")
                ->orWhere('plat_nomor', 'like', "%{$s}%")
                ->orWhere('jenis_kendaraan', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->get();
        $filename = 'armada-'.now()->format('Y-m-d');

        if ($format === 'excel') {
            return Excel::download(new ArmadaExport($armada), $filename.'.xlsx');
        }

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('pdf.armada', ['armada' => $armada]);

            return $pdf->download($filename.'.pdf');
        }

        if ($format === 'csv') {
            $headers = [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="'.$filename.'.csv"',
            ];

            return response()->streamDownload(function () use ($armada) {
                $handle = fopen('php://output', 'w');
                fputcsv($handle, ['No', 'Kode', 'Plat', 'Jenis', 'Kapasitas', 'Wilayah', 'Status', 'Tanggal']);
                foreach ($armada as $i => $a) {
                    fputcsv($handle, [
                        $i + 1,
                        $a->kode_armada ?? '-',
                        $a->plat_nomor ?? '-',
                        $a->jenis_kendaraan ?? '-',
                        $a->kapasitas ?? 0,
                        $a->wilayah?->nama_wilayah ?? '-',
                        $a->status ?? '-',
                        $a->created_at?->format('d/m/Y H:i') ?? '',
                    ]);
                }
                fclose($handle);
            }, $filename.'.csv', $headers);
        }

        abort(400, 'Format tidak valid');
    }
}
