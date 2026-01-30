<?php

namespace Database\Factories;

use App\Models\PengajuanPengangkutan;
use App\Models\User;
use App\Models\Wilayah;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PengajuanPengangkutan>
 */
class PengajuanPengangkutanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->warga(),
            'wilayah_id' => Wilayah::factory(),
            'alamat_lengkap' => fake()->address(),
            'latitude' => fake()->latitude(-6.2, -6.3),
            'longitude' => fake()->longitude(106.7, 106.9),
            'estimasi_volume' => fake()->randomElement(['1 m³', '2 m³', '3 m³', '5 m³']),
            'foto_sampah' => null,
            'status' => fake()->randomElement(['diajukan', 'diverifikasi', 'dijadwalkan', 'diangkut', 'selesai', 'ditolak']),
        ];
    }

    public function diajukan(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'diajukan',
        ]);
    }

    public function diverifikasi(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'diverifikasi',
        ]);
    }

    public function dijadwalkan(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'dijadwalkan',
        ]);
    }

    public function diangkut(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'diangkut',
        ]);
    }

    public function selesai(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'selesai',
        ]);
    }

    public function ditolak(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'ditolak',
        ]);
    }
}
