<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use App\Http\Requests\Warga\StorePengajuanRequest;
use App\Models\PengajuanPengangkutan;
use App\Models\Wilayah;
use App\Services\AutoAssignService;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanController extends Controller
{
    public function index(Request $request): Response
    {
        $pengajuan = PengajuanPengangkutan::where('user_id', $request->user()->id)
            ->with(['wilayah', 'penugasan.petugas.user', 'penugasan.armada'])
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(15);

        return Inertia::render('warga/pengajuan/index', [
            'pengajuan' => $pengajuan,
            'filters' => $request->only(['status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('warga/pengajuan/create', [
            'wilayah' => Wilayah::with('kampung')->where('is_active', true)->get(),
        ]);
    }

    public function store(StorePengajuanRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;
        $data['status'] = 'diajukan';

        if ($request->hasFile('foto_sampah')) {
            $data['foto_sampah'] = $request->file('foto_sampah')->store('uploads/pengajuan', 'public');
        }

        $pengajuan = PengajuanPengangkutan::create($data);

        // Create riwayat status
        $pengajuan->riwayatStatus()->create([
            'ref_type' => 'pengajuan',
            'ref_id' => $pengajuan->id,
            'status' => 'diajukan',
            'keterangan' => 'Pengajuan dibuat oleh warga',
            'changed_by' => $request->user()->id,
        ]);

        app(AutoAssignService::class)->assign($pengajuan);

        // Send notification to admins and petugas in wilayah
        NotificationService::notifyNewPengajuan(
            $pengajuan->id,
            $pengajuan->wilayah_id,
            $pengajuan->alamat_lengkap,
            $request->user()->name
        );

        return redirect()->route('warga.pengajuan.index')
            ->with('success', 'Pengajuan berhasil dibuat.');
    }

    public function show(PengajuanPengangkutan $pengajuan): Response
    {

        return Inertia::render('warga/pengajuan/show', [
            'pengajuan' => $pengajuan->load([
                'user',
                'wilayah',
                'kampung',
                'penugasan.petugas.user',
                'penugasan.petugas.armada',
                'penugasan.armada',
                'riwayatStatus.changedBy',
                'lampiran',
            ]),
        ]);
    }
}
