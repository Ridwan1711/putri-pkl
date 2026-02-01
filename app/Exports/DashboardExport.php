<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class DashboardExport implements WithMultipleSheets
{
    public function __construct(
        protected array $reports
    ) {}

    public function sheets(): array
    {
        $sheets = [];

        $ringkasan = $this->reports['ringkasan'] ?? [];
        $perWilayah = $this->reports['per_wilayah'] ?? [];
        $pengajuanTerbaru = $this->reports['pengajuan_terbaru'] ?? [];

        $sheets[] = new DashboardRingkasanSheet($ringkasan);
        $sheets[] = new DashboardWilayahSheet($perWilayah);
        $sheets[] = new DashboardPengajuanSheet($pengajuanTerbaru);

        return $sheets;
    }
}
