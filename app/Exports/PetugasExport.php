<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PetugasExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(
        protected Collection $petugas
    ) {}

    public function collection(): Collection
    {
        return $this->petugas;
    }

    public function headings(): array
    {
        return ['No', 'Nama', 'Email', 'Wilayah', 'Armada', 'Status', 'Tanggal'];
    }

    public function map($row): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $row->user?->name ?? '-',
            $row->user?->email ?? '-',
            $row->wilayah?->nama_wilayah ?? '-',
            $row->armada?->kode_armada ?? '-',
            $row->is_available ? 'Aktif' : 'Tidak Aktif',
            $row->created_at?->format('d/m/Y H:i') ?? '-',
        ];
    }
}
