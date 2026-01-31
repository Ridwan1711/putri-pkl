<?php

namespace App\Http\Requests\Guest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGuestPengajuanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_pemohon' => ['required', 'string', 'max:255'],
            'no_telepon' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email'],
            'wilayah_id' => ['required', Rule::exists('wilayah', 'id')->where('is_active', true)],
            'kampung_id' => [
                'required',
                Rule::exists('kampung', 'id')->where('wilayah_id', $this->input('wilayah_id')),
            ],
            'alamat_lengkap' => ['required', 'string'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'estimasi_volume' => ['nullable', 'string', 'max:255'],
            'foto_sampah' => ['required', 'image', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'wilayah_id.required' => 'Pilih desa/wilayah layanan yang tersedia.',
            'wilayah_id.exists' => 'Desa/wilayah yang dipilih tidak valid atau tidak aktif.',
            'kampung_id.required' => 'Pilih kampung/dusun.',
            'kampung_id.exists' => 'Kampung yang dipilih tidak valid.',
        ];
    }
}
