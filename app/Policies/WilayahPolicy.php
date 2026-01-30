<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Wilayah;

class WilayahPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Wilayah $wilayah): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Wilayah $wilayah): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Wilayah $wilayah): bool
    {
        return $user->isAdmin();
    }
}
