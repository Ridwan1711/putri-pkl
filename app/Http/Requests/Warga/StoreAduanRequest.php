<?php

namespace App\Http\Requests\Warga;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAduanRequest extends FormRequest
{
    public const KATEGORI_OPTIONS = [
        'Sampah Menumpuk',
        'Bau Tidak Sedap',
        'Lokasi Tidak Terjangkau',
        'Kinerja Petugas',
        'Keterlambatan Pengangkutan',
        'Layanan Aplikasi',
        'Lainnya',
    ];

    public function authorize(): bool
    {
        return $this->user()?->isWarga() ?? false;
    }

    public function rules(): array
    {
        return [
            'kategori' => ['required', 'string', Rule::in(self::KATEGORI_OPTIONS)],
            'deskripsi' => ['required', 'string'],
            'foto_bukti' => ['nullable', 'image', 'max:5120'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ];
    }

    public function messages(): array
    {
        return [
            'kategori.in' => 'Kategori yang dipilih tidak valid.',
        ];
    }
}
