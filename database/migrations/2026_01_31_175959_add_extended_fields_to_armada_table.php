<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('armada', function (Blueprint $table) {
            $table->year('tahun_pembuatan')->nullable()->after('status');
            $table->string('merk')->nullable()->after('tahun_pembuatan');
            $table->string('nomor_rangka')->nullable()->after('merk');
            $table->string('nomor_mesin')->nullable()->after('nomor_rangka');
            $table->date('tanggal_stnk')->nullable()->after('nomor_mesin');
            $table->date('tanggal_keur')->nullable()->after('tanggal_stnk');
            $table->string('bahan_bakar')->nullable()->after('tanggal_keur');
            $table->decimal('konsumsi_bahan_bakar', 8, 2)->nullable()->after('bahan_bakar');
            $table->string('lokasi_parkir')->nullable()->after('konsumsi_bahan_bakar');
            $table->string('asuransi')->nullable()->after('lokasi_parkir');
            $table->string('kontrak_sewa')->nullable()->after('asuransi');
            $table->text('keterangan')->nullable()->after('kontrak_sewa');
            $table->boolean('is_available')->default(true)->after('keterangan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('armada', function (Blueprint $table) {
            $table->dropColumn([
                'tahun_pembuatan', 'merk', 'nomor_rangka', 'nomor_mesin',
                'tanggal_stnk', 'tanggal_keur', 'bahan_bakar', 'konsumsi_bahan_bakar',
                'lokasi_parkir', 'asuransi', 'kontrak_sewa', 'keterangan', 'is_available',
            ]);
        });
    }
};
