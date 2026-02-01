<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Statistik Wilayah - {{ $wilayah->nama_wilayah }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; }
        h1 { font-size: 16px; margin-bottom: 5px; }
        .meta { font-size: 10px; color: #666; margin-bottom: 15px; }
        .stat-grid { margin: 20px 0; }
        .stat-item { display: inline-block; margin: 10px 20px 10px 0; padding: 15px 25px; border: 1px solid #333; }
        .stat-value { font-size: 24px; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Statistik Wilayah - {{ $wilayah->nama_wilayah }}</h1>
    <p class="meta">Dicetak: {{ now()->locale('id')->translatedFormat('l, d F Y H:i') }}</p>
    <p><strong>Kecamatan:</strong> {{ $wilayah->kecamatan }}</p>

    <div class="stat-grid">
        <div class="stat-item">
            <div>Jumlah Kampung</div>
            <div class="stat-value">{{ $statistik['jumlah_kampung'] ?? 0 }}</div>
        </div>
        <div class="stat-item">
            <div>Jumlah Petugas</div>
            <div class="stat-value">{{ $statistik['jumlah_petugas'] ?? 0 }}</div>
        </div>
        <div class="stat-item">
            <div>Jumlah Pengajuan</div>
            <div class="stat-value">{{ $statistik['jumlah_pengajuan'] ?? 0 }}</div>
        </div>
        <div class="stat-item">
            <div>Jumlah Armada</div>
            <div class="stat-value">{{ $statistik['jumlah_armada'] ?? 0 }}</div>
        </div>
    </div>
</body>
</html>
