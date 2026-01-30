<?php

namespace App\Policies;

use App\Models\PengajuanPengangkutan;
use App\Models\User;

class PengajuanPengangkutanPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isPetugas() || $user->isWarga();
    }

    public function view(User $user, PengajuanPengangkutan $pengajuanPengangkutan): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isWarga()) {
            return $pengajuanPengangkutan->user_id === $user->id;
        }

        if ($user->isPetugas() && $user->petugas) {
            return $pengajuanPengangkutan->wilayah_id === $user->petugas->wilayah_id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->isWarga();
    }

    public function update(User $user, PengajuanPengangkutan $pengajuanPengangkutan): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, PengajuanPengangkutan $pengajuanPengangkutan): bool
    {
        return $user->isAdmin();
    }
}
