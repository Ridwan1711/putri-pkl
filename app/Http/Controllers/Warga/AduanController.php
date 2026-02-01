<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use App\Http\Requests\Warga\StoreAduanRequest;
use App\Models\Aduan;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AduanController extends Controller
{
    public function index(Request $request): Response
    {
        $aduan = Aduan::where('user_id', $request->user()->id)
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->when($request->kategori, fn ($query, $kategori) => $query->where('kategori', $kategori))
            ->latest()
            ->paginate(15);

        return Inertia::render('warga/aduan/index', [
            'aduan' => $aduan,
            'filters' => $request->only(['status', 'kategori']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('warga/aduan/create');
    }

    public function store(StoreAduanRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;
        $data['status'] = 'masuk';

        if ($request->hasFile('foto_bukti')) {
            $data['foto_bukti'] = $request->file('foto_bukti')->store('uploads/aduan', 'public');
        }

        $aduan = Aduan::create($data);

        // Create riwayat status
        $aduan->riwayatStatus()->create([
            'ref_type' => 'aduan',
            'ref_id' => $aduan->id,
            'status' => 'masuk',
            'keterangan' => 'Aduan dibuat oleh warga',
            'changed_by' => $request->user()->id,
        ]);

        // Send notification to admins
        NotificationService::notifyNewAduan(
            $aduan->id,
            $aduan->kategori,
            $request->user()->name
        );

        return redirect()->route('warga.aduan.index')
            ->with('success', 'Aduan berhasil dibuat.');
    }

    public function show(Aduan $aduan): Response
    {

        return Inertia::render('warga/aduan/show', [
            'aduan' => $aduan->load([
                'user',
                'riwayatStatus.changedBy',
                'lampiran',
            ]),
        ]);
    }
}
