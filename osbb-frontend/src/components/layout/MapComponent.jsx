import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ address, onAddressSelect, isEditing }) => {
    const [markerPosition, setMarkerPosition] = useState([48.9649146, 30.6981396]);

    const fetchCoordinates = async (address) => {
        if (!address) return;
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&accept-language=uk,en`;
        try {
            const response = await fetch(geocodeUrl);
            const data = await response.json();
            if (data.length > 0) {
                const { lat, lon } = data[0];
                setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
            }
        } catch (error) {
            console.error("Помилка при отриманні координат:", error);
        }
    };

    useEffect(() => {
        fetchCoordinates(address);
    }, [address]);

    const MapEventHandler = () => {
        useMapEvents({
            click(event) {
                if (!isEditing) return;
                const { lat, lng } = event.latlng;
                setMarkerPosition([lat, lng]);
                const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=uk,en`;
                fetch(reverseGeocodeUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data && data.display_name) {
                            onAddressSelect(data.display_name);
                        }
                    })
                    .catch((error) => console.error("Помилка при отриманні адреси:", error));
            }
        });
        return null;
    };

    return (
        <div className="map-container">
            <MapContainer center={markerPosition} zoom={6} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapEventHandler />
                <Marker position={markerPosition}>
                    <Popup>{address || "Оберіть адресу"}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapComponent;
