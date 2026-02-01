<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tambah petugas_id ke armada (leader)
        Schema::table('armada', function (Blueprint $table) {
            $table->foreignId('petugas_id')
                ->nullable()
                ->after('wilayah_id')
                ->constrained('petugas')
                ->nullOnDelete();
        });

        // 2. Migrasi data: untuk setiap petugas yang punya armada_id, set armada.petugas_id
        $petugasWithArmada = DB::table('petugas')
            ->whereNotNull('armada_id')
            ->get();

        foreach ($petugasWithArmada as $petugas) {
            // Hanya set jika armada belum punya leader
            DB::table('armada')
                ->where('id', $petugas->armada_id)
                ->whereNull('petugas_id')
                ->update(['petugas_id' => $petugas->id]);
        }

        // 3. Hapus armada_id dari petugas
        Schema::table('petugas', function (Blueprint $table) {
            $table->dropForeign(['armada_id']);
            $table->dropColumn('armada_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Tambah kembali armada_id ke petugas
        Schema::table('petugas', function (Blueprint $table) {
            $table->foreignId('armada_id')
                ->nullable()
                ->after('user_id')
                ->constrained('armada')
                ->nullOnDelete();
        });

        // 2. Migrasi data balik: dari armada.petugas_id ke petugas.armada_id
        $armadaWithLeader = DB::table('armada')
            ->whereNotNull('petugas_id')
            ->get();

        foreach ($armadaWithLeader as $armada) {
            DB::table('petugas')
                ->where('id', $armada->petugas_id)
                ->update(['armada_id' => $armada->id]);
        }

        // 3. Hapus petugas_id dari armada
        Schema::table('armada', function (Blueprint $table) {
            $table->dropForeign(['petugas_id']);
            $table->dropColumn('petugas_id');
        });
    }
};
