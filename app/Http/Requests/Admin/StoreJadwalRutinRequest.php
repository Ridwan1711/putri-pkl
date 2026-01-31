<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreJadwalRutinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'petugas_id' => ['required', 'exists:petugas,id'],
            'armada_id' => ['required', 'exists:armada,id'],
            'hari' => ['required', 'integer', 'in:1,2,3,4,5,6,7'],
            'wilayah_ids' => ['required', 'array', 'min:1'],
            'wilayah_ids.*' => ['required', 'exists:wilayah,id'],
        ];
    }
}
