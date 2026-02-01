<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotifikasiController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Notifikasi::where('user_id', $request->user()->id);

        // Filter by read status
        if ($request->filter === 'unread') {
            $query->where('is_read', false);
        } elseif ($request->filter === 'read') {
            $query->where('is_read', true);
        }

        $notifikasi = $query->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        $stats = [
            'total' => Notifikasi::where('user_id', $request->user()->id)->count(),
            'unread' => Notifikasi::where('user_id', $request->user()->id)->where('is_read', false)->count(),
            'read' => Notifikasi::where('user_id', $request->user()->id)->where('is_read', true)->count(),
        ];

        return Inertia::render('admin/notifikasi/index', [
            'notifikasi' => $notifikasi,
            'filters' => $request->only(['filter']),
            'stats' => $stats,
        ]);
    }

    public function read(Request $request, Notifikasi $notifikasi): RedirectResponse
    {
        // Ensure user can only mark their own notifications
        if ($notifikasi->user_id !== $request->user()->id) {
            abort(403);
        }

        $notifikasi->update(['is_read' => true]);

        return redirect()->back()->with('success', 'Notifikasi ditandai sudah dibaca.');
    }

    public function readAll(Request $request): RedirectResponse
    {
        Notifikasi::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return redirect()->back()->with('success', 'Semua notifikasi ditandai sudah dibaca.');
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = Notifikasi::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }
}
