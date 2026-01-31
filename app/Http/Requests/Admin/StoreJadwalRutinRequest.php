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
            'armada_id' => ['required', 'exists:armada,id'],
            'hari' => ['required', 'integer', 'in:1,2,3,4,5,6,7'],
            'kampung_ids' => ['required', 'array', 'min:1'],
            'kampung_ids.*' => ['required', 'exists:kampung,id'],
        ];
    }
}
