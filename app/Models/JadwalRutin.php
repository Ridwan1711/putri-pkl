<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalRutin extends Model
{
    use HasFactory;

    protected $table = 'jadwal_rutin';

    protected $fillable = [
        'petugas_id',
        'armada_id',
        'hari',
        'wilayah_id',
    ];

    public function petugas(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Petugas::class);
    }

    public function armada(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Armada::class);
    }

    public function wilayah(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Wilayah::class);
    }

    public function scopeHari(Builder $query, int $hari): Builder
    {
        return $query->where('hari', $hari);
    }

    public function scopePetugas(Builder $query, int $petugasId): Builder
    {
        return $query->where('petugas_id', $petugasId);
    }
}
