<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class DashboardWilayahSheet implements FromArray, WithHeadings, WithTitle
{
    public function __construct(
        protected array $perWilayah
    ) {}

    public function array(): array
    {
        $rows = [];
        foreach ($this->perWilayah as $i => $w) {
            $rows[] = [
                $i + 1,
                $w['nama'] ?? '-',
                $w['kecamatan'] ?? '-',
                $w['total_pengajuan'] ?? 0,
                ($w['is_active'] ?? true) ? 'Aktif' : 'Nonaktif',
            ];
        }

        return $rows;
    }

    public function headings(): array
    {
        return ['No', 'Desa', 'Kecamatan', 'Total Pengajuan', 'Status'];
    }

    public function title(): string
    {
        return 'Per Wilayah';
    }
}
