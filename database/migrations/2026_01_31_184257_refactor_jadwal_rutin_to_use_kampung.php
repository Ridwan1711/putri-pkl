<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $rows = DB::table('jadwal_rutin')->get();
        $processed = [];
        foreach ($rows as $row) {
            $key = $row->armada_id.'_'.$row->hari;
            if (! isset($processed[$key])) {
                $processed[$key] = $row->id;
            }
            $kampung = DB::table('kampung')
                ->where('wilayah_id', $row->wilayah_id)
                ->first();
            if ($kampung) {
                $jadwalId = $processed[$key];
                DB::table('jadwal_rutin_kampung')->insertOrIgnore([
                    'jadwal_rutin_id' => $jadwalId,
                    'kampung_id' => $kampung->id,
                    'urutan' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        $keepIds = array_values($processed);
        DB::table('jadwal_rutin')->whereNotIn('id', $keepIds)->delete();

        Schema::table('jadwal_rutin', function (Blueprint $table) {
            $table->dropForeign(['wilayah_id']);
            $table->dropForeign(['petugas_id']);
            $table->dropUnique(['petugas_id', 'armada_id', 'hari', 'wilayah_id']);
            $table->dropColumn(['wilayah_id', 'petugas_id']);
            $table->unique(['armada_id', 'hari']);
        });
    }

    public function down(): void
    {
        Schema::table('jadwal_rutin', function (Blueprint $table) {
            $table->dropUnique(['armada_id', 'hari']);
            $table->foreignId('petugas_id')->nullable()->constrained('petugas')->onDelete('cascade');
            $table->foreignId('wilayah_id')->nullable()->constrained('wilayah')->onDelete('cascade');
        });
        DB::table('jadwal_rutin_kampung')->truncate();
    }
};
