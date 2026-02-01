<?php

use App\Models\Notifikasi;
use App\Models\User;
use App\Services\NotificationService;

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->petugas = User::factory()->create(['role' => 'petugas']);
    $this->warga = User::factory()->create(['role' => 'warga']);
});

test('notification service can create notification for user', function () {
    NotificationService::notifyUser($this->warga->id, 'Test Title', 'Test Message');

    $this->assertDatabaseHas('notifikasi', [
        'user_id' => $this->warga->id,
        'judul' => 'Test Title',
        'pesan' => 'Test Message',
        'channel' => 'web',
        'is_read' => false,
    ]);
});

test('notification service can notify all admins', function () {
    $admin2 = User::factory()->create(['role' => 'admin']);

    NotificationService::notifyAdmins('Admin Notification', 'Test message for admins');

    expect(Notifikasi::where('user_id', $this->admin->id)->count())->toBe(1);
    expect(Notifikasi::where('user_id', $admin2->id)->count())->toBe(1);
});

test('notification service returns correct unread count', function () {
    Notifikasi::factory()->count(3)->create([
        'user_id' => $this->warga->id,
        'is_read' => false,
    ]);
    Notifikasi::factory()->count(2)->create([
        'user_id' => $this->warga->id,
        'is_read' => true,
    ]);

    expect(NotificationService::getUnreadCount($this->warga->id))->toBe(3);
});

test('admin can view notification list', function () {
    Notifikasi::factory()->count(5)->create([
        'user_id' => $this->admin->id,
    ]);

    $response = $this->actingAs($this->admin)->get('/admin/notifikasi');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/notifikasi/index')
        ->has('notifikasi.data', 5)
        ->has('stats')
    );
});

test('admin can mark notification as read', function () {
    $notifikasi = Notifikasi::factory()->unread()->create([
        'user_id' => $this->admin->id,
    ]);

    $response = $this->actingAs($this->admin)
        ->patch("/admin/notifikasi/{$notifikasi->id}/read");

    $response->assertRedirect();
    expect($notifikasi->fresh()->is_read)->toBeTrue();
});

test('admin can mark all notifications as read', function () {
    Notifikasi::factory()->count(3)->unread()->create([
        'user_id' => $this->admin->id,
    ]);

    $response = $this->actingAs($this->admin)
        ->post('/admin/notifikasi/read-all');

    $response->assertRedirect();
    expect(Notifikasi::where('user_id', $this->admin->id)->where('is_read', false)->count())->toBe(0);
});

test('admin can get unread count via api', function () {
    Notifikasi::factory()->count(3)->unread()->create([
        'user_id' => $this->admin->id,
    ]);

    $response = $this->actingAs($this->admin)
        ->getJson('/admin/notifikasi/unread-count');

    $response->assertStatus(200);
    $response->assertJson(['count' => 3]);
});

test('warga can view notification list', function () {
    Notifikasi::factory()->count(3)->create([
        'user_id' => $this->warga->id,
    ]);

    $response = $this->actingAs($this->warga)->get('/warga/notifikasi');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('warga/notifikasi/index')
        ->has('notifikasi.data', 3)
    );
});

test('petugas can view notification list', function () {
    Notifikasi::factory()->count(2)->create([
        'user_id' => $this->petugas->id,
    ]);

    $response = $this->actingAs($this->petugas)->get('/petugas/notifikasi');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('petugas/notifikasi/index')
        ->has('notifikasi.data', 2)
    );
});

test('user cannot mark other users notification as read', function () {
    $notifikasi = Notifikasi::factory()->create([
        'user_id' => $this->admin->id,
    ]);

    $response = $this->actingAs($this->warga)
        ->patch("/warga/notifikasi/{$notifikasi->id}/read");

    $response->assertStatus(403);
});

test('notification filter works correctly', function () {
    Notifikasi::factory()->count(2)->unread()->create([
        'user_id' => $this->admin->id,
    ]);
    Notifikasi::factory()->count(3)->read()->create([
        'user_id' => $this->admin->id,
    ]);

    $response = $this->actingAs($this->admin)->get('/admin/notifikasi?filter=unread');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/notifikasi/index')
        ->has('notifikasi.data', 2)
    );
});

test('shared data includes unread notification count', function () {
    Notifikasi::factory()->count(5)->unread()->create([
        'user_id' => $this->admin->id,
    ]);

    $response = $this->actingAs($this->admin)->get('/admin/notifikasi');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->where('unread_notification_count', 5)
    );
});
