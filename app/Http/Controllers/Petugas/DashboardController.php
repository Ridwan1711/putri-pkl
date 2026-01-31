<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Penugasan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $petugas = $request->user()->petugas;

        if (! $petugas) {
            abort(403, 'Anda belum terdaftar sebagai petugas.');
        }

        $penugasanHariIni = Penugasan::where('petugas_id', $petugas->id)
            ->where('status', 'aktif')
            ->whereDate('jadwal_angkut', today())
            ->with(['pengajuanPengangkutan.user', 'pengajuanPengangkutan.wilayah', 'armada'])
            ->get();

        $penugasanMendatang = Penugasan::where('petugas_id', $petugas->id)
            ->where('status', 'aktif')
            ->whereDate('jadwal_angkut', '>', today())
            ->with(['pengajuanPengangkutan.user', 'pengajuanPengangkutan.wilayah', 'armada'])
            ->orderBy('jadwal_angkut')
            ->limit(5)
            ->get();

        $jumlahTugas = Penugasan::where('petugas_id', $petugas->id)
            ->whereIn('status', ['aktif'])
            ->whereDate('jadwal_angkut', '>=', today())
            ->count();

        $sampahTerkumpul = (float) Penugasan::where('petugas_id', $petugas->id)
            ->where('status', 'selesai')
            ->sum('total_sampah_terangkut');

        $performa = $this->getPerforma($petugas->id);

        $chart7Hari = $this->getChart7Hari($petugas->id);

        $notifikasi = Notifikasi::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get(['id', 'judul', 'pesan']);

        return Inertia::render('petugas/dashboard', [
            'penugasan_hari_ini' => $penugasanHariIni,
            'penugasan_mendatang' => $penugasanMendatang,
            'stats' => [
                'total_penugasan_aktif' => Penugasan::where('petugas_id', $petugas->id)->where('status', 'aktif')->count(),
                'penugasan_selesai' => Penugasan::where('petugas_id', $petugas->id)->where('status', 'selesai')->count(),
            ],
            'jumlah_tugas' => $jumlahTugas,
            'sampah_terkumpul' => round($sampahTerkumpul, 2),
            'performa' => $performa,
            'chart_7_hari' => $chart7Hari,
            'notifikasi' => $notifikasi,
        ]);
    }

    private function getPerforma(int $petugasId): array
    {
        $penugasanIds = Penugasan::where('petugas_id', $petugasId)->pluck('pengajuan_id');
        $counts = DB::table('pengajuan_pengangkutan')
            ->whereIn('id', $penugasanIds)
            ->selectRaw("
                SUM(CASE WHEN status IN ('diajukan', 'diverifikasi') THEN 1 ELSE 0 END) as menunggu,
                SUM(CASE WHEN status = 'dijadwalkan' THEN 1 ELSE 0 END) as diproses,
                SUM(CASE WHEN status = 'diangkut' THEN 1 ELSE 0 END) as dalam_perjalanan,
                SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai,
                SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as gagal
            ")
            ->first();

        $batalCount = Penugasan::where('petugas_id', $petugasId)->where('status', 'batal')->count();

        return [
            'menunggu' => (int) ($counts->menunggu ?? 0),
            'diproses' => (int) ($counts->diproses ?? 0),
            'dalam_perjalanan' => (int) ($counts->dalam_perjalanan ?? 0),
            'selesai' => (int) ($counts->selesai ?? 0),
            'gagal' => (int) ($counts->gagal ?? 0) + $batalCount,
        ];
    }

    private function getChart7Hari(int $petugasId): array
    {
        $dates = [];
        for ($i = 6; $i >= 0; $i--) {
            $dates[] = now()->subDays($i)->format('Y-m-d');
        }

        $result = [];
        foreach ($dates as $date) {
            $selesai = Penugasan::where('petugas_id', $petugasId)
                ->where('status', 'selesai')
                ->whereDate('jadwal_angkut', $date)
                ->count();

            $gagal = Penugasan::where('petugas_id', $petugasId)
                ->where('status', 'batal')
                ->whereDate('jadwal_angkut', $date)
                ->count();

            $result[] = [
                'date' => $date,
                'label' => now()->parse($date)->translatedFormat('d M Y'),
                'selesai' => $selesai,
                'gagal' => $gagal,
            ];
        }

        return $result;
    }
}
