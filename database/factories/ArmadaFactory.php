<?php

namespace Database\Factories;

use App\Models\Armada;
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
            'kode_armada' => 'ARM-' . fake()->unique()->numerify('####'),
            'jenis_kendaraan' => fake()->randomElement(['Truk', 'Pickup', 'Dump Truck', 'Compactor']),
            'plat_nomor' => fake()->unique()->regexify('[A-Z]{1,2} [0-9]{1,4} [A-Z]{1,3}'),
            'kapasitas' => fake()->randomFloat(2, 5, 20),
            'status' => fake()->randomElement(['aktif', 'perbaikan', 'nonaktif']),
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
