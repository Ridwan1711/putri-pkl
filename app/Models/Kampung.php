<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kampung extends Model
{
    use HasFactory;

    protected $table = 'kampung';

    protected $fillable = [
        'wilayah_id',
        'nama_kampung',
        'latitude',
        'longitude',
        'urutan_rute',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'urutan_rute' => 'integer',
        ];
    }

    public function wilayah(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Wilayah::class);
    }

    public function jadwalRutinKampung(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(JadwalRutinKampung::class);
    }

    public function jadwalRutin(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(JadwalRutin::class, 'jadwal_rutin_kampung')
            ->withPivot('urutan');
    }

    public function pengajuanPengangkutan(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PengajuanPengangkutan::class);
    }
}
