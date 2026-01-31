<?php

namespace Database\Factories;

use App\Models\Armada;
use App\Models\JadwalRutin;
use App\Models\Petugas;
use App\Models\Wilayah;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JadwalRutin>
 */
class JadwalRutinFactory extends Factory
{
    protected $model = JadwalRutin::class;

    public function definition(): array
    {
        return [
            'petugas_id' => Petugas::factory(),
            'armada_id' => Armada::factory(),
            'hari' => fake()->numberBetween(1, 7),
            'wilayah_id' => Wilayah::factory(),
        ];
    }
}
