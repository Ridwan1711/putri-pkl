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
        Schema::table('riwayat_status', function (Blueprint $table) {
            $table->dropForeign(['changed_by']);
            $table->unsignedBigInteger('changed_by')->nullable()->change();
            $table->foreign('changed_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('riwayat_status', function (Blueprint $table) {
            $table->dropForeign(['changed_by']);
            $table->unsignedBigInteger('changed_by')->nullable(false)->change();
            $table->foreign('changed_by')->references('id')->on('users')->onDelete('cascade');
        });
    }
};
