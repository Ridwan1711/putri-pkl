<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aduan extends Model
{
    use HasFactory;

    protected $table = 'aduan';

    protected $fillable = [
        'user_id',
        'kategori',
        'deskripsi',
        'foto_bukti',
        'latitude',
        'longitude',
        'status',
        'tindak_lanjut',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function riwayatStatus(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(RiwayatStatus::class, 'ref_id')->where('ref_type', 'aduan');
    }

    public function lampiran(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Lampiran::class, 'ref_id')->where('ref_type', 'aduan');
    }
}
