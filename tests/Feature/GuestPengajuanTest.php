<?php

use App\Models\PengajuanPengangkutan;
use App\Models\Wilayah;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('guest pengajuan requires wilayah_id', function () {
    $foto = UploadedFile::fake()->image('sampah.jpg');
    $response = $this->post(route('pengajuan.guest.store'), [
        'nama_pemohon' => 'Budi',
        'no_telepon' => '08123456789',
        'email' => 'budi@example.com',
        'alamat_lengkap' => 'Jl. Contoh',
        'foto_sampah' => $foto,
    ]);
    $response->assertSessionHasErrors('wilayah_id');
});

test('guests can submit pengajuan without login', function () {
    $wilayah = Wilayah::factory()->create();
    $foto = UploadedFile::fake()->image('sampah.jpg');

    $response = $this->post(route('pengajuan.guest.store'), [
        'nama_pemohon' => 'Budi Santoso',
        'no_telepon' => '08123456789',
        'email' => 'budi@example.com',
        'wilayah_id' => $wilayah->id,
        'alamat_lengkap' => 'Jl. Contoh No. 123',
        'estimasi_volume' => '2 m³',
        'foto_sampah' => $foto,
    ]);

    $response->assertRedirect(route('home'));
    $response->assertSessionHas('success');

    $pengajuan = PengajuanPengangkutan::latest()->first();
    expect($pengajuan)->not->toBeNull();
    expect($pengajuan->user_id)->toBeNull();
    expect($pengajuan->nama_pemohon)->toBe('Budi Santoso');
    expect($pengajuan->email)->toBe('budi@example.com');
    expect($pengajuan->no_telepon)->toBe('08123456789');
    expect($pengajuan->status)->toBe('diajukan');
});

test('guest pengajuan is rate limited', function () {
    $wilayah = Wilayah::factory()->create(['is_active' => true]);
    $foto = UploadedFile::fake()->image('sampah.jpg');
    $data = [
        'nama_pemohon' => 'Budi',
        'no_telepon' => '08123456789',
        'email' => 'budi@example.com',
        'wilayah_id' => $wilayah->id,
        'alamat_lengkap' => 'Jl. Contoh',
        'foto_sampah' => $foto,
    ];

    foreach (range(1, 4) as $i) {
        $response = $this->post(route('pengajuan.guest.store'), $data);
        if ($i <= 3) {
            $response->assertRedirect(route('home'));
        } else {
            $response->assertStatus(429);
        }
    }
});
