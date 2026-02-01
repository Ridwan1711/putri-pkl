<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Petugas extends Model
{
    use HasFactory;

    protected $table = 'petugas';

    protected $fillable = [
        'user_id',
        'wilayah_id',
        'is_available',
        'hari_libur',
    ];

    protected function casts(): array
    {
        return [
            'is_available' => 'boolean',
            'hari_libur' => 'array',
        ];
    }

    public function isLibur(int $hari): bool
    {
        $hariLibur = $this->hari_libur ?? [];

        return in_array($hari, $hariLibur);
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function armada(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Armada::class, 'petugas_id');
    }

    public function wilayah(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Wilayah::class);
    }

    public function penugasan(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Penugasan::class);
    }

    public function jadwalRutin(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(JadwalRutin::class, Armada::class, 'petugas_id', 'armada_id', 'id', 'id');
    }
}
