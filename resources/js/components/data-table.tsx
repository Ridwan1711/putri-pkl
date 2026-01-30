import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface DataTableProps<T> {
    data: PaginatedData<T>;
    columns: Array<{
        header: string;
        accessor: keyof T | ((row: T) => React.ReactNode);
        className?: string;
    }>;
    onRowClick?: (row: T) => void;
    emptyMessage?: string;
    mobileCard?: (row: T) => React.ReactNode;
}

export function DataTable<T extends { id: number | string }>({
    data,
    columns,
    onRowClick,
    emptyMessage = 'Tidak ada data',
    mobileCard,
}: DataTableProps<T>) {
    if (data.data.length === 0) {
        return (
            <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto rounded-lg border md:block">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-3 text-left text-sm font-medium"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.data.map((row) => (
                            <tr
                                key={row.id}
                                className="border-b transition-colors hover:bg-muted/50"
                                onClick={() => onRowClick?.(row)}
                                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                            >
                                {columns.map((column, index) => {
                                    const content =
                                        typeof column.accessor === 'function'
                                            ? column.accessor(row)
                                            : row[column.accessor];
                                    return (
                                        <td key={index} className={`px-4 py-3 text-sm ${column.className || ''}`}>
                                            {content}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="space-y-2 md:hidden">
                {data.data.map((row) => (
                    <Card
                        key={row.id}
                        className="p-4"
                        onClick={() => onRowClick?.(row)}
                        style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                    >
                        {mobileCard ? mobileCard(row) : (
                            <div className="space-y-2">
                                {columns.map((column, index) => {
                                    const content =
                                        typeof column.accessor === 'function'
                                            ? column.accessor(row)
                                            : row[column.accessor];
                                    return (
                                        <div key={index} className="flex justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                {column.header}:
                                            </span>
                                            <span className="text-sm">{content}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            {data.last_page > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Menampilkan {((data.current_page - 1) * data.per_page) + 1} - {Math.min(data.current_page * data.per_page, data.total)} dari {data.total}
                    </div>
                    <div className="flex gap-2">
                        {data.links.map((link, index) => {
                            if (!link.url) {
                                return (
                                    <span
                                        key={index}
                                        className="px-3 py-2 text-sm text-muted-foreground"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            }

                            return (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'hover:bg-muted'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
