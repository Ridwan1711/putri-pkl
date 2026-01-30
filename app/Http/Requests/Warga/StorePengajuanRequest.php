<?php

namespace App\Http\Requests\Warga;

use Illuminate\Foundation\Http\FormRequest;

class StorePengajuanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isWarga() ?? false;
    }

    public function rules(): array
    {
        return [
            'wilayah_id' => ['nullable', 'exists:wilayah,id'],
            'alamat_lengkap' => ['required', 'string'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'estimasi_volume' => ['nullable', 'string', 'max:255'],
            'foto_sampah' => ['nullable', 'image', 'max:5120'],
        ];
    }
}
