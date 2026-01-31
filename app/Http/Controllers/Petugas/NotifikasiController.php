<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotifikasiController extends Controller
{
    public function read(Request $request, Notifikasi $notifikasi): RedirectResponse
    {
        if ($notifikasi->user_id !== $request->user()->id) {
            abort(403);
        }

        $notifikasi->update(['is_read' => true]);

        return redirect()->back();
    }
}
