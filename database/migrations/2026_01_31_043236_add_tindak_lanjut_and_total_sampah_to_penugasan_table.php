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
        Schema::table('penugasan', function (Blueprint $table) {
            $table->text('tindak_lanjut')->nullable()->after('status');
            $table->decimal('total_sampah_terangkut', 10, 2)->nullable()->after('tindak_lanjut');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penugasan', function (Blueprint $table) {
            $table->dropColumn(['tindak_lanjut', 'total_sampah_terangkut']);
        });
    }
};
