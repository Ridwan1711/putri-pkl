<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Export Wilayah - Laporan</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #333; padding: 6px 8px; text-align: left; }
        th { background-color: #e5e7eb; font-weight: bold; }
        h1 { font-size: 16px; margin-bottom: 5px; }
        .meta { font-size: 10px; color: #666; margin-bottom: 15px; }
    </style>
</head>
<body>
    <h1>Data Wilayah</h1>
    <p class="meta">Dicetak: {{ now()->locale('id')->translatedFormat('l, d F Y H:i') }}</p>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Wilayah</th>
                <th>Kecamatan</th>
                <th>Jumlah Kampung</th>
                <th>Status</th>
                <th>Tanggal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($wilayah as $i => $w)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $w->nama_wilayah }}</td>
                <td>{{ $w->kecamatan }}</td>
                <td>{{ $w->pengajuan_pengangkutan_count ?? $w->kampung?->count() ?? 0 }}</td>
                <td>{{ $w->is_active ? 'Aktif' : 'Nonaktif' }}</td>
                <td>{{ $w->created_at?->format('d/m/Y H:i') ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
