<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? 'Notifikasi' }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .card {
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: white;
            padding: 24px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header p {
            margin: 8px 0 0;
            opacity: 0.9;
            font-size: 14px;
        }
        .content {
            padding: 24px;
        }
        .message {
            background: #f9fafb;
            border-left: 4px solid #16a34a;
            padding: 16px;
            margin: 16px 0;
            border-radius: 0 8px 8px 0;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status-diajukan { background: #dbeafe; color: #1e40af; }
        .status-diverifikasi { background: #cffafe; color: #0e7490; }
        .status-dijadwalkan { background: #e0e7ff; color: #4338ca; }
        .status-diangkut { background: #fef3c7; color: #d97706; }
        .status-selesai { background: #dcfce7; color: #16a34a; }
        .status-ditolak { background: #fee2e2; color: #dc2626; }
        .status-masuk { background: #fed7aa; color: #ea580c; }
        .status-diproses { background: #dbeafe; color: #2563eb; }
        .status-ditindak { background: #e0e7ff; color: #4f46e5; }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            color: #6b7280;
            font-size: 14px;
        }
        .info-value {
            font-weight: 500;
            text-align: right;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 12px;
        }
        .footer a {
            color: #16a34a;
            text-decoration: none;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #16a34a;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin-top: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <h1>PUPUT</h1>
                <p>Pusat Pengelolaan Sampah Terpadu</p>
            </div>
            
            <div class="content">
                <div class="message">
                    {{ $messageContent }}
                </div>

                @if(!empty($data))
                    <div style="margin-top: 24px;">
                        @if(isset($data['pengajuan_id']))
                            <div class="info-row">
                                <span class="info-label">ID Pengajuan</span>
                                <span class="info-value">#{{ $data['pengajuan_id'] }}</span>
                            </div>
                        @endif

                        @if(isset($data['aduan_id']))
                            <div class="info-row">
                                <span class="info-label">ID Aduan</span>
                                <span class="info-value">#{{ $data['aduan_id'] }}</span>
                            </div>
                        @endif

                        @if(isset($data['status']))
                            <div class="info-row">
                                <span class="info-label">Status</span>
                                <span class="info-value">
                                    <span class="status-badge status-{{ $data['status'] }}">
                                        {{ ucfirst($data['status']) }}
                                    </span>
                                </span>
                            </div>
                        @endif

                        @if(isset($data['keterangan']) && $data['keterangan'])
                            <div class="info-row">
                                <span class="info-label">Keterangan</span>
                                <span class="info-value">{{ $data['keterangan'] }}</span>
                            </div>
                        @endif
                    </div>
                @endif

                <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
                    Email ini dikirim secara otomatis. Untuk informasi lebih lanjut, silakan hubungi admin melalui aplikasi.
                </p>
            </div>
            
            <div class="footer">
                <p>&copy; {{ date('Y') }} PUPUT - Pusat Pengelolaan Sampah Terpadu</p>
                <p>Kabupaten Tasikmalaya</p>
            </div>
        </div>
    </div>
</body>
</html>
