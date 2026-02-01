<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class KampungExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(
        protected Collection $kampung
    ) {}

    public function collection(): Collection
    {
        return $this->kampung;
    }

    public function headings(): array
    {
        return ['No', 'Nama Kampung', 'Latitude', 'Longitude', 'Urutan Rute', 'Tanggal'];
    }

    public function map($row): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $row->nama_kampung,
            $row->latitude,
            $row->longitude,
            $row->urutan_rute ?? 0,
            $row->created_at?->format('d/m/Y H:i') ?? '-',
        ];
    }
}
