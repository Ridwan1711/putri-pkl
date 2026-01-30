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
        'armada_id',
        'wilayah_id',
        'is_available',
    ];

    protected function casts(): array
    {
        return [
            'is_available' => 'boolean',
        ];
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function armada(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Armada::class);
    }

    public function wilayah(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Wilayah::class);
    }

    public function penugasan(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Penugasan::class);
    }
}
