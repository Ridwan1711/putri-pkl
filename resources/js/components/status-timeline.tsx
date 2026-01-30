import { Clock } from 'lucide-react';
import type { RiwayatStatus } from '@/types/models';
import { StatusBadge } from './status-badge';

interface StatusTimelineProps {
    riwayat: RiwayatStatus[];
}

export function StatusTimeline({ riwayat }: StatusTimelineProps) {
    if (riwayat.length === 0) {
        return (
            <div className="text-sm text-muted-foreground">
                Belum ada riwayat status
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {riwayat.map((item, index) => (
                <div key={item.id} className="relative flex gap-4">
                    {index < riwayat.length - 1 && (
                        <div className="absolute left-[11px] top-6 h-full w-0.5 bg-border" />
                    )}
                    <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
                        <Clock className="h-3 w-3 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1 pb-4">
                        <div className="flex items-center gap-2">
                            <StatusBadge status={item.status as any} />
                            <span className="text-xs text-muted-foreground">
                                {new Date(item.created_at).toLocaleString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                        {item.keterangan && (
                            <p className="text-sm text-foreground">{item.keterangan}</p>
                        )}
                        {item.changed_by_user && (
                            <p className="text-xs text-muted-foreground">
                                Oleh: {item.changed_by_user.name}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
