"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

export default function FindMyCar() {
  const [position, setPosition] = useState(null);
  const [carLocation, setCarLocation] = useState(null);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleSetCarLocation = () => {
    if (position) {
      setCarLocation(position);
    }
  };

  return (
    <div className="flex flex-col h-screen p-2 gap-4">
      <Card className="flex-1">
        <CardContent className="h-full">
          {position ? (
            <MapContainer center={position} zoom={16} className="h-full w-full rounded-xl">
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>You are here</Popup>
              </Marker>
              {carLocation && (
                <Marker position={carLocation}>
                  <Popup>Your car</Popup>
                </Marker>
              )}
            </MapContainer>
          ) : (
            <p>Loading location...</p>
          )}
        </CardContent>
      </Card>
      <div className="text-center">
        <Button onClick={handleSetCarLocation} disabled={!position}>
          Set Car Location
        </Button>
      </div>
    </div>
  );
}
