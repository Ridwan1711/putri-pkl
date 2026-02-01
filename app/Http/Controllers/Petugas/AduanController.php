<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Http\Requests\Warga\StoreAduanRequest;
use App\Models\Aduan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AduanController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $petugas = $user->petugas;

        // Get aduan in petugas's wilayah or about petugas performance
        $query = Aduan::with(['user'])
            ->where(function ($q) use ($petugas) {
                // Aduan about petugas performance (highlight these)
                $q->where('kategori', 'Kinerja Petugas')
                    // Or aduan in petugas's wilayah
                    ->orWhereHas('user', function ($userQuery) use ($petugas) {
                        if ($petugas && $petugas->wilayah_id) {
                            // For now, show all complaints - in the future could filter by user's wilayah
                        }
                    });
            });

        // For now, show all complaints (petugas should be aware of complaints in their area)
        $query = Aduan::with(['user']);

        // Apply filters
        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->kategori) {
            $query->where('kategori', $request->kategori);
        }

        $aduan = $query->latest()->paginate(15)->withQueryString();

        // Calculate stats
        $stats = [
            'total' => Aduan::count(),
            'kinerja_petugas' => Aduan::where('kategori', 'Kinerja Petugas')->count(),
            'keterlambatan' => Aduan::where('kategori', 'Keterlambatan Pengangkutan')->count(),
            'lainnya' => Aduan::whereNotIn('kategori', ['Kinerja Petugas', 'Keterlambatan Pengangkutan'])->count(),
        ];

        return Inertia::render('petugas/aduan/index', [
            'aduan' => $aduan,
            'filters' => $request->only(['status', 'kategori']),
            'stats' => $stats,
            'kategori_options' => StoreAduanRequest::KATEGORI_OPTIONS,
        ]);
    }

    public function show(Aduan $aduan): Response
    {
        return Inertia::render('petugas/aduan/show', [
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
}
