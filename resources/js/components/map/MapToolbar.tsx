import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, LocateFixed, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface NominatimResult {
    lat: string;
    lon: string;
    display_name: string;
}

interface MapToolbarProps {
    onLocationFound: (lat: number, lng: number) => void;
    placeholder?: string;
}

async function searchNominatim(query: string): Promise<NominatimResult[]> {
    if (!query.trim()) return [];
    const params = new URLSearchParams({
        q: query.trim(),
        format: 'json',
        limit: '5',
        addressdetails: '1',
        countrycodes: 'id',
    });
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: { 'Accept-Language': 'id', 'User-Agent': 'Laporin-App/1.0' },
    });
    if (!res.ok) return [];
    return res.json();
}

export function MapToolbar({ onLocationFound, placeholder = 'Cari lokasi, desa, alamat...' }: MapToolbarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [locating, setLocating] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        try {
            const results = await searchNominatim(query);
            setSearchResults(results);
            setShowResults(true);
        } catch {
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }
        debounceRef.current = setTimeout(() => handleSearch(searchQuery), 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchQuery, handleSearch]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMyLocation = () => {
        if (!navigator.geolocation) {
            alert('Browser Anda tidak mendukung deteksi lokasi. Pastikan fitur lokasi diaktifkan.');
            return;
        }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                onLocationFound(pos.coords.latitude, pos.coords.longitude);
                setLocating(false);
            },
            (err) => {
                setLocating(false);
                if (err.code === 1) {
                    alert('Izin lokasi ditolak. Silakan aktifkan akses lokasi di pengaturan browser untuk menggunakan fitur ini.');
                } else {
                    alert('Gagal mengambil lokasi. Pastikan GPS/Lokasi aktif.');
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        );
    };

    const selectResult = (r: NominatimResult) => {
        onLocationFound(parseFloat(r.lat), parseFloat(r.lon));
        setSearchQuery(r.display_name);
        setShowResults(false);
        setSearchResults([]);
    };

    return (
        <div ref={wrapperRef} className="absolute top-3 left-3 right-3 z-[1000] flex gap-2">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowResults(true)}
                    placeholder={placeholder}
                    className="pl-9 bg-white/95 backdrop-blur shadow-md border"
                />
                {searching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md border shadow-lg overflow-hidden z-50">
                        {searchResults.map((r, i) => (
                            <button
                                key={i}
                                type="button"
                                className="w-full text-left px-4 py-3 hover:bg-muted text-sm truncate"
                                onClick={() => selectResult(r)}
                            >
                                {r.display_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={handleMyLocation}
                disabled={locating}
                className="shrink-0 bg-white/95 backdrop-blur shadow-md border h-9 w-9"
                title="Gunakan lokasi saya (perlu izin)"
            >
                {locating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <LocateFixed className="h-4 w-4" />
                )}
            </Button>
        </div>
    );
}
