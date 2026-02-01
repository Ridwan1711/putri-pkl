<?php

use App\Models\Armada;
use App\Models\JadwalRutin;
use App\Models\PengajuanPengangkutan;
use App\Models\Penugasan;
use App\Models\Petugas;
use App\Models\User;
use App\Models\Wilayah;
use App\Services\AutoAssignService;

test('auto assign skips when pengajuan has no coordinates', function () {
    $user = User::factory()->warga()->create();
    $wilayah = Wilayah::factory()->create([
        'latitude' => -7.35,
        'longitude' => 108.11,
    ]);

    $pengajuan = PengajuanPengangkutan::create([
        'user_id' => $user->id,
        'wilayah_id' => $wilayah->id,
        'alamat_lengkap' => 'Test address',
        'latitude' => null,
        'longitude' => null,
        'status' => 'diajukan',
    ]);

    $result = app(AutoAssignService::class)->assign($pengajuan);

    expect($result)->toBeNull();
    expect($pengajuan->fresh()->status)->toBe('diajukan');
});

test('auto assign creates penugasan when petugas in radius', function () {
    $wilayah = Wilayah::factory()->create([
        'latitude' => -7.35,
        'longitude' => 108.11,
        'is_active' => true,
    ]);
    $user = User::factory()->warga()->create();
    $tomorrowDay = (int) now()->addDay()->format('N');
    $petugas = Petugas::factory()->create([
        'wilayah_id' => $wilayah->id,
        'hari_libur' => array_values(array_diff([1, 2, 3, 4, 5, 6, 7], [$tomorrowDay])),
        'is_available' => true,
    ]);
    $armada = Armada::factory()->create([
        'wilayah_id' => $wilayah->id,
        'petugas_id' => $petugas->id,
        'status' => 'aktif',
    ]);
    $kampung = \App\Models\Kampung::factory()->create([
        'wilayah_id' => $wilayah->id,
        'latitude' => -7.35,
        'longitude' => 108.11,
    ]);
    $jadwal = JadwalRutin::create([
        'armada_id' => $armada->id,
        'hari' => (int) now()->addDay()->format('N'),
    ]);
    $jadwal->kampung()->attach($kampung->id, ['urutan' => 0]);

    $pengajuan = PengajuanPengangkutan::factory()->create([
        'user_id' => $user->id,
        'latitude' => -7.34,
        'longitude' => 108.11,
        'wilayah_id' => $wilayah->id,
        'status' => 'diajukan',
    ]);

    $result = app(AutoAssignService::class)->assign($pengajuan);

    expect($result)->not->toBeNull();
    expect($result->petugas_id)->toBe($petugas->id);
    expect($pengajuan->fresh()->status)->toBe('dijadwalkan');
    expect(Penugasan::where('pengajuan_id', $pengajuan->id)->count())->toBe(1);
});
