<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JadwalRutinKampung extends Model
{
    protected $table = 'jadwal_rutin_kampung';

    protected $fillable = [
        'jadwal_rutin_id',
        'kampung_id',
        'urutan',
    ];

    protected function casts(): array
    {
        return [
            'urutan' => 'integer',
        ];
    }

    public function jadwalRutin(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(JadwalRutin::class);
    }

    public function kampung(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Kampung::class);
    }
}
