<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Export Kampung - {{ $wilayah->nama_wilayah ?? 'Laporan' }}</title>
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
    <h1>Data Kampung - {{ $wilayah->nama_wilayah ?? '-' }}</h1>
    <p class="meta">Dicetak: {{ now()->locale('id')->translatedFormat('l, d F Y H:i') }}</p>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Kampung</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Urutan Rute</th>
                <th>Tanggal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($kampung as $i => $k)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $k->nama_kampung }}</td>
                <td>{{ $k->latitude ?? '-' }}</td>
                <td>{{ $k->longitude ?? '-' }}</td>
                <td>{{ $k->urutan_rute ?? 0 }}</td>
                <td>{{ $k->created_at?->format('d/m/Y H:i') ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
