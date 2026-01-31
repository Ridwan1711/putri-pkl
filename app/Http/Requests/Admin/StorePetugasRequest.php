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

    protected function prepareForValidation(): void
    {
        $merge = [];
        if ($this->filled('armada_id') && ($this->input('armada_id') === '' || $this->input('armada_id') === '_none')) {
            $merge['armada_id'] = null;
        }
        if ($this->filled('wilayah_id') && ($this->input('wilayah_id') === '' || $this->input('wilayah_id') === '_none')) {
            $merge['wilayah_id'] = null;
        }
        if ($merge !== []) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'user_id' => [
                'nullable',
                'required_without:create_user',
                'exists:users,id',
                Rule::exists('users', 'id')->where('role', 'petugas'),
            ],
            'create_user' => ['nullable', 'array', 'required_without:user_id'],
            'create_user.name' => ['required_with:create_user', 'string', 'max:255'],
            'create_user.email' => ['required_with:create_user', 'email', 'unique:users,email'],
            'create_user.password' => ['required_with:create_user', 'string', 'min:8', 'confirmed'],
            'armada_id' => ['nullable', 'exists:armada,id'],
            'wilayah_id' => ['nullable', 'exists:wilayah,id'],
            'is_available' => ['boolean'],
            'hari_libur' => ['nullable', 'array', 'max:3'],
            'hari_libur.*' => ['integer', 'in:1,2,3,4,5,6,7'],
        ];
    }

    public function attributes(): array
    {
        return [
            'create_user.name' => 'nama',
            'create_user.email' => 'email',
            'create_user.password' => 'password',
        ];
    }
}
