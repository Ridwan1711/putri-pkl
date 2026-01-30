<?php

namespace Database\Factories;

use App\Models\Aduan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Aduan>
 */
class AduanFactory extends Factory
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
            'kategori' => fake()->randomElement(['Sampah Menumpuk', 'Bau Tidak Sedap', 'Lokasi Tidak Terjangkau', 'Lainnya']),
            'deskripsi' => fake()->paragraph(),
            'foto_bukti' => null,
            'latitude' => fake()->latitude(-6.2, -6.3),
            'longitude' => fake()->longitude(106.7, 106.9),
            'status' => fake()->randomElement(['masuk', 'diproses', 'ditindak', 'selesai', 'ditolak']),
        ];
    }

    public function masuk(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'masuk',
        ]);
    }

    public function diproses(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'diproses',
        ]);
    }

    public function ditindak(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'ditindak',
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
