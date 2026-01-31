<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Armada extends Model
{
    use HasFactory;

    protected $table = 'armada';

    protected $fillable = [
        'wilayah_id',
        'kode_armada',
        'jenis_kendaraan',
        'plat_nomor',
        'kapasitas',
        'status',
        'tahun_pembuatan',
        'merk',
        'nomor_rangka',
        'nomor_mesin',
        'tanggal_stnk',
        'tanggal_keur',
        'bahan_bakar',
        'konsumsi_bahan_bakar',
        'lokasi_parkir',
        'asuransi',
        'kontrak_sewa',
        'keterangan',
        'is_available',
    ];

    protected function casts(): array
    {
        return [
            'kapasitas' => 'decimal:2',
            'konsumsi_bahan_bakar' => 'decimal:2',
            'tanggal_stnk' => 'date',
            'tanggal_keur' => 'date',
            'is_available' => 'boolean',
        ];
    }

    public function wilayah(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Wilayah::class);
    }

    public function petugas(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Petugas::class);
    }

    public function anggota(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ArmadaAnggota::class)->orderBy('urutan');
    }

    public function penugasan(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Penugasan::class);
    }

    public function jadwalRutin(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(JadwalRutin::class);
    }
}
