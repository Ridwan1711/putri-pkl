<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiwayatStatus extends Model
{
    use HasFactory;
    protected $table = 'riwayat_status';
    protected $fillable = [
        'ref_type',
        'ref_id',
        'status',
        'keterangan',
        'changed_by',
    ];

    protected function casts(): array
    {
        return [
            'ref_id' => 'integer',
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

    public function changedBy(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
