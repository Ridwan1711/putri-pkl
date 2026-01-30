<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateArmadaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        $armadaId = $this->route('armada');

        return [
            'kode_armada' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('armada', 'kode_armada')->ignore($armadaId)],
            'jenis_kendaraan' => ['sometimes', 'required', 'string', 'max:255'],
            'plat_nomor' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('armada', 'plat_nomor')->ignore($armadaId)],
            'kapasitas' => ['sometimes', 'required', 'numeric', 'min:0'],
            'status' => ['sometimes', 'required', 'in:aktif,perbaikan,nonaktif'],
        ];
    }
}
