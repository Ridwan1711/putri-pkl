<?php

namespace App\Policies;

use App\Models\Armada;
use App\Models\User;

class ArmadaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Armada $armada): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Armada $armada): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Armada $armada): bool
    {
        return $user->isAdmin();
    }
}
