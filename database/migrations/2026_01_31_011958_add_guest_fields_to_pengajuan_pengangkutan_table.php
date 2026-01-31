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
        Schema::table('pengajuan_pengangkutan', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->unsignedBigInteger('user_id')->nullable()->change();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('pengajuan_pengangkutan', function (Blueprint $table) {
            $table->string('nama_pemohon')->nullable()->after('user_id');
            $table->string('no_telepon')->nullable()->after('nama_pemohon');
            $table->string('email')->nullable()->after('no_telepon');
            $table->string('ip_address')->nullable()->after('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pengajuan_pengangkutan', function (Blueprint $table) {
            $table->dropColumn(['nama_pemohon', 'no_telepon', 'email', 'ip_address']);
        });

        Schema::table('pengajuan_pengangkutan', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};
