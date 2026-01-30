<?php

namespace Database\Factories;

use App\Models\Aduan;
use App\Models\Lampiran;
use App\Models\PengajuanPengangkutan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lampiran>
 */
class LampiranFactory extends Factory
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
            'file_path' => 'uploads/' . fake()->uuid() . '.jpg',
            'file_type' => fake()->randomElement(['image/jpeg', 'image/png', 'image/jpg']),
            'uploaded_at' => now(),
        ];
    }

    public function pengajuan(): static
    {
        return $this->state(fn (array $attributes) => [
            'ref_type' => 'pengajuan',
            'ref_id' => PengajuanPengangkutan::factory(),
        ]);
    }

    public function aduan(): static
    {
        return $this->state(fn (array $attributes) => [
            'ref_type' => 'aduan',
            'ref_id' => Aduan::factory(),
        ]);
    }
}
