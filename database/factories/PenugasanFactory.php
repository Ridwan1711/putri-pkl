<?php

namespace Database\Factories;

use App\Models\Armada;
use App\Models\Penugasan;
use App\Models\PengajuanPengangkutan;
use App\Models\Petugas;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Penugasan>
 */
class PenugasanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'pengajuan_id' => PengajuanPengangkutan::factory(),
            'petugas_id' => Petugas::factory(),
            'armada_id' => Armada::factory(),
            'jadwal_angkut' => fake()->dateTimeBetween('now', '+7 days'),
            'status' => fake()->randomElement(['aktif', 'selesai', 'batal']),
        ];
    }

    public function aktif(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'aktif',
        ]);
    }

    public function selesai(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'selesai',
        ]);
    }

    public function batal(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'batal',
        ]);
    }
}
