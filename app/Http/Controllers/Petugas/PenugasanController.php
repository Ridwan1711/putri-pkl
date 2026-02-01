<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\Penugasan;
use App\Models\Wilayah;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PenugasanController extends Controller
{
    public function index(Request $request): Response
    {
        $petugas = $request->user()->petugas;

        if (! $petugas) {
            abort(403, 'Anda belum terdaftar sebagai petugas.');
        }

        $penugasan = Penugasan::where('petugas_id', $petugas->id)
            ->with(['pengajuanPengangkutan.user', 'pengajuanPengangkutan.wilayah', 'armada'])
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->when($request->tanggal, fn ($query, $tanggal) => $query->whereDate('jadwal_angkut', $tanggal))
            ->when($request->wilayah_id, fn ($query, $wid) => $query->whereHas('pengajuanPengangkutan', fn ($q) => $q->where('wilayah_id', $wid)))
            ->latest('jadwal_angkut')
            ->paginate(15);

        return Inertia::render('petugas/penugasan/index', [
            'penugasan' => $penugasan,
            'wilayah' => Wilayah::where('is_active', true)->get(),
            'filters' => $request->only(['status', 'tanggal', 'wilayah_id']),
        ]);
    }

    public function show(Request $request, Penugasan $penugasan): Response
    {
        if ($penugasan->petugas_id !== $request->user()->petugas->id) {
            abort(403);
        }

        return Inertia::render('petugas/penugasan/show', [
            'penugasan' => $penugasan->load([
                'pengajuanPengangkutan.user',
                'pengajuanPengangkutan.wilayah',
                'pengajuanPengangkutan.riwayatStatus.changedBy',
                'petugas.user',
                'armada',
            ]),
        ]);
    }

    public function updateStatus(Request $request, Penugasan $penugasan): RedirectResponse
    {
        if ($penugasan->petugas_id !== $request->user()->petugas->id) {
            abort(403);
        }

        $request->validate([
            'status' => ['required', 'in:aktif,selesai,batal'],
        ]);

        $penugasan->update(['status' => $request->status]);

        if ($request->status === 'selesai') {
            $penugasan->pengajuanPengangkutan->update(['status' => 'selesai']);

            $penugasan->pengajuanPengangkutan->riwayatStatus()->create([
                'ref_type' => 'pengajuan',
                'ref_id' => $penugasan->pengajuanPengangkutan->id,
                'status' => 'selesai',
                'keterangan' => 'Pengangkutan selesai dilakukan oleh petugas',
                'changed_by' => $request->user()->id,
            ]);

            // Notify warga about status change
            $pengajuan = $penugasan->pengajuanPengangkutan;
            NotificationService::notifyPengajuanStatusChange(
                $pengajuan->id,
                $pengajuan->user_id,
                $pengajuan->email,
                'selesai',
                'Pengangkutan telah selesai dilakukan'
            );
        }

        return redirect()->back()->with('success', 'Status penugasan berhasil diperbarui.');
    }

    public function updateStatusFull(Request $request, Penugasan $penugasan): RedirectResponse
    {
        if ($penugasan->petugas_id !== $request->user()->petugas->id) {
            abort(403);
        }

        $request->validate([
            'status' => ['required', 'in:diverifikasi,dijadwalkan,diangkut,selesai,ditolak'],
            'tindak_lanjut' => ['nullable', 'string', 'max:500'],
        ]);

        $pengajuan = $penugasan->pengajuanPengangkutan;
        $oldStatus = $pengajuan->status;
        $newStatus = $request->status;

        $penugasan->update([
            'tindak_lanjut' => $request->tindak_lanjut,
        ]);

        if ($newStatus === 'selesai') {
            $penugasan->update(['status' => 'selesai']);
        } elseif ($newStatus === 'ditolak') {
            $penugasan->update(['status' => 'batal']);
        }

        $pengajuan->update(['status' => $newStatus]);
        $pengajuan->riwayatStatus()->create([
            'ref_type' => 'pengajuan',
            'ref_id' => $pengajuan->id,
            'status' => $newStatus,
            'keterangan' => $request->tindak_lanjut ?? "Status diubah dari {$oldStatus} menjadi {$newStatus}",
            'changed_by' => $request->user()->id,
        ]);

        // Notify warga about status change
        NotificationService::notifyPengajuanStatusChange(
            $pengajuan->id,
            $pengajuan->user_id,
            $pengajuan->email,
            $newStatus,
            $request->tindak_lanjut
        );

        return redirect()->back()->with('success', 'Status berhasil diperbarui.');
    }
}
