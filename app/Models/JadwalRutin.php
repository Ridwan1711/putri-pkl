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
        'armada_id',
        'hari',
    ];

    public function armada(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Armada::class);
    }

    public function jadwalRutinKampung(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(JadwalRutinKampung::class);
    }

    public function kampung(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Kampung::class, 'jadwal_rutin_kampung')
            ->withPivot('urutan')
            ->orderByPivot('urutan');
    }

    public function scopeHari(Builder $query, int $hari): Builder
    {
        return $query->where('hari', $hari);
    }

    public function scopeArmada(Builder $query, int $armadaId): Builder
    {
        return $query->where('armada_id', $armadaId);
    }
}
