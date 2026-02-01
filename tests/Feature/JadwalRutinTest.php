<?php

use App\Models\Armada;
use App\Models\JadwalRutin;
use App\Models\Kampung;
use App\Models\Petugas;
use App\Models\User;
use App\Models\Wilayah;

test('admin can view jadwal rutin index', function () {
    $admin = User::factory()->admin()->create();
    $this->actingAs($admin);

    $response = $this->get(route('admin.jadwal-rutin.index'));

    $response->assertOk();
});

test('admin can store jadwal rutin', function () {
    $admin = User::factory()->admin()->create();
    $wilayah = Wilayah::factory()->create();
    $petugas = Petugas::factory()->create([
        'wilayah_id' => $wilayah->id,
        'hari_libur' => [6, 7],
    ]);
    $armada = Armada::factory()->create([
        'wilayah_id' => $wilayah->id,
        'petugas_id' => $petugas->id,
        'status' => 'aktif',
    ]);
    $kampung = Kampung::factory()->create(['wilayah_id' => $wilayah->id]);
    $this->actingAs($admin);

    $response = $this->post(route('admin.jadwal-rutin.store'), [
        'armada_id' => $armada->id,
        'hari' => 1,
        'kampung_ids' => [$kampung->id],
    ]);

    $response->assertRedirect();
    expect(JadwalRutin::where('armada_id', $armada->id)->count())->toBe(1);
});

test('admin can view jadwal rutin filtered by wilayah', function () {
    $admin = User::factory()->admin()->create();
    $wilayah = Wilayah::factory()->create();
    $armada = Armada::factory()->create([
        'wilayah_id' => $wilayah->id,
        'status' => 'aktif',
    ]);
    $kampung = Kampung::factory()->create(['wilayah_id' => $wilayah->id]);
    JadwalRutin::factory()->create(['armada_id' => $armada->id, 'hari' => 1]);

    $this->actingAs($admin);

    $response = $this->get(route('admin.jadwal-rutin.index', ['wilayah_id' => $wilayah->id]));

    $response->assertOk();
});

test('admin can print jadwal rutin grouped by armada', function () {
    $admin = User::factory()->admin()->create();
    $wilayah = Wilayah::factory()->create();
    $armada = Armada::factory()->create([
        'wilayah_id' => $wilayah->id,
        'status' => 'aktif',
    ]);
    $kampung = Kampung::factory()->create(['wilayah_id' => $wilayah->id]);
    $jadwal = JadwalRutin::factory()->create(['armada_id' => $armada->id, 'hari' => 1]);
    $jadwal->kampung()->attach($kampung->id, ['urutan' => 0]);

    $this->actingAs($admin);

    $response = $this->get(route('admin.jadwal-rutin.print', ['wilayah_id' => $wilayah->id]));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});
