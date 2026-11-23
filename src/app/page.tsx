"use client";

import { useEffect, useState } from "react";

import {
  Plane,
  PlaneLanding,
  RefreshCw,
  Search,
  Activity,
  Clock,
} from "lucide-react";

import { Flight, LiveFlight } from "../types/flight";
import { getFlights, getLiveFlights } from "../services/flightService";

import dynamic from "next/dynamic";

const FlightMap = dynamic(
  () => import("../components/FlightMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[550px] items-center justify-center rounded-xl bg-[#111a2a] text-slate-400">
        Loading Global Flight Map...
      </div>
    ),
  }
);

export default function Dashboard() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [liveFlights, setLiveFlights] = useState<LiveFlight[]>([]);

  const [loading, setLoading] = useState(true);
  const [liveLoading, setLiveLoading] = useState(true);

  const [error, setError] = useState("");
  const [liveMapError, setLiveMapError] = useState("");

  const [search, setSearch] = useState("");

  // Fetch normal flight information
  const fetchFlights = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getFlights();

      setFlights(response.data || []);
    } catch (err) {
      console.error("Flights error:", err);
      setError("Unable to load flight information.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch live aircraft positions
  const fetchLiveFlights = async () => {
    try {
      setLiveLoading(true);
      setLiveMapError("");

      const response = await getLiveFlights();

      setLiveFlights(response.data || []);
    } catch (err) {
      console.error("Live flights error:", err);
      setLiveMapError("Unable to load live aircraft positions.");
    } finally {
      setLiveLoading(false);
    }
  };

  // Initial API calls
  useEffect(() => {
    fetchFlights();
    fetchLiveFlights();
  }, []);

  // Search filter
  const filteredFlights = flights.filter((flight) => {
    const query = search.toLowerCase();

    return (
      flight.flight?.number?.toLowerCase().includes(query) ||
      flight.airline?.name?.toLowerCase().includes(query) ||
      flight.departure?.iata?.toLowerCase().includes(query) ||
      flight.arrival?.iata?.toLowerCase().includes(query)
    );
  });

  // Flight statistics
  const activeFlights = flights.filter(
    (flight) => flight.flight_status === "active"
  ).length;

  const landedFlights = flights.filter(
    (flight) => flight.flight_status === "landed"
  ).length;

  const cancelledFlights = flights.filter(
    (flight) => flight.flight_status === "cancelled"
  ).length;

  const stats = [
    {
      title: "Total Flights",
      value: flights.length,
      icon: Plane,
    },
    {
      title: "Active Flights",
      value: activeFlights,
      icon: Activity,
    },
    {
      title: "Landed Flights",
      value: landedFlights,
      icon: PlaneLanding,
    },
    {
      title: "Cancelled Flights",
      value: cancelledFlights,
      icon: Clock,
    },
  ];

  // Refresh both APIs
  const handleRefresh = () => {
    fetchFlights();
    fetchLiveFlights();
  };

  return (
    <main className="min-h-screen bg-[#080d18] text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800 px-8 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <div className="flex items-center gap-3">
            <Plane className="text-sky-400" size={30} />

            <h1 className="text-2xl font-bold">
              AeroVision
            </h1>
          </div>

          <span className="text-sm text-slate-400">
            Global Aviation Intelligence
          </span>

        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-8 py-10">

        {/* Heading */}
        <div className="mb-8 flex items-center justify-between">

          <div>
            <h2 className="text-3xl font-bold">
              Flight Operations
            </h2>

            <p className="mt-2 text-slate-400">
              Monitor global flight activities.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading || liveLoading}
            className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-3 font-medium hover:bg-sky-600 disabled:opacity-50"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

        </div>

        {/* Statistics Cards */}
        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-800 bg-[#111a2a] p-6"
            >
              <div className="flex items-center justify-between">

                <p className="text-sm text-slate-400">
                  {stat.title}
                </p>

                <stat.icon className="text-sky-400" />

              </div>

              <h3 className="mt-4 text-3xl font-bold">
                {loading ? "..." : stat.value}
              </h3>
            </div>
          ))}

        </div>

        {/* Global Live Flight Map */}
        <div className="mb-10">

          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Global Live Flight Tracking
            </h3>

            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
              {liveLoading
                ? "Updating..."
                : `${liveFlights.length} Live Aircraft`}
            </span>
          </div>

          {liveMapError && (
            <div className="mb-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {liveMapError}
            </div>
          )}

          <FlightMap flights={liveFlights} />

        </div>

        {/* Flight Search */}
        <div className="mb-6 rounded-xl border border-slate-800 bg-[#111a2a] p-5">

          <div className="flex items-center gap-3 rounded-lg border border-slate-700 px-4">

            <Search className="text-slate-400" />

            <input
              type="text"
              placeholder="Search flight number, airline or airport..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
            />

          </div>

        </div>

        {/* Flight Table */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111a2a]">

          <div className="border-b border-slate-800 p-5">

            <h3 className="text-xl font-semibold">
              Flight Information
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Flight data provided by Aviationstack
            </p>

          </div>

          {error && (
            <div className="p-6 text-red-400">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-10 text-center text-slate-400">
              Loading flight information...
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-left text-sm">

                <thead className="bg-[#172337] text-slate-400">
                  <tr>
                    <th className="p-4">Flight</th>
                    <th className="p-4">Airline</th>
                    <th className="p-4">Departure</th>
                    <th className="p-4">Arrival</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredFlights.map((flight, index) => (
                    <tr
                      key={`${flight.flight?.iata}-${index}`}
                      className="border-t border-slate-800 hover:bg-slate-800/40"
                    >

                      <td className="p-4 font-semibold">
                        {flight.flight?.iata || "N/A"}
                      </td>

                      <td className="p-4">
                        {flight.airline?.name || "Unknown"}
                      </td>

                      <td className="p-4">
                        <div className="font-semibold">
                          {flight.departure?.iata || "N/A"}
                        </div>

                        <div className="text-xs text-slate-400">
                          {flight.departure?.airport || "Unknown"}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold">
                          {flight.arrival?.iata || "N/A"}
                        </div>

                        <div className="text-xs text-slate-400">
                          {flight.arrival?.airport || "Unknown"}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium capitalize text-sky-400">
                          {flight.flight_status || "Unknown"}
                        </span>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

              {!error && filteredFlights.length === 0 && (
                <div className="p-10 text-center text-slate-400">
                  No flights found.
                </div>
              )}

            </div>
          )}

        </div>

      </section>

    </main>
  );
}