<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Armada>
 */
class ArmadaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kode_armada' => 'ARM-'.fake()->unique()->numerify('####'),
            'jenis_kendaraan' => fake()->randomElement(['Truk Sampah', 'Dump Truck', 'Pickup', 'Mini Truck', 'Container']),
            'plat_nomor' => fake()->unique()->regexify('[A-Z]{1,2} [0-9]{1,4} [A-Z]{1,3}'),
            'kapasitas' => fake()->randomFloat(2, 5, 20),
            'status' => fake()->randomElement(['aktif', 'perbaikan', 'nonaktif']),
            'tahun_pembuatan' => fake()->numberBetween(2018, (int) date('Y')),
            'merk' => fake()->randomElement(['Toyota', 'Mitsubishi', 'Isuzu', 'Hino', null]),
            'nomor_rangka' => fake()->optional()->regexify('[A-Z0-9]{17}'),
            'nomor_mesin' => fake()->optional()->regexify('[A-Z0-9]{8,12}'),
            'tanggal_stnk' => fake()->optional()->dateTimeBetween('now', '+2 years'),
            'tanggal_keur' => fake()->optional()->dateTimeBetween('now', '+1 year'),
            'bahan_bakar' => fake()->randomElement(['solar', 'bensin', 'listrik', 'hybrid']),
            'konsumsi_bahan_bakar' => fake()->optional()->randomFloat(1, 5, 15),
            'lokasi_parkir' => fake()->optional()->address(),
            'asuransi' => fake()->optional()->company(),
            'kontrak_sewa' => null,
            'keterangan' => null,
            'is_available' => true,
        ];
    }

    public function aktif(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'aktif',
        ]);
    }

    public function perbaikan(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'perbaikan',
        ]);
    }

    public function nonaktif(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'nonaktif',
        ]);
    }
}
