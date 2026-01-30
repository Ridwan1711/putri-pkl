<?php

namespace App\Policies;

use App\Models\Petugas;
use App\Models\User;

class PetugasPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Petugas $petugas): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Petugas $petugas): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Petugas $petugas): bool
    {
        return $user->isAdmin();
    }
}
