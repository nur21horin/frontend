import {
  FlightResponse,
  LiveFlightResponse
} from "@/types/flight";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getFlights(
  params?: {
    flight_number?: string;
    dep_iata?: string;
    arr_iata?: string;
  }
): Promise<FlightResponse> {

  const searchParams = new URLSearchParams();

  searchParams.set("limit", "100");

  if (params?.flight_number) {
    searchParams.set("flight_number", params.flight_number);
  }

  if (params?.dep_iata) {
    searchParams.set("dep_iata", params.dep_iata);
  }

  if (params?.arr_iata) {
    searchParams.set("arr_iata", params.arr_iata);
  }

  const response = await fetch(
    `${API_URL}/api/flights/?${searchParams.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch flight information");
  }

  return response.json();
}

export async function getLiveFlights(): Promise<LiveFlightResponse> {

  const response = await fetch(
    `${API_URL}/api/flights/live?limit=100`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch live flight information");
  }

  return response.json();
}