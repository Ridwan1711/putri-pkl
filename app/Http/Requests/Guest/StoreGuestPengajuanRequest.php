<?php

namespace App\Http\Requests\Guest;

use Illuminate\Foundation\Http\FormRequest;

class StoreGuestPengajuanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->input('wilayah_id') === '') {
            $this->merge(['wilayah_id' => null]);
        }
    }

    public function rules(): array
    {
        return [
            'nama_pemohon' => ['required', 'string', 'max:255'],
            'no_telepon' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email'],
            'wilayah_id' => ['nullable', 'exists:wilayah,id'],
            'alamat_lengkap' => ['required', 'string'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'estimasi_volume' => ['nullable', 'string', 'max:255'],
            'foto_sampah' => ['required', 'image', 'max:5120'],
        ];
    }
}
