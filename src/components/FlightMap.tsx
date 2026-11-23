"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  ZoomControl,
} from "react-leaflet";

import { Flight } from "@/types/flight";

interface FlightMapProps {
  flights: Flight[];
}

export default function FlightMap({ flights }: FlightMapProps) {

  const positionedFlights = flights.filter((flight) => {

    const lat = flight.live?.latitude;
    const lng = flight.live?.longitude;

    return (
      flight.flight_status === "active" &&
      typeof lat === "number" &&
      typeof lng === "number" &&
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  });

  return (

    <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111a2a]">

      <div className="flex items-center justify-between border-b border-slate-800 p-5">

        <div>
          <h3 className="text-xl font-semibold text-white">
            Global Flight Map
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Aircraft positions from Aviationstack
          </p>
        </div>

        <span className="rounded-full bg-sky-500/10 px-3 py-2 text-sm text-sky-400">
          {positionedFlights.length} Aircraft
        </span>

      </div>

      <div className="relative">

        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          maxZoom={12}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{
            height: "550px",
            width: "100%",
            background: "#080d18",
          }}
        >

          <ZoomControl position="bottomright" />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {positionedFlights.map((flight, index) => (

            <CircleMarker
              key={`${flight.flight?.iata}-${index}`}
              center={[
                flight.live!.latitude!,
                flight.live!.longitude!,
              ]}
              radius={7}
              pathOptions={{
                color: "#38bdf8",
                fillColor: "#0ea5e9",
                fillOpacity: 0.9,
                weight: 2,
              }}
            >

              <Popup>

                <div className="min-w-48 text-sm">

                  <h3 className="font-bold">
                    {flight.flight?.iata || "Unknown Flight"}
                  </h3>

                  <p>
                    Airline: {flight.airline?.name || "Unknown"}
                  </p>

                  <p>
                    From: {flight.departure?.iata || "N/A"}
                  </p>

                  <p>
                    To: {flight.arrival?.iata || "N/A"}
                  </p>

                  <p>
                    Altitude: {flight.live?.altitude ?? "N/A"} m
                  </p>

                  <p>
                    Speed: {flight.live?.speed_horizontal ?? "N/A"} km/h
                  </p>

                  <p>
                    Direction: {flight.live?.direction ?? "N/A"}°
                  </p>

                </div>

              </Popup>

            </CircleMarker>

          ))}

        </MapContainer>

        {positionedFlights.length === 0 && (

          <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center">

            <div className="rounded-xl border border-slate-700 bg-slate-950/90 p-6 text-center">

              <p className="text-lg font-semibold text-white">
                No Aircraft Positions Available
              </p>

              <p className="mt-2 max-w-sm text-sm text-slate-400">
                Aviationstack has not returned usable live coordinates
                for the current flights.
              </p>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}