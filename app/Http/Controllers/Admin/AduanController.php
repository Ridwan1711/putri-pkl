<?php

namespace App\Http\Controllers\Admin;

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
        $query = Aduan::with(['user']);

        // Apply filters
        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->kategori) {
            $query->where('kategori', $request->kategori);
        }

        if ($request->search) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            })->orWhere('deskripsi', 'like', "%{$request->search}%");
        }

        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $aduan = $query->latest()->paginate(15)->withQueryString();

        // Calculate stats
        $stats = [
            'total' => Aduan::count(),
            'masuk' => Aduan::where('status', 'masuk')->count(),
            'diproses' => Aduan::where('status', 'diproses')->count(),
            'ditindak' => Aduan::where('status', 'ditindak')->count(),
            'selesai' => Aduan::where('status', 'selesai')->count(),
            'ditolak' => Aduan::where('status', 'ditolak')->count(),
        ];

        return Inertia::render('admin/aduan/index', [
            'aduan' => $aduan,
            'filters' => $request->only(['status', 'kategori', 'search', 'date_from', 'date_to']),
            'stats' => $stats,
            'kategori_options' => StoreAduanRequest::KATEGORI_OPTIONS,
        ]);
    }

    public function show(Aduan $aduan): Response
    {
        return Inertia::render('admin/aduan/show', [
            'aduan' => $aduan->load([
                'user',
                'riwayatStatus' => function ($query) {
                    $query->orderBy('created_at', 'desc');
                },
                'riwayatStatus.changedBy',
                'lampiran',
            ]),
        ]);
    }

    public function updateStatus(Request $request, Aduan $aduan): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:masuk,diproses,ditindak,selesai,ditolak'],
            'keterangan' => ['nullable', 'string', 'max:500'],
            'tindak_lanjut' => ['nullable', 'string', 'max:1000'],
        ]);

        $aduan->update([
            'status' => $validated['status'],
            'tindak_lanjut' => $validated['tindak_lanjut'] ?? $aduan->tindak_lanjut,
        ]);

        // Create riwayat status
        $aduan->riwayatStatus()->create([
            'ref_type' => 'aduan',
            'ref_id' => $aduan->id,
            'status' => $validated['status'],
            'keterangan' => $validated['keterangan'] ?? 'Status diubah oleh admin',
            'changed_by' => $request->user()->id,
        ]);

        // Notify warga about status change
        NotificationService::notifyAduanStatusChange(
            $aduan->id,
            $aduan->user_id,
            $validated['status'],
            $validated['keterangan']
        );

        return redirect()->back()->with('success', 'Status aduan berhasil diperbarui.');
    }
}
