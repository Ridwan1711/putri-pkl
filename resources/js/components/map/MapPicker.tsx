import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

export function MapPicker({ latitude, longitude, onLocationSelect, height = '400px' }: MapPickerProps) {
    const [position, setPosition] = useState<[number, number] | null>(
        latitude && longitude ? [latitude, longitude] : null,
    );

    useEffect(() => {
        if (latitude && longitude) {
            setPosition([latitude, longitude]);
        }
    }, [latitude, longitude]);

    const center: [number, number] = position || [-6.2088, 106.8456]; // Default to Jakarta

    return (
        <div style={{ height }} className="w-full rounded-lg overflow-hidden border">
            <MapContainer
                center={center}
                zoom={position ? 15 : 12}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
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
