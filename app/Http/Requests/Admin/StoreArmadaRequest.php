<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreArmadaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'kode_armada' => ['required', 'string', 'max:255', 'unique:armada,kode_armada'],
            'jenis_kendaraan' => ['required', 'string', 'max:255'],
            'plat_nomor' => ['required', 'string', 'max:255', 'unique:armada,plat_nomor'],
            'kapasitas' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'in:aktif,perbaikan,nonaktif'],
        ];
    }
}
