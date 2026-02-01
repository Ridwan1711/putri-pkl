<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Dashboard</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; page-break-inside: auto; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        th, td { border: 1px solid #333; padding: 6px 8px; text-align: left; }
        th { background-color: #e5e7eb; font-weight: bold; }
        h1 { font-size: 18px; margin-bottom: 5px; }
        h2 { font-size: 14px; margin: 20px 0 10px; }
        .meta { font-size: 10px; color: #666; margin-bottom: 15px; }
        .summary { margin: 15px 0; }
        .summary-item { display: inline-block; margin-right: 20px; margin-bottom: 10px; padding: 10px 15px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <h1>Laporan Dashboard - Sistem Pengangkutan Sampah</h1>
    <p class="meta">Dicetak: {{ $reports['ringkasan']['tanggal_cetak'] ?? now()->locale('id')->translatedFormat('l, d F Y H:i') }}</p>
    
    <h2>Ringkasan Eksekutif</h2>
    <div class="summary">
        <span class="summary-item">Total Pengajuan: {{ $reports['ringkasan']['total_pengajuan'] ?? 0 }}</span>
        <span class="summary-item">Selesai: {{ $reports['ringkasan']['selesai'] ?? 0 }}</span>
        <span class="summary-item">Ditolak: {{ $reports['ringkasan']['ditolak'] ?? 0 }}</span>
        <span class="summary-item">Sampah Terkumpul: {{ $reports['ringkasan']['sampah_ton'] ?? 0 }} Ton</span>
    </div>

    <h2>Pengajuan per Wilayah</h2>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Desa</th>
                <th>Kecamatan</th>
                <th>Total Pengajuan</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reports['per_wilayah'] ?? [] as $i => $w)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $w['nama'] ?? '-' }}</td>
                <td>{{ $w['kecamatan'] ?? '-' }}</td>
                <td>{{ $w['total_pengajuan'] ?? 0 }}</td>
                <td>{{ ($w['is_active'] ?? true) ? 'Aktif' : 'Nonaktif' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <h2>Pengajuan Terbaru (20)</h2>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Pemohon</th>
                <th>Wilayah</th>
                <th>Kampung</th>
                <th>Status</th>
                <th>Tanggal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reports['pengajuan_terbaru'] ?? [] as $i => $p)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $p['nama_pemohon'] ?? '-' }}</td>
                <td>{{ $p['wilayah'] ?? '-' }}</td>
                <td>{{ $p['kampung'] ?? '-' }}</td>
                <td>{{ $p['status'] ?? '-' }}</td>
                <td>{{ $p['created_at'] ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
