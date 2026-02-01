<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Jadwal Rutin Per Armada</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
            line-height: 1.4;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #333;
        }
        .header h1 {
            font-size: 16px;
            margin-bottom: 5px;
        }
        .header .subtitle {
            font-size: 11px;
            color: #666;
        }
        .meta {
            font-size: 9px;
            color: #666;
            margin-bottom: 15px;
        }
        .armada-section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        .armada-header {
            background-color: #2563eb;
            color: white;
            padding: 10px 12px;
            margin-bottom: 10px;
        }
        .armada-header h2 {
            font-size: 14px;
            margin-bottom: 3px;
        }
        .armada-header .info {
            font-size: 10px;
            opacity: 0.9;
        }
        .armada-details {
            display: table;
            width: 100%;
            margin-bottom: 12px;
            background-color: #f8fafc;
            padding: 8px 12px;
            border-left: 3px solid #2563eb;
        }
        .detail-row {
            display: table-row;
        }
        .detail-label {
            display: table-cell;
            width: 100px;
            font-weight: bold;
            padding: 3px 0;
            color: #64748b;
        }
        .detail-value {
            display: table-cell;
            padding: 3px 0;
        }
        .jadwal-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .jadwal-table th {
            background-color: #e5e7eb;
            padding: 8px 10px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #d1d5db;
            font-size: 10px;
        }
        .jadwal-table td {
            padding: 8px 10px;
            border: 1px solid #d1d5db;
            vertical-align: top;
        }
        .jadwal-table tr:nth-child(even) {
            background-color: #f9fafb;
        }
        .hari-label {
            font-weight: bold;
            color: #2563eb;
            min-width: 70px;
        }
        .kampung-list {
            margin: 0;
            padding: 0;
            list-style: none;
        }
        .kampung-item {
            padding: 2px 0;
            display: flex;
        }
        .route-number {
            display: inline-block;
            background-color: #dbeafe;
            color: #1e40af;
            border-radius: 3px;
            padding: 1px 5px;
            font-size: 8px;
            margin-right: 6px;
            min-width: 40px;
            text-align: center;
        }
        .kampung-name {
            flex: 1;
        }
        .no-data {
            color: #9ca3af;
            font-style: italic;
        }
        .footer {
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            font-size: 8px;
            color: #9ca3af;
            text-align: center;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>JADWAL RUTIN PENGANGKUTAN SAMPAH</h1>
        @if($wilayah)
            <div class="subtitle">Wilayah: {{ $wilayah->nama_wilayah }} - {{ $wilayah->kecamatan }}</div>
        @else
            <div class="subtitle">Semua Wilayah</div>
        @endif
    </div>

    <p class="meta">Dicetak: {{ now()->locale('id')->translatedFormat('l, d F Y H:i') }}</p>

    @forelse($jadwalByArmada as $index => $data)
        <div class="armada-section">
            <div class="armada-header">
                <h2>{{ $data['kode_armada'] }}</h2>
                <div class="info">{{ $data['jenis_kendaraan'] }} | {{ $data['wilayah'] }}</div>
            </div>

            <div class="armada-details">
                <div class="detail-row">
                    <span class="detail-label">Petugas/Leader:</span>
                    <span class="detail-value">{{ $data['petugas'] }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Anggota:</span>
                    <span class="detail-value">
                        @if(count($data['anggota']) > 0)
                            {{ implode(', ', $data['anggota']) }}
                            @if(count($data['anggota']) >= 5)
                                <em style="color: #9ca3af;">(maks. 5)</em>
                            @endif
                        @else
                            <span class="no-data">Belum ada anggota</span>
                        @endif
                    </span>
                </div>
            </div>

            <table class="jadwal-table">
                <thead>
                    <tr>
                        <th style="width: 80px;">Hari</th>
                        <th>Kampung / Rute</th>
                    </tr>
                </thead>
                <tbody>
                    @php
                        $hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
                        $jadwalMap = collect($data['jadwal'])->keyBy('hari');
                    @endphp
                    @foreach($hariList as $hari)
                        @php
                            $jadwalHari = $jadwalMap->get($hari);
                        @endphp
                        <tr>
                            <td class="hari-label">{{ $hari }}</td>
                            <td>
                                @if($jadwalHari && count($jadwalHari['kampung']) > 0)
                                    <ul class="kampung-list">
                                        @foreach($jadwalHari['kampung'] as $kampung)
                                            <li class="kampung-item">
                                                <span class="route-number">Rute {{ $kampung['urutan'] }}</span>
                                                <span class="kampung-name">{{ $kampung['nama'] }}</span>
                                            </li>
                                        @endforeach
                                    </ul>
                                @else
                                    <span class="no-data">Tidak ada jadwal</span>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        @if(!$loop->last && ($index + 1) % 2 == 0)
            <div class="page-break"></div>
        @endif
    @empty
        <div style="text-align: center; padding: 40px; color: #9ca3af;">
            <p style="font-size: 14px;">Tidak ada data jadwal rutin</p>
            <p style="font-size: 10px; margin-top: 5px;">Silakan tambahkan jadwal rutin terlebih dahulu</p>
        </div>
    @endforelse

    <div class="footer">
        <p>Dokumen ini dicetak otomatis dari sistem PUPUT - {{ now()->format('Y') }}</p>
    </div>
</body>
</html>
