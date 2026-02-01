<?php

namespace App\Http\Controllers\Admin;

use App\Exports\PengajuanExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignPenugasanRequest;
use App\Models\Armada;
use App\Models\PengajuanPengangkutan;
use App\Models\Penugasan;
use App\Models\Petugas;
use App\Models\Wilayah;
use App\Services\NotificationService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Response as HttpFoundationResponse;

class PengajuanController extends Controller
{
    public function index(Request $request): Response
    {
        $pengajuan = PengajuanPengangkutan::with(['user', 'wilayah', 'penugasan.petugas', 'penugasan.armada'])
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->when($request->wilayah_id, fn ($query, $wilayahId) => $query->where('wilayah_id', $wilayahId))
            ->when($request->search, fn ($query, $search) => $query->where(function ($q) use ($search) {
                $q->where('alamat_lengkap', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"))
                    ->orWhere('nama_pemohon', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('no_telepon', 'like', "%{$search}%");
            }))
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/pengajuan/index', [
            'pengajuan' => $pengajuan,
            'wilayah' => Wilayah::where('is_active', true)->get(),
            'filters' => $request->only(['status', 'wilayah_id', 'search']),
        ]);
    }

    public function show(PengajuanPengangkutan $pengajuan): Response
    {
        return Inertia::render('admin/pengajuan/show', [
            'pengajuan' => $pengajuan->load([
                'user',
                'wilayah',
                'penugasan.petugas.user',
                'penugasan.petugas.armada',
                'penugasan.armada',
                'riwayatStatus.changedBy',
                'lampiran',
            ]),
            'petugas' => Petugas::with(['user', 'armada.wilayah', 'armada.jadwalRutin.kampung', 'wilayah'])
                ->where('is_available', true)
                ->get(),
            'armada' => Armada::where('status', 'aktif')->get(),
        ]);
    }

    public function updateStatus(Request $request, PengajuanPengangkutan $pengajuan): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:diajukan,diverifikasi,dijadwalkan,diangkut,selesai,ditolak'],
            'keterangan' => ['nullable', 'string'],
        ]);

        $oldStatus = $pengajuan->status;
        $pengajuan->update(['status' => $request->status]);

        // Create riwayat status
        $pengajuan->riwayatStatus()->create([
            'ref_type' => 'pengajuan',
            'ref_id' => $pengajuan->id,
            'status' => $request->status,
            'keterangan' => $request->keterangan ?? "Status diubah dari {$oldStatus} menjadi {$request->status}",
            'changed_by' => $request->user()->id,
        ]);

        // Notify warga about status change
        NotificationService::notifyPengajuanStatusChange(
            $pengajuan->id,
            $pengajuan->user_id,
            $pengajuan->email, // For guest
            $request->status,
            $request->keterangan
        );

        return redirect()->back()->with('success', 'Status pengajuan berhasil diperbarui.');
    }

    public function assign(AssignPenugasanRequest $request): RedirectResponse
    {
        $pengajuan = PengajuanPengangkutan::findOrFail($request->pengajuan_id);
        $petugas = Petugas::findOrFail($request->petugas_id);

        Penugasan::create([
            'pengajuan_id' => $pengajuan->id,
            'petugas_id' => $petugas->id,
            'armada_id' => $request->armada_id ?? $petugas->armada_id,
            'jadwal_angkut' => $request->jadwal_angkut,
            'status' => 'aktif',
        ]);

        $pengajuan->update(['status' => 'dijadwalkan']);

        // Create riwayat status
        $pengajuan->riwayatStatus()->create([
            'ref_type' => 'pengajuan',
            'ref_id' => $pengajuan->id,
            'status' => 'dijadwalkan',
            'keterangan' => "Pengajuan dijadwalkan untuk petugas {$petugas->user->name}",
            'changed_by' => $request->user()->id,
        ]);

        // Notify warga about status change
        NotificationService::notifyPengajuanStatusChange(
            $pengajuan->id,
            $pengajuan->user_id,
            $pengajuan->email,
            'dijadwalkan',
            'Pengajuan Anda telah dijadwalkan untuk diangkut'
        );

        // Notify petugas about new penugasan
        $jadwalFormatted = \Carbon\Carbon::parse($request->jadwal_angkut)->format('d M Y H:i');
        NotificationService::notifyPenugasanAssigned(
            $pengajuan->id,
            $petugas->user_id,
            $pengajuan->alamat_lengkap,
            $jadwalFormatted
        );

        return redirect()->back()->with('success', 'Penugasan berhasil dibuat.');
    }

    public function export(Request $request): HttpFoundationResponse
    {
        $format = $request->get('format', 'excel');
        $ids = $request->get('ids') ? explode(',', $request->get('ids')) : null;

        $query = PengajuanPengangkutan::with(['user', 'wilayah', 'kampung'])
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->wilayah_id, fn ($q, $wilayahId) => $q->where('wilayah_id', $wilayahId))
            ->when($request->search, fn ($q, $search) => $q->where(function ($q2) use ($search) {
                $q2->where('alamat_lengkap', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"))
                    ->orWhere('nama_pemohon', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('no_telepon', 'like', "%{$search}%");
            }))
            ->when($ids, fn ($q) => $q->whereIn('id', $ids))
            ->latest();

        $pengajuan = $query->limit(1000)->get();
        $filename = 'pengajuan-'.now()->format('Y-m-d');

        if ($format === 'excel') {
            return Excel::download(new PengajuanExport($pengajuan), $filename.'.xlsx');
        }

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('pdf.pengajuan', ['pengajuan' => $pengajuan]);

            return $pdf->download($filename.'.pdf');
        }

        if ($format === 'csv') {
            $headers = [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="'.$filename.'.csv"',
            ];

            return response()->streamDownload(function () use ($pengajuan) {
                $handle = fopen('php://output', 'w');
                fputcsv($handle, ['No', 'Pemohon', 'Email', 'Telepon', 'Wilayah', 'Kampung', 'Status', 'Estimasi', 'Tanggal']);
                foreach ($pengajuan as $i => $p) {
                    fputcsv($handle, [
                        $i + 1,
                        $p->user?->name ?? $p->nama_pemohon ?? '-',
                        $p->user?->email ?? $p->email ?? '-',
                        $p->no_telepon ?? '-',
                        $p->wilayah?->nama_wilayah ?? '-',
                        $p->kampung?->nama_kampung ?? '-',
                        $p->status ?? '-',
                        $p->estimasi_volume ?? 0,
                        $p->created_at?->format('d/m/Y H:i') ?? '',
                    ]);
                }
                fclose($handle);
            }, $filename.'.csv', $headers);
        }

        abort(400, 'Format tidak valid');
    }
}
