<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penugasan extends Model
{
    use HasFactory;
    protected $table = 'penugasan';
    protected $fillable = [
        'pengajuan_id',
        'petugas_id',
        'armada_id',
        'jadwal_angkut',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'jadwal_angkut' => 'datetime',
        ];
    }

    public function pengajuanPengangkutan(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(PengajuanPengangkutan::class, 'pengajuan_id');
    }

    public function petugas(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Petugas::class);
    }

    public function armada(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Armada::class);
    }
}
