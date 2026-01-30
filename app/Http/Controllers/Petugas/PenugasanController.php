<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\Penugasan;
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
            ->latest('jadwal_angkut')
            ->paginate(15);

        return Inertia::render('petugas/penugasan/index', [
            'penugasan' => $penugasan,
            'filters' => $request->only(['status', 'tanggal']),
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
        }

        return redirect()->back()->with('success', 'Status penugasan berhasil diperbarui.');
    }
}
