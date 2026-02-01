<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class WilayahExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(
        protected Collection $wilayah
    ) {}

    public function collection(): Collection
    {
        return $this->wilayah;
    }

    public function headings(): array
    {
        return ['No', 'Nama Wilayah', 'Kecamatan', 'Jumlah Kampung', 'Status', 'Tanggal'];
    }

    public function map($row): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $row->nama_wilayah,
            $row->kecamatan,
            $row->relationLoaded('kampung') ? $row->kampung->count() : ($row->kampung_count ?? 0),
            $row->is_active ? 'Aktif' : 'Nonaktif',
            $row->created_at?->format('d/m/Y H:i') ?? '-',
        ];
    }
}
