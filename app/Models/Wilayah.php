<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wilayah extends Model
{
    use HasFactory;

    protected $table = 'wilayah';

    protected $fillable = [
        'nama_wilayah',
        'kecamatan',
        'geojson',
        'latitude',
        'longitude',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    public function pengajuanPengangkutan(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PengajuanPengangkutan::class);
    }

    public function petugas(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Petugas::class);
    }

    public function kampung(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Kampung::class);
    }

    public function armada(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Armada::class, 'wilayah_id');
    }
}
