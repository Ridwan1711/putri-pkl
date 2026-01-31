<?php

namespace App\Services;

use App\Models\JadwalRutin;
use App\Models\PengajuanPengangkutan;
use App\Models\Penugasan;
use App\Models\Petugas;
use App\Models\Wilayah;

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
        $wilayahIds = $this->getWilayahIdsWithinRadius($pengajuan);
        $jadwalRutin = JadwalRutin::where('petugas_id', $petugas->id)
            ->hari($hari)
            ->whereIn('wilayah_id', $wilayahIds)
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
            'keterangan' => 'Auto-assign: pengajuan otomatis diberikan ke petugas '.$petugas->user->name.' (dalam radius '.self::RADIUS_KM.' km)',
            'changed_by' => null,
        ]);

        return $penugasan;
    }

    public function findEligiblePetugas(PengajuanPengangkutan $pengajuan): ?Petugas
    {
        if ($pengajuan->latitude === null || $pengajuan->longitude === null) {
            return null;
        }

        $wilayahWithinRadius = $this->getWilayahWithDistance($pengajuan);

        if ($wilayahWithinRadius->isEmpty()) {
            return null;
        }

        $wilayahIds = $wilayahWithinRadius->pluck('id');
        $hari = (int) now()->addDay()->format('N');

        $petugasCandidates = Petugas::with(['user', 'wilayah', 'jadwalRutin.wilayah'])
            ->where('is_available', true)
            ->get()
            ->filter(function (Petugas $p) use ($hari, $wilayahIds) {
                if ($p->isLibur($hari)) {
                    return false;
                }
                if ($p->wilayah_id && $wilayahIds->contains($p->wilayah_id)) {
                    return true;
                }
                $jrWilayahIds = $p->jadwalRutin->pluck('wilayah_id')->filter();

                return $jrWilayahIds->intersect($wilayahIds)->isNotEmpty();
            });

        if ($petugasCandidates->isEmpty()) {
            return null;
        }

        $pengajuanLat = (float) $pengajuan->latitude;
        $pengajuanLng = (float) $pengajuan->longitude;
        $wilayahDistances = [];
        foreach ($wilayahWithinRadius as $w) {
            $wilayahDistances[$w->id] = $this->haversineDistance(
                $pengajuanLat,
                $pengajuanLng,
                (float) $w->latitude,
                (float) $w->longitude
            );
        }

        return $petugasCandidates->sortBy(function (Petugas $p) use ($wilayahIds, $wilayahDistances) {
            $relevantWilayahIds = collect();
            if ($p->wilayah_id && $wilayahIds->contains($p->wilayah_id)) {
                $relevantWilayahIds->push($p->wilayah_id);
            }
            foreach ($p->jadwalRutin as $jr) {
                if ($wilayahIds->contains($jr->wilayah_id)) {
                    $relevantWilayahIds->push($jr->wilayah_id);
                }
            }
            $minDist = $relevantWilayahIds->unique()->map(fn ($wid) => $wilayahDistances[$wid] ?? PHP_FLOAT_MAX)->min();

            return $minDist ?? PHP_FLOAT_MAX;
        })->first();
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

    private function getWilayahIdsWithinRadius(PengajuanPengangkutan $pengajuan): \Illuminate\Support\Collection
    {
        return $this->getWilayahWithDistance($pengajuan)->pluck('id');
    }

    private function getWilayahWithDistance(PengajuanPengangkutan $pengajuan): \Illuminate\Support\Collection
    {
        $pengajuanLat = (float) $pengajuan->latitude;
        $pengajuanLng = (float) $pengajuan->longitude;

        return Wilayah::whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->where('is_active', true)
            ->get()
            ->filter(function (Wilayah $wilayah) use ($pengajuanLat, $pengajuanLng) {
                $distance = $this->haversineDistance(
                    $pengajuanLat,
                    $pengajuanLng,
                    (float) $wilayah->latitude,
                    (float) $wilayah->longitude
                );

                return $distance <= self::RADIUS_KM;
            });
    }
}
