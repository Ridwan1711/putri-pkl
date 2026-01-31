<?php

use App\Http\Controllers\Admin\ArmadaController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\JadwalRutinController;
use App\Http\Controllers\Admin\KampungController;
use App\Http\Controllers\Admin\PengajuanController as AdminPengajuanController;
use App\Http\Controllers\Admin\PetugasController;
use App\Http\Controllers\Admin\WilayahController;
use App\Http\Controllers\Guest\PengajuanController as GuestPengajuanController;
use App\Http\Controllers\Petugas\DashboardController as PetugasDashboardController;
use App\Http\Controllers\Petugas\NotifikasiController as PetugasNotifikasiController;
use App\Http\Controllers\Petugas\PengajuanController as PetugasPengajuanController;
use App\Http\Controllers\Petugas\PenugasanController;
use App\Http\Controllers\Petugas\PetaController;
use App\Http\Controllers\Petugas\RiwayatController;
use App\Http\Controllers\Petugas\UpdateStatusController;
use App\Http\Controllers\Warga\AduanController;
use App\Http\Controllers\Warga\DashboardController as WargaDashboardController;
use App\Http\Controllers\Warga\PengajuanController as WargaPengajuanController;
use App\Models\Wilayah;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'wilayah' => Wilayah::with('kampung')->where('is_active', true)->get(),
    ]);
})->name('home');

Route::post('pengajuan-guest', [GuestPengajuanController::class, 'store'])
    ->middleware('throttle:guest-pengajuan')
    ->name('pengajuan.guest.store');

// Redirect dashboard based on role
Route::get('dashboard', function () {
    $user = Auth::user();

    if (! $user) {
        return redirect()->route('login');
    }

    return match ($user->role) {
        'admin' => redirect()->route('admin.dashboard'),
        'petugas' => redirect()->route('petugas.dashboard'),
        'warga' => redirect()->route('warga.dashboard'),
        default => redirect()->route('home'),
    };
})->middleware(['auth', 'verified'])->name('dashboard');

// Admin Routes
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::resource('wilayah', WilayahController::class);
    Route::resource('wilayah.kampung', KampungController::class)->except(['show']);
    Route::patch('armada/{armada}/status', [ArmadaController::class, 'updateStatus'])->name('armada.update-status');
    Route::resource('armada', ArmadaController::class);
    Route::resource('petugas', PetugasController::class);

    Route::get('jadwal-rutin', [JadwalRutinController::class, 'index'])->name('jadwal-rutin.index');
    Route::post('jadwal-rutin', [JadwalRutinController::class, 'store'])->name('jadwal-rutin.store');
    Route::delete('jadwal-rutin/{jadwalRutin}', [JadwalRutinController::class, 'destroy'])->name('jadwal-rutin.destroy');

    Route::get('pengajuan', [AdminPengajuanController::class, 'index'])->name('pengajuan.index');
    Route::get('pengajuan/{pengajuan}', [AdminPengajuanController::class, 'show'])->name('pengajuan.show');
    Route::post('pengajuan/{pengajuan}/status', [AdminPengajuanController::class, 'updateStatus'])->name('pengajuan.update-status');
    Route::post('pengajuan/assign', [AdminPengajuanController::class, 'assign'])->name('pengajuan.assign');
});

// Petugas Routes
Route::middleware(['auth', 'verified', 'role:petugas'])->prefix('petugas')->name('petugas.')->group(function () {
    Route::get('dashboard', [PetugasDashboardController::class, 'index'])->name('dashboard');

    Route::get('penugasan', [PenugasanController::class, 'index'])->name('penugasan.index');
    Route::get('penugasan/{penugasan}', [PenugasanController::class, 'show'])->name('penugasan.show');
    Route::post('penugasan/{penugasan}/status', [PenugasanController::class, 'updateStatus'])->name('penugasan.update-status');
    Route::post('penugasan/{penugasan}/status-full', [PenugasanController::class, 'updateStatusFull'])->name('penugasan.update-status-full');

    Route::get('peta', [PetaController::class, 'index'])->name('peta.index');
    Route::get('update-status', [UpdateStatusController::class, 'index'])->name('update-status.index');
    Route::get('riwayat', [RiwayatController::class, 'index'])->name('riwayat.index');

    Route::get('pengajuan', [PetugasPengajuanController::class, 'index'])->name('pengajuan.index');

    Route::patch('notifikasi/{notifikasi}/read', [PetugasNotifikasiController::class, 'read'])
        ->name('notifikasi.read');
});

// Warga Routes
Route::middleware(['auth', 'verified', 'role:warga'])->prefix('warga')->name('warga.')->group(function () {
    Route::get('dashboard', [WargaDashboardController::class, 'index'])->name('dashboard');

    Route::resource('pengajuan', WargaPengajuanController::class)->except(['edit', 'update', 'destroy']);
    Route::resource('aduan', AduanController::class)->except(['edit', 'update', 'destroy']);
});

require __DIR__.'/settings.php';
