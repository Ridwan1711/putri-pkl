<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Armada extends Model
{
    use HasFactory;
    protected $table = 'armada';    
    protected $fillable = [
        'kode_armada',
        'jenis_kendaraan',
        'plat_nomor',
        'kapasitas',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'kapasitas' => 'decimal:2',
        ];
    }

    public function petugas(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Petugas::class);
    }

    public function penugasan(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Penugasan::class);
    }
}
