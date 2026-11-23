"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  ZoomControl,
} from "react-leaflet";

import { LiveFlight } from "@/types/flight";

interface FlightMapProps {
  flights: LiveFlight[];
}

export default function FlightMap({ flights }: FlightMapProps) {

  const positionedFlights = flights.filter((flight) => {
    return (
      Number.isFinite(flight.latitude) &&
      Number.isFinite(flight.longitude) &&
      flight.latitude >= -90 &&
      flight.latitude <= 90 &&
      flight.longitude >= -180 &&
      flight.longitude <= 180
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
            Live aircraft positions from Aviationstack
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
              key={flight.icao24 || flight.registration || `${flight.flight_number}-${index}`}
              center={[
                flight.latitude,
                flight.longitude,
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
                    {flight.flight_number || "Unknown Flight"}
                  </h3>

                  <p>
                    Airline: {flight.airline || "Unknown"}
                  </p>

                  <p>
                    From: {flight.departure || "N/A"}
                  </p>

                  <p>
                    To: {flight.arrival || "N/A"}
                  </p>

                  <p>
                    Altitude: {flight.altitude ?? "N/A"} m
                  </p>

                  <p>
                    Speed: {flight.speed ?? "N/A"} km/h
                  </p>

                  <p>
                    Direction: {flight.direction ?? "N/A"}°
                  </p>

                  <p>
                    Registration: {flight.registration || "N/A"}
                  </p>

                  <p>
                    ICAO24: {flight.icao24 || "N/A"}
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
                Waiting for valid live aircraft coordinates.
              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}