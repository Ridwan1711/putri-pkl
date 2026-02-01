<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class DashboardPengajuanSheet implements FromArray, WithHeadings, WithTitle
{
    public function __construct(
        protected array $pengajuanTerbaru
    ) {}

    public function array(): array
    {
        $rows = [];
        foreach ($this->pengajuanTerbaru as $i => $p) {
            $rows[] = [
                $i + 1,
                $p['nama_pemohon'] ?? '-',
                $p['wilayah'] ?? '-',
                $p['kampung'] ?? '-',
                $p['status'] ?? '-',
                $p['created_at'] ?? '-',
            ];
        }

        return $rows;
    }

    public function headings(): array
    {
        return ['No', 'Pemohon', 'Wilayah', 'Kampung', 'Status', 'Tanggal'];
    }

    public function title(): string
    {
        return 'Pengajuan Terbaru';
    }
}
