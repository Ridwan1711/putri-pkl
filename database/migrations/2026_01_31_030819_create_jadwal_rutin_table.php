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
        Schema::create('jadwal_rutin', function (Blueprint $table) {
            $table->id();
            $table->foreignId('petugas_id')->constrained('petugas')->onDelete('cascade');
            $table->foreignId('armada_id')->constrained('armada')->onDelete('cascade');
            $table->tinyInteger('hari'); // 1=Senin ... 7=Minggu
            $table->foreignId('wilayah_id')->constrained('wilayah')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['petugas_id', 'armada_id', 'hari', 'wilayah_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_rutin');
    }
};
