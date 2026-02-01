import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SharedData } from '@/types';
import type { Notifikasi } from '@/types/models';

interface NotificationBellProps {
    className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
    const { auth, unread_notification_count } = usePage<SharedData & { unread_notification_count?: number }>().props;
    const [unreadCount, setUnreadCount] = useState(unread_notification_count || 0);
    const [recentNotifications, setRecentNotifications] = useState<Notifikasi[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const role = auth.user?.role || 'warga';
    const notifikasiUrl = `/${role}/notifikasi`;
    const unreadCountUrl = `/${role}/notifikasi/unread-count`;

    // Polling for unread count every 30 seconds
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await fetch(unreadCountUrl, {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                });
                if (response.ok) {
                    const data = await response.json();
                    setUnreadCount(data.count);
                }
            } catch (error) {
                console.error('Failed to fetch notification count:', error);
            }
        };

        // Initial fetch
        fetchUnreadCount();

        // Set up polling interval
        const interval = setInterval(fetchUnreadCount, 30000);

        return () => clearInterval(interval);
    }, [unreadCountUrl]);

    // Update from props when page refreshes
    useEffect(() => {
        if (unread_notification_count !== undefined) {
            setUnreadCount(unread_notification_count);
        }
    }, [unread_notification_count]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`relative ${className}`}
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                    <span className="sr-only">Notifikasi</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifikasi</span>
                    {unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {unreadCount} belum dibaca
                        </Badge>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {unreadCount === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>Tidak ada notifikasi baru</p>
                    </div>
                ) : (
                    <div className="p-2 text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                            Anda memiliki {unreadCount} notifikasi belum dibaca
                        </p>
                    </div>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link
                        href={notifikasiUrl}
                        className="w-full flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Lihat Semua Notifikasi
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
