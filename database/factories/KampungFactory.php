<?php

namespace Database\Factories;

use App\Models\Wilayah;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Kampung>
 */
class KampungFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'wilayah_id' => Wilayah::factory(),
            'nama_kampung' => 'Kampung '.$this->faker->unique()->word(),
            'latitude' => $this->faker->latitude(-7.5, -6.5),
            'longitude' => $this->faker->longitude(106.5, 107.5),
            'urutan_rute' => $this->faker->numberBetween(0, 10),
        ];
    }
}
