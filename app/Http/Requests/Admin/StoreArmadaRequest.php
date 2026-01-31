<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreArmadaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        foreach (['tahun_pembuatan', 'merk', 'nomor_rangka', 'nomor_mesin', 'tanggal_stnk', 'tanggal_keur', 'bahan_bakar', 'konsumsi_bahan_bakar', 'lokasi_parkir', 'asuransi', 'kontrak_sewa', 'keterangan'] as $key) {
            if ($this->has($key) && $this->input($key) === '') {
                $merge[$key] = null;
            }
        }
        if ($merge) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'wilayah_id' => ['required', 'exists:wilayah,id'],
            'kode_armada' => ['required', 'string', 'max:255', 'unique:armada,kode_armada'],
            'jenis_kendaraan' => ['required', 'string', 'max:255'],
            'plat_nomor' => ['required', 'string', 'max:255', 'unique:armada,plat_nomor'],
            'kapasitas' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'in:aktif,perbaikan,nonaktif'],
            'tahun_pembuatan' => ['nullable', 'integer', 'min:1990', 'max:'.(int) date('Y')],
            'merk' => ['nullable', 'string', 'max:255'],
            'nomor_rangka' => ['nullable', 'string', 'max:255'],
            'nomor_mesin' => ['nullable', 'string', 'max:255'],
            'tanggal_stnk' => ['nullable', 'date'],
            'tanggal_keur' => ['nullable', 'date'],
            'bahan_bakar' => ['nullable', 'in:solar,bensin,listrik,hybrid'],
            'konsumsi_bahan_bakar' => ['nullable', 'numeric', 'min:0'],
            'lokasi_parkir' => ['nullable', 'string', 'max:255'],
            'asuransi' => ['nullable', 'string', 'max:255'],
            'kontrak_sewa' => ['nullable', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string'],
            'is_available' => ['boolean'],
            'anggota' => ['nullable', 'array', 'max:5'],
            'anggota.*.nama' => ['required_with:anggota.*', 'string', 'max:255'],
            'anggota.*.no_hp' => ['nullable', 'string', 'max:20'],
        ];
    }
}
