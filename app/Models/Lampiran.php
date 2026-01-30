<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lampiran extends Model
{
    use HasFactory;
    protected $table = 'lampiran';
    protected $fillable = [
        'ref_type',
        'ref_id',
        'file_path',
        'file_type',
        'uploaded_at',
    ];

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'ref_id' => 'integer',
            'uploaded_at' => 'datetime',
        ];
    }

    public function pengajuan(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(PengajuanPengangkutan::class, 'ref_id')->where('ref_type', 'pengajuan');
    }

    public function aduan(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Aduan::class, 'ref_id')->where('ref_type', 'aduan');
    }
}
