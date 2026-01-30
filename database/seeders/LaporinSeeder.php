<?php

namespace Database\Seeders;

use App\Models\Armada;
use App\Models\Petugas;
use App\Models\User;
use App\Models\Wilayah;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class LaporinSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin
        $admin = User::create([
            'name' => 'Admin Laporin',
            'email' => 'admin@laporin.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create Petugas
        $petugas1 = User::create([
            'name' => 'Petugas 1',
            'email' => 'petugas1@laporin.test',
            'password' => Hash::make('password'),
            'role' => 'petugas',
            'is_active' => true,
        ]);

        $petugas2 = User::create([
            'name' => 'Petugas 2',
            'email' => 'petugas2@laporin.test',
            'password' => Hash::make('password'),
            'role' => 'petugas',
            'is_active' => true,
        ]);

        // Create Warga
        $warga1 = User::create([
            'name' => 'Warga 1',
            'email' => 'warga1@laporin.test',
            'password' => Hash::make('password'),
            'role' => 'warga',
            'is_active' => true,
        ]);

        $warga2 = User::create([
            'name' => 'Warga 2',
            'email' => 'warga2@laporin.test',
            'password' => Hash::make('password'),
            'role' => 'warga',
            'is_active' => true,
        ]);

        // Create Wilayah
        $wilayah1 = Wilayah::create([
            'nama_wilayah' => 'Wilayah A',
            'kecamatan' => 'Kecamatan A',
            'geojson' => null,
            'is_active' => true,
        ]);

        $wilayah2 = Wilayah::create([
            'nama_wilayah' => 'Wilayah B',
            'kecamatan' => 'Kecamatan B',
            'geojson' => null,
            'is_active' => true,
        ]);

        // Create Armada
        $armada1 = Armada::create([
            'kode_armada' => 'ARM-001',
            'jenis_kendaraan' => 'Truk',
            'plat_nomor' => 'B 1234 ABC',
            'kapasitas' => 10.00,
            'status' => 'aktif',
        ]);

        $armada2 = Armada::create([
            'kode_armada' => 'ARM-002',
            'jenis_kendaraan' => 'Pickup',
            'plat_nomor' => 'B 5678 DEF',
            'kapasitas' => 5.00,
            'status' => 'aktif',
        ]);

        // Create Petugas
        Petugas::create([
            'user_id' => $petugas1->id,
            'armada_id' => $armada1->id,
            'wilayah_id' => $wilayah1->id,
            'is_available' => true,
        ]);

        Petugas::create([
            'user_id' => $petugas2->id,
            'armada_id' => $armada2->id,
            'wilayah_id' => $wilayah2->id,
            'is_available' => true,
        ]);
    }
}
