<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class DashboardRingkasanSheet implements FromArray, WithHeadings, WithTitle
{
    public function __construct(
        protected array $ringkasan
    ) {}

    public function array(): array
    {
        return [
            ['Total Pengajuan', $this->ringkasan['total_pengajuan'] ?? 0],
            ['Selesai', $this->ringkasan['selesai'] ?? 0],
            ['Ditolak', $this->ringkasan['ditolak'] ?? 0],
            ['Sampah Terkumpul (Kg)', $this->ringkasan['sampah_kg'] ?? 0],
            ['Sampah Terkumpul (Ton)', $this->ringkasan['sampah_ton'] ?? 0],
            ['Tanggal Cetak', $this->ringkasan['tanggal_cetak'] ?? now()->format('d/m/Y H:i')],
        ];
    }

    public function headings(): array
    {
        return ['Metrik', 'Nilai'];
    }

    public function title(): string
    {
        return 'Ringkasan';
    }
}
