<?php

use App\Models\Petugas;
use App\Models\User;

test('petugas can view dashboard', function () {
    $user = User::factory()->petugas()->create();
    Petugas::factory()->create(['user_id' => $user->id]);
    $this->actingAs($user);

    $response = $this->get(route('petugas.dashboard'));

    $response->assertOk();
});

test('petugas can view peta lokasi', function () {
    $user = User::factory()->petugas()->create();
    Petugas::factory()->create(['user_id' => $user->id]);
    $this->actingAs($user);

    $response = $this->get(route('petugas.peta.index'));

    $response->assertOk();
});
