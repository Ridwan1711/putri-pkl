<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePetugasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['sometimes', 'required', 'exists:users,id', Rule::exists('users', 'id')->where('role', 'petugas')],
            'wilayah_id' => ['nullable', 'exists:wilayah,id'],
            'is_available' => ['sometimes', 'boolean'],
            'hari_libur' => ['nullable', 'array', 'max:3'],
            'hari_libur.*' => ['integer', 'in:1,2,3,4,5,6,7'],
        ];
    }
}
