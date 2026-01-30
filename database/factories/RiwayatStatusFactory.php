<?php

namespace Database\Factories;

use App\Models\Aduan;
use App\Models\PengajuanPengangkutan;
use App\Models\RiwayatStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RiwayatStatus>
 */
class RiwayatStatusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $refType = fake()->randomElement(['pengajuan', 'aduan']);

        return [
            'ref_type' => $refType,
            'ref_id' => $refType === 'pengajuan' ? PengajuanPengangkutan::factory() : Aduan::factory(),
            'status' => fake()->word(),
            'keterangan' => fake()->optional()->sentence(),
            'changed_by' => User::factory(),
        ];
    }

    public function pengajuan(): static
    {
        return $this->state(fn (array $attributes) => [
            'ref_type' => 'pengajuan',
            'ref_id' => PengajuanPengangkutan::factory(),
            'status' => fake()->randomElement(['diajukan', 'diverifikasi', 'dijadwalkan', 'diangkut', 'selesai', 'ditolak']),
        ]);
    }

    public function aduan(): static
    {
        return $this->state(fn (array $attributes) => [
            'ref_type' => 'aduan',
            'ref_id' => Aduan::factory(),
            'status' => fake()->randomElement(['masuk', 'diproses', 'ditindak', 'selesai', 'ditolak']),
        ]);
    }
}
