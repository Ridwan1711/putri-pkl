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
        Schema::create('lampiran', function (Blueprint $table) {
            $table->id();
            $table->enum('ref_type', ['pengajuan', 'aduan']);
            $table->unsignedBigInteger('ref_id');
            $table->string('file_path');
            $table->string('file_type')->nullable();
            $table->timestamp('uploaded_at')->useCurrent();

            $table->index(['ref_type', 'ref_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lampiran');
    }
};
