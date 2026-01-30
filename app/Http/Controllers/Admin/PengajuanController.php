<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignPenugasanRequest;
use App\Models\Armada;
use App\Models\PengajuanPengangkutan;
use App\Models\Penugasan;
use App\Models\Petugas;
use App\Models\Wilayah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanController extends Controller
{
    public function index(Request $request): Response
    {
        $pengajuan = PengajuanPengangkutan::with(['user', 'wilayah', 'penugasan.petugas', 'penugasan.armada'])
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->when($request->wilayah_id, fn ($query, $wilayahId) => $query->where('wilayah_id', $wilayahId))
            ->when($request->search, fn ($query, $search) => $query->where('alamat_lengkap', 'like', "%{$search}%")
                ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%")))
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
            'petugas' => Petugas::with(['user', 'armada', 'wilayah'])->where('is_available', true)->get(),
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

        return redirect()->back()->with('success', 'Penugasan berhasil dibuat.');
    }
}
