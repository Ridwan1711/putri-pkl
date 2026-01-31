<?php

namespace App\Services;

use App\Models\JadwalRutin;
use App\Models\Kampung;
use App\Models\PengajuanPengangkutan;
use App\Models\Penugasan;
use App\Models\Petugas;

class AutoAssignService
{
    private const RADIUS_KM = 4;

    public function assign(PengajuanPengangkutan $pengajuan): ?Penugasan
    {
        $petugas = $this->findEligiblePetugas($pengajuan);

        if (! $petugas) {
            return null;
        }

        $hari = (int) now()->addDay()->format('N');
        $jadwalRutin = JadwalRutin::where('armada_id', $petugas->armada_id)
            ->hari($hari)
            ->with('kampung')
            ->first();

        $jadwalAngkut = now()->addDay()->setTime(8, 0, 0);

        $penugasan = Penugasan::create([
            'pengajuan_id' => $pengajuan->id,
            'petugas_id' => $petugas->id,
            'armada_id' => $jadwalRutin?->armada_id ?? $petugas->armada_id,
            'jadwal_angkut' => $jadwalAngkut,
            'status' => 'aktif',
        ]);

        $pengajuan->update(['status' => 'dijadwalkan']);
        $pengajuan->riwayatStatus()->create([
            'ref_type' => 'pengajuan',
            'ref_id' => $pengajuan->id,
            'status' => 'dijadwalkan',
            'keterangan' => 'Auto-assign: pengajuan otomatis diberikan ke petugas '.$petugas->user->name,
            'changed_by' => null,
        ]);

        return $penugasan;
    }

    public function findEligiblePetugas(PengajuanPengangkutan $pengajuan): ?Petugas
    {
        $kampungIds = $this->getKampungIdsForPengajuan($pengajuan);

        if ($kampungIds->isEmpty()) {
            return null;
        }

        $hari = (int) now()->addDay()->format('N');

        $jadwalRutin = JadwalRutin::with(['armada.petugas.user'])
            ->hari($hari)
            ->whereHas('kampung', fn ($q) => $q->whereIn('kampung.id', $kampungIds))
            ->get();

        foreach ($jadwalRutin as $jr) {
            $petugas = $jr->armada?->petugas->first();
            if ($petugas && $petugas->is_available && ! $petugas->isLibur($hari)) {
                return $petugas;
            }
        }

        return null;
    }

    private function getKampungIdsForPengajuan(PengajuanPengangkutan $pengajuan): \Illuminate\Support\Collection
    {
        if ($pengajuan->kampung_id) {
            return collect([$pengajuan->kampung_id]);
        }

        if ($pengajuan->latitude === null || $pengajuan->longitude === null) {
            return collect();
        }

        $pengajuanLat = (float) $pengajuan->latitude;
        $pengajuanLng = (float) $pengajuan->longitude;

        return Kampung::whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get()
            ->filter(function (Kampung $k) use ($pengajuanLat, $pengajuanLng) {
                $distance = $this->haversineDistance(
                    $pengajuanLat,
                    $pengajuanLng,
                    (float) $k->latitude,
                    (float) $k->longitude
                );

                return $distance <= self::RADIUS_KM;
            })
            ->pluck('id');
    }

    private function haversineDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat / 2) ** 2 + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) ** 2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
