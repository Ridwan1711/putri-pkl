<?php

namespace App\Services;

use App\Jobs\SendEmailNotificationJob;
use App\Models\Notifikasi;
use App\Models\Petugas;
use App\Models\User;

class NotificationService
{
    /**
     * Send notification to all admins
     */
    public static function notifyAdmins(string $judul, string $pesan): void
    {
        $admins = User::where('role', 'admin')
            ->where('is_active', true)
            ->get();

        foreach ($admins as $admin) {
            self::notifyUser($admin->id, $judul, $pesan);
        }
    }

    /**
     * Send notification to all petugas in a specific wilayah
     */
    public static function notifyPetugasInWilayah(?int $wilayahId, string $judul, string $pesan): void
    {
        if (! $wilayahId) {
            return;
        }

        $petugasList = Petugas::where('wilayah_id', $wilayahId)
            ->where('is_available', true)
            ->with('user')
            ->get();

        foreach ($petugasList as $petugas) {
            if ($petugas->user && $petugas->user->is_active) {
                self::notifyUser($petugas->user_id, $judul, $pesan);
            }
        }
    }

    /**
     * Send notification to a specific user (web channel)
     */
    public static function notifyUser(int $userId, string $judul, string $pesan): void
    {
        Notifikasi::create([
            'user_id' => $userId,
            'judul' => $judul,
            'pesan' => $pesan,
            'channel' => 'web',
            'is_read' => false,
        ]);
    }

    /**
     * Send email notification to a guest (user without account)
     */
    public static function sendEmailToGuest(
        string $email,
        string $subject,
        string $message,
        array $data = []
    ): void {
        // Dispatch job to queue
        SendEmailNotificationJob::dispatch($email, $subject, $message, $data);
    }

    /**
     * Notify about new pengajuan creation
     */
    public static function notifyNewPengajuan(
        int $pengajuanId,
        ?int $wilayahId,
        string $alamat,
        ?string $namaWarga = null
    ): void {
        $namaWarga = $namaWarga ?? 'Warga';
        $judul = 'Pengajuan Baru #'.$pengajuanId;
        $pesan = "Pengajuan baru dari {$namaWarga} di alamat: {$alamat}";

        // Notify all admins
        self::notifyAdmins($judul, $pesan);

        // Notify petugas in the wilayah
        if ($wilayahId) {
            self::notifyPetugasInWilayah($wilayahId, $judul, $pesan);
        }
    }

    /**
     * Notify about new aduan creation
     */
    public static function notifyNewAduan(
        int $aduanId,
        string $kategori,
        ?string $namaWarga = null
    ): void {
        $namaWarga = $namaWarga ?? 'Warga';
        $judul = 'Aduan Baru #'.$aduanId;
        $pesan = "Aduan baru ({$kategori}) dari {$namaWarga}";

        // Notify all admins
        self::notifyAdmins($judul, $pesan);
    }

    /**
     * Notify warga about pengajuan status change
     */
    public static function notifyPengajuanStatusChange(
        int $pengajuanId,
        ?int $userId,
        ?string $guestEmail,
        string $newStatus,
        ?string $keterangan = null
    ): void {
        $judul = 'Status Pengajuan Diperbarui';
        $pesan = "Pengajuan #{$pengajuanId} status berubah menjadi: {$newStatus}";

        if ($keterangan) {
            $pesan .= ". Keterangan: {$keterangan}";
        }

        // If user has account, send web notification
        if ($userId) {
            self::notifyUser($userId, $judul, $pesan);
        }
        // If guest with email, send email notification
        elseif ($guestEmail) {
            self::sendEmailToGuest(
                $guestEmail,
                $judul,
                $pesan,
                [
                    'pengajuan_id' => $pengajuanId,
                    'status' => $newStatus,
                    'keterangan' => $keterangan,
                ]
            );
        }
    }

    /**
     * Notify warga about aduan status change
     */
    public static function notifyAduanStatusChange(
        int $aduanId,
        int $userId,
        string $newStatus,
        ?string $keterangan = null
    ): void {
        $judul = 'Status Aduan Diperbarui';
        $pesan = "Aduan #{$aduanId} status berubah menjadi: {$newStatus}";

        if ($keterangan) {
            $pesan .= ". Keterangan: {$keterangan}";
        }

        self::notifyUser($userId, $judul, $pesan);
    }

    /**
     * Notify petugas about new penugasan assignment
     */
    public static function notifyPenugasanAssigned(
        int $penugasanId,
        int $petugasUserId,
        string $alamat,
        string $jadwalAngkut
    ): void {
        $judul = 'Penugasan Baru #'.$penugasanId;
        $pesan = "Anda mendapat tugas pengangkutan di: {$alamat}. Jadwal: {$jadwalAngkut}";

        self::notifyUser($petugasUserId, $judul, $pesan);
    }

    /**
     * Get unread notification count for a user
     */
    public static function getUnreadCount(int $userId): int
    {
        return Notifikasi::where('user_id', $userId)
            ->where('is_read', false)
            ->count();
    }
}
