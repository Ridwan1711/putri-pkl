<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AssignPenugasanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'pengajuan_id' => ['required', 'exists:pengajuan_pengangkutan,id'],
            'petugas_id' => ['required', 'exists:petugas,id'],
            'armada_id' => ['nullable', 'exists:armada,id'],
            'jadwal_angkut' => ['required', 'date', 'after:now'],
        ];
    }
}
