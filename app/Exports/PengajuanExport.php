<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PengajuanExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(
        protected Collection $pengajuan
    ) {}

    public function collection(): Collection
    {
        return $this->pengajuan;
    }

    public function headings(): array
    {
        return ['No', 'Pemohon', 'Email', 'Telepon', 'Alamat', 'Wilayah', 'Kampung', 'Status', 'Estimasi (m³)', 'Tanggal'];
    }

    public function map($row): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $row->user?->name ?? $row->nama_pemohon ?? '-',
            $row->user?->email ?? $row->email ?? '-',
            $row->no_telepon ?? '-',
            $row->alamat_lengkap ?? '-',
            $row->wilayah?->nama_wilayah ?? '-',
            $row->kampung?->nama_kampung ?? '-',
            $row->status ?? '-',
            $row->estimasi_volume ?? 0,
            $row->created_at?->format('d/m/Y H:i') ?? '-',
        ];
    }
}
