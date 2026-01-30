import { router, usePage } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SharedData } from '@/types';

interface FilterOption {
    value: string;
    label: string;
}

interface FilterBarProps {
    searchPlaceholder?: string;
    searchValue?: string;
    filters?: Array<{
        name: string;
        label: string;
        value?: string;
        options: FilterOption[];
    }>;
    onSearch?: (value: string) => void;
    onFilterChange?: (name: string, value: string) => void;
    onReset?: () => void;
}

export function FilterBar({
    searchPlaceholder = 'Cari...',
    searchValue = '',
    filters = [],
    onSearch,
    onFilterChange,
    onReset,
}: FilterBarProps) {
    const { props } = usePage<SharedData>();
    const currentFilters = (props as any).filters || {};
    const [search, setSearch] = useState(searchValue || currentFilters.search || '');

    useEffect(() => {
        setSearch(searchValue || currentFilters.search || '');
    }, [searchValue, currentFilters.search]);

    const handleSearch = (value: string) => {
        setSearch(value);
        if (onSearch) {
            onSearch(value);
        } else {
            router.get(
                window.location.pathname,
                { ...currentFilters, search: value || undefined },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );
        }
    };

    const handleFilterChange = (name: string, value: string) => {
        if (onFilterChange) {
            onFilterChange(name, value);
        } else {
            router.get(
                window.location.pathname,
                {
                    ...currentFilters,
                    search: search || undefined,
                    [name]: value || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );
        }
    };

    const handleReset = () => {
        setSearch('');
        if (onReset) {
            onReset();
        } else {
            router.get(window.location.pathname, {}, { preserveState: true, preserveScroll: true });
        }
    };

    const hasActiveFilters = search || filters.some((f) => f.value || currentFilters[f.name]);

    return (
        <div className="space-y-4 rounded-lg border p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                {filters.map((filter) => (
                    <Select
                        key={filter.name}
                        value={filter.value || ''}
                        onValueChange={(value) => handleFilterChange(filter.name, value)}
                    >
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder={filter.label} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Semua {filter.label}</SelectItem>
                            {filter.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ))}
                {hasActiveFilters && (
                    <Button variant="outline" onClick={handleReset} size="sm">
                        <X className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
}
