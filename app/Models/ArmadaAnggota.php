<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArmadaAnggota extends Model
{
    use HasFactory;

    protected $table = 'armada_anggota';

    protected $fillable = [
        'armada_id',
        'nama',
        'no_hp',
        'urutan',
    ];

    protected function casts(): array
    {
        return [
            'urutan' => 'integer',
        ];
    }

    public function armada(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Armada::class);
    }
}
