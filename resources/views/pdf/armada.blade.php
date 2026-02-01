<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Export Armada - Laporan</title>
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
    <h1>Data Armada</h1>
    <p class="meta">Dicetak: {{ now()->locale('id')->translatedFormat('l, d F Y H:i') }}</p>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kode</th>
                <th>Plat</th>
                <th>Jenis</th>
                <th>Kapasitas</th>
                <th>Wilayah</th>
                <th>Status</th>
                <th>Tanggal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($armada as $i => $a)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $a->kode_armada ?? '-' }}</td>
                <td>{{ $a->plat_nomor ?? '-' }}</td>
                <td>{{ $a->jenis_kendaraan ?? '-' }}</td>
                <td>{{ $a->kapasitas ?? 0 }}</td>
                <td>{{ $a->wilayah?->nama_wilayah ?? '-' }}</td>
                <td>{{ $a->status ?? '-' }}</td>
                <td>{{ $a->created_at?->format('d/m/Y H:i') ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
