import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import type { GeoJSON as GeoJSONType } from 'geojson';
import L from 'leaflet';
import { MapToolbar } from './MapToolbar';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapViewerProps {
    latitude?: number | null;
    longitude?: number | null;
    geojson?: string | null;
    height?: string;
    markers?: Array<{ lat: number; lng: number; title?: string }>;
    routePoints?: Array<{ lat: number; lng: number }>;
    showToolbar?: boolean;
}

function FlyTo({ target }: { target: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (target) {
            map.flyTo(target, 15, { duration: 0.5 });
        }
    }, [target, map]);
    return null;
}

function GeoJsonLayer({ geojson }: { geojson: string | null }) {
    const map = useMap();
    const layerRef = useRef<L.GeoJSON | null>(null);

    useEffect(() => {
        if (!geojson) {
            return;
        }

        try {
            const geoJsonData = JSON.parse(geojson) as GeoJSONType;
            const geoJsonLayer = L.geoJSON(geoJsonData, {
                style: {
                    color: '#3388ff',
                    weight: 2,
                    fillColor: '#3388ff',
                    fillOpacity: 0.2,
                },
            });

            if (layerRef.current) {
                map.removeLayer(layerRef.current);
            }

            geoJsonLayer.addTo(map);
            map.fitBounds(geoJsonLayer.getBounds());
            layerRef.current = geoJsonLayer;
        } catch (error) {
            console.error('Error parsing GeoJSON:', error);
        }

        return () => {
            if (layerRef.current) {
                map.removeLayer(layerRef.current);
            }
        };
    }, [geojson, map]);

    return null;
}

function FitBounds({ bounds }: { bounds: L.LatLngBounds | null }) {
    const map = useMap();

    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds);
        }
    }, [bounds, map]);

    return null;
}

export function MapViewer({
    latitude,
    longitude,
    geojson,
    height = '400px',
    markers = [],
    routePoints = [],
    showToolbar = true,
}: MapViewerProps) {
    const center: [number, number] = latitude && longitude ? [latitude, longitude] : [-6.2088, 106.8456];
    const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);

    const bounds = useRef<L.LatLngBounds | null>(null);

    useEffect(() => {
        const allPoints: [number, number][] = [
            ...markers.map((m) => [m.lat, m.lng] as [number, number]),
            ...routePoints.map((p) => [p.lat, p.lng] as [number, number]),
        ];
        if (latitude && longitude) {
            allPoints.push([latitude, longitude]);
        }
        if (allPoints.length > 0) {
            bounds.current = L.latLngBounds(allPoints);
        }
    }, [markers, routePoints, latitude, longitude]);

    const handleToolbarLocation = (lat: number, lng: number) => {
        setFlyTarget([lat, lng]);
        setTimeout(() => setFlyTarget(null), 100);
    };

    return (
        <div style={{ height }} className="w-full rounded-lg overflow-hidden border relative">
            {showToolbar && <MapToolbar onLocationFound={handleToolbarLocation} />}
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FlyTo target={flyTarget} />
                {geojson && <GeoJsonLayer geojson={geojson} />}
                {routePoints.length > 1 && (
                    <Polyline
                        positions={routePoints.map((p) => [p.lat, p.lng] as [number, number])}
                        pathOptions={{ color: '#22c55e', weight: 4 }}
                    />
                )}
                {latitude && longitude && <Marker position={[latitude, longitude]} />}
                {markers.map((marker, index) => (
                    <Marker key={index} position={[marker.lat, marker.lng]}>
                        {marker.title && <Popup>{marker.title}</Popup>}
                    </Marker>
                ))}
                {bounds.current && <FitBounds bounds={bounds.current} />}
            </MapContainer>
        </div>
    );
}
