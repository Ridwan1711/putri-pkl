<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Export Petugas - Laporan</title>
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
    <h1>Data Petugas</h1>
    <p class="meta">Dicetak: {{ now()->locale('id')->translatedFormat('l, d F Y H:i') }}</p>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Wilayah</th>
                <th>Armada</th>
                <th>Status</th>
                <th>Tanggal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($petugas as $i => $p)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $p->user?->name ?? '-' }}</td>
                <td>{{ $p->user?->email ?? '-' }}</td>
                <td>{{ $p->wilayah?->nama_wilayah ?? '-' }}</td>
                <td>{{ $p->armada?->kode_armada ?? '-' }}</td>
                <td>{{ $p->is_available ? 'Aktif' : 'Tidak Aktif' }}</td>
                <td>{{ $p->created_at?->format('d/m/Y H:i') ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
