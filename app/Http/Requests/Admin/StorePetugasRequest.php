<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePetugasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id', Rule::exists('users', 'id')->where('role', 'petugas')],
            'armada_id' => ['nullable', 'exists:armada,id'],
            'wilayah_id' => ['nullable', 'exists:wilayah,id'],
            'is_available' => ['boolean'],
        ];
    }
}
