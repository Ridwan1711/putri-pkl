<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $wilayah = DB::table('wilayah')->get();
        foreach ($wilayah as $w) {
            DB::table('kampung')->insert([
                'wilayah_id' => $w->id,
                'nama_kampung' => $w->nama_wilayah.' - Utama',
                'latitude' => $w->latitude ?? null,
                'longitude' => $w->longitude ?? null,
                'urutan_rute' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('kampung')->truncate();
    }
};
