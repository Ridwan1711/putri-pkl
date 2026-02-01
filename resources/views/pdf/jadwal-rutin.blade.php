<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Export Jadwal Rutin - Laporan</title>
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
    <h1>Data Jadwal Rutin</h1>
    <p class="meta">Dicetak: {{ now()->locale('id')->translatedFormat('l, d F Y H:i') }}</p>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Armada</th>
                <th>Hari</th>
                <th>Kampung</th>
                <th>Wilayah</th>
            </tr>
        </thead>
        <tbody>
            @foreach($jadwalRutin as $i => $j)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $j->armada?->kode_armada ?? '-' }}</td>
                <td>{{ \App\Enums\Hari::tryFrom($j->hari)?->label() ?? $j->hari }}</td>
                <td>{{ $j->kampung?->pluck('nama_kampung')->implode(', ') ?? '-' }}</td>
                <td>{{ $j->armada?->wilayah?->nama_wilayah ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
