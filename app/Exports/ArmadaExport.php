<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ArmadaExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(
        protected Collection $armada
    ) {}

    public function collection(): Collection
    {
        return $this->armada;
    }

    public function headings(): array
    {
        return ['No', 'Kode', 'Plat', 'Jenis', 'Kapasitas', 'Wilayah', 'Status', 'Tanggal'];
    }

    public function map($row): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $row->kode_armada ?? '-',
            $row->plat_nomor ?? '-',
            $row->jenis_kendaraan ?? '-',
            $row->kapasitas ?? 0,
            $row->wilayah?->nama_wilayah ?? '-',
            $row->status ?? '-',
            $row->created_at?->format('d/m/Y H:i') ?? '-',
        ];
    }
}
