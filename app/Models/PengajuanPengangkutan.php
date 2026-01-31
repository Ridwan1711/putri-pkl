<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengajuanPengangkutan extends Model
{
    use HasFactory;

    protected $table = 'pengajuan_pengangkutan';

    protected $fillable = [
        'user_id',
        'nama_pemohon',
        'no_telepon',
        'email',
        'ip_address',
        'wilayah_id',
        'kampung_id',
        'alamat_lengkap',
        'latitude',
        'longitude',
        'estimasi_volume',
        'foto_sampah',
        'status',
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

    public function wilayah(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Wilayah::class);
    }

    public function kampung(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Kampung::class);
    }

    public function penugasan(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Penugasan::class, 'pengajuan_id');
    }

    public function riwayatStatus(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(RiwayatStatus::class, 'ref_id')->where('ref_type', 'pengajuan');
    }

    public function lampiran(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Lampiran::class, 'ref_id')->where('ref_type', 'pengajuan');
    }
}
