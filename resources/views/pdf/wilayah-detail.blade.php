<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Detail Wilayah - {{ $wilayah->nama_wilayah }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #333; padding: 6px 8px; text-align: left; }
        th { background-color: #e5e7eb; font-weight: bold; }
        h1 { font-size: 16px; margin-bottom: 5px; }
        h2 { font-size: 13px; margin: 15px 0 8px; }
        .meta { font-size: 10px; color: #666; margin-bottom: 15px; }
    </style>
</head>
<body>
    <h1>Detail Wilayah - {{ $wilayah->nama_wilayah }}</h1>
    <p class="meta">Dicetak: {{ now()->locale('id')->translatedFormat('l, d F Y H:i') }}</p>
    <p><strong>Kecamatan:</strong> {{ $wilayah->kecamatan }} | <strong>Status:</strong> {{ $wilayah->is_active ? 'Aktif' : 'Nonaktif' }}</p>

    <h2>Kampung</h2>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Kampung</th>
                <th>Koordinat</th>
                <th>Urutan Rute</th>
            </tr>
        </thead>
        <tbody>
            @foreach($kampung ?? [] as $i => $k)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $k->nama_kampung }}</td>
                <td>{{ $k->latitude ?? '-' }}, {{ $k->longitude ?? '-' }}</td>
                <td>{{ $k->urutan_rute ?? 0 }}</td>
            </tr>
            @endforeach
            @if(($kampung ?? collect())->isEmpty())
            <tr><td colspan="4">Tidak ada kampung</td></tr>
            @endif
        </tbody>
    </table>

    <h2>Petugas</h2>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody>
            @foreach($petugas ?? [] as $i => $p)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $p->user?->name ?? '-' }}</td>
                <td>{{ $p->user?->email ?? '-' }}</td>
            </tr>
            @endforeach
            @if(($petugas ?? collect())->isEmpty())
            <tr><td colspan="3">Tidak ada petugas</td></tr>
            @endif
        </tbody>
    </table>

    <h2>Armada</h2>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kode</th>
                <th>Plat</th>
                <th>Jenis</th>
            </tr>
        </thead>
        <tbody>
            @foreach($armada ?? [] as $i => $a)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $a->kode_armada ?? '-' }}</td>
                <td>{{ $a->plat_nomor ?? '-' }}</td>
                <td>{{ $a->jenis_kendaraan ?? '-' }}</td>
            </tr>
            @endforeach
            @if(($armada ?? collect())->isEmpty())
            <tr><td colspan="4">Tidak ada armada</td></tr>
            @endif
        </tbody>
    </table>
</body>
</html>
