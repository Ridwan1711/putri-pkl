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
        Schema::create('armada_anggota', function (Blueprint $table) {
            $table->id();
            $table->foreignId('armada_id')->constrained('armada')->onDelete('cascade');
            $table->string('nama');
            $table->string('no_hp', 20)->nullable();
            $table->unsignedTinyInteger('urutan')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('armada_anggota');
    }
};
