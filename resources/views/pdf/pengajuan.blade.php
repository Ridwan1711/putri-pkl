<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Export Pengajuan - Laporan</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #333; padding: 5px 6px; text-align: left; }
        th { background-color: #e5e7eb; font-weight: bold; }
        h1 { font-size: 16px; margin-bottom: 5px; }
        .meta { font-size: 10px; color: #666; margin-bottom: 15px; }
        td { word-wrap: break-word; }
    </style>
</head>
<body>
    <h1>Data Pengajuan Pengangkutan Sampah</h1>
    <p class="meta">Dicetak: {{ now()->locale('id')->translatedFormat('l, d F Y H:i') }}</p>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Pemohon</th>
                <th>Email</th>
                <th>Telepon</th>
                <th>Wilayah</th>
                <th>Kampung</th>
                <th>Status</th>
                <th>Estimasi</th>
                <th>Tanggal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pengajuan as $i => $p)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $p->user?->name ?? $p->nama_pemohon ?? '-' }}</td>
                <td>{{ $p->user?->email ?? $p->email ?? '-' }}</td>
                <td>{{ $p->no_telepon ?? '-' }}</td>
                <td>{{ $p->wilayah?->nama_wilayah ?? '-' }}</td>
                <td>{{ $p->kampung?->nama_kampung ?? '-' }}</td>
                <td>{{ $p->status ?? '-' }}</td>
                <td>{{ $p->estimasi_volume ?? 0 }} m³</td>
                <td>{{ $p->created_at?->format('d/m/Y H:i') ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
