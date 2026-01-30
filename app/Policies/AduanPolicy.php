<?php

namespace App\Policies;

use App\Models\Aduan;
use App\Models\User;

class AduanPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isWarga();
    }

    public function view(User $user, Aduan $aduan): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isWarga()) {
            return $aduan->user_id === $user->id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->isWarga();
    }

    public function update(User $user, Aduan $aduan): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Aduan $aduan): bool
    {
        return $user->isAdmin();
    }
}
