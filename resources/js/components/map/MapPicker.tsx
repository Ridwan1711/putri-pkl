import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapToolbar } from './MapToolbar';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapPickerProps {
    latitude?: number | null;
    longitude?: number | null;
    onLocationSelect: (lat: number, lng: number) => void;
    height?: string;
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

function LocationMarker({
    position,
    onPositionChange,
}: {
    position: [number, number] | null;
    onPositionChange: (lat: number, lng: number) => void;
}) {
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(position);

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setMarkerPosition([lat, lng]);
            onPositionChange(lat, lng);
        },
    });

    useEffect(() => {
        if (position) {
            setMarkerPosition(position);
        }
    }, [position]);

    return markerPosition ? <Marker position={markerPosition} /> : null;
}

export function MapPicker({
    latitude,
    longitude,
    onLocationSelect,
    height = '400px',
    showToolbar = true,
}: MapPickerProps) {
    const [position, setPosition] = useState<[number, number] | null>(
        latitude && longitude ? [latitude, longitude] : null,
    );
    const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (latitude && longitude) {
            setPosition([latitude, longitude]);
        }
    }, [latitude, longitude]);

    const center: [number, number] = position || [-6.2088, 106.8456]; // Default to Jakarta

    const handleToolbarLocation = (lat: number, lng: number) => {
        const coord: [number, number] = [lat, lng];
        setPosition(coord);
        onLocationSelect(lat, lng);
        setFlyTarget(coord);
        setTimeout(() => setFlyTarget(null), 100);
    };

    return (
        <div style={{ height }} className="w-full rounded-lg overflow-hidden border relative">
            {showToolbar && <MapToolbar onLocationFound={handleToolbarLocation} />}
            <MapContainer
                center={center}
                zoom={position ? 15 : 12}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FlyTo target={flyTarget} />
                <LocationMarker
                    position={position}
                    onPositionChange={(lat, lng) => {
                        setPosition([lat, lng]);
                        onLocationSelect(lat, lng);
                    }}
                />
            </MapContainer>
        </div>
    );
}
