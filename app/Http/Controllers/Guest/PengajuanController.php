<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guest\StoreGuestPengajuanRequest;
use App\Models\PengajuanPengangkutan;
use App\Services\AutoAssignService;
use Illuminate\Http\RedirectResponse;

class PengajuanController extends Controller
{
    public function store(StoreGuestPengajuanRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['user_id'] = null;
        $data['status'] = 'diajukan';
        $data['ip_address'] = $request->ip();

        if ($request->hasFile('foto_sampah')) {
            $data['foto_sampah'] = $request->file('foto_sampah')->store('uploads/pengajuan', 'public');
        }

        $pengajuan = PengajuanPengangkutan::create($data);

        $pengajuan->riwayatStatus()->create([
            'ref_type' => 'pengajuan',
            'ref_id' => $pengajuan->id,
            'status' => 'diajukan',
            'keterangan' => 'Pengajuan dibuat oleh guest (tanpa login)',
            'changed_by' => null,
        ]);

        app(AutoAssignService::class)->assign($pengajuan);

        return redirect()
            ->route('home')
            ->with('success', 'Pengajuan berhasil dibuat. Silakan simpan no. telepon/email untuk pengecekan status via kontak admin.');
    }
}
