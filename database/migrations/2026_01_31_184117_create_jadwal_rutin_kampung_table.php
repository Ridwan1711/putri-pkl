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
        Schema::create('jadwal_rutin_kampung', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jadwal_rutin_id')->constrained('jadwal_rutin')->onDelete('cascade');
            $table->foreignId('kampung_id')->constrained('kampung')->onDelete('cascade');
            $table->unsignedTinyInteger('urutan')->default(0);
            $table->timestamps();
            $table->unique(['jadwal_rutin_id', 'kampung_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_rutin_kampung');
    }
};
