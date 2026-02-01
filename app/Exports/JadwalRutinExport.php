<?php

namespace App\Exports;

use App\Enums\Hari;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class JadwalRutinExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(
        protected Collection $jadwalRutin
    ) {}

    public function collection(): Collection
    {
        return $this->jadwalRutin;
    }

    public function headings(): array
    {
        return ['No', 'Armada', 'Hari', 'Kampung', 'Wilayah'];
    }

    public function map($row): array
    {
        static $no = 0;
        $no++;

        $hariLabel = isset($row->hari) ? (Hari::tryFrom($row->hari)?->label() ?? $row->hari) : '-';
        $kampungList = $row->kampung?->pluck('nama_kampung')->implode(', ') ?? '-';

        return [
            $no,
            $row->armada?->kode_armada ?? '-',
            $hariLabel,
            $kampungList,
            $row->armada?->wilayah?->nama_wilayah ?? '-',
        ];
    }
}
