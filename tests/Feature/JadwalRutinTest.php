<?php

use App\Models\JadwalRutin;
use App\Models\User;

test('admin can view jadwal rutin index', function () {
    $admin = User::factory()->admin()->create();
    $this->actingAs($admin);

    $response = $this->get(route('admin.jadwal-rutin.index'));

    $response->assertOk();
});

test('admin can store jadwal rutin', function () {
    $admin = User::factory()->admin()->create();
    $petugas = \App\Models\Petugas::factory()->create(['hari_libur' => [6, 7]]);
    $armada = \App\Models\Armada::factory()->create();
    $wilayah = \App\Models\Wilayah::factory()->create();
    $this->actingAs($admin);

    $response = $this->post(route('admin.jadwal-rutin.store'), [
        'petugas_id' => $petugas->id,
        'armada_id' => $armada->id,
        'hari' => 1,
        'wilayah_ids' => [$wilayah->id],
    ]);

    $response->assertRedirect();
    expect(JadwalRutin::where('petugas_id', $petugas->id)->count())->toBe(1);
});
