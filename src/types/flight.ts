export interface Flight {
  flight_date: string;
  flight_status: string;

  departure: {
    airport: string | null;
    iata: string | null;
    scheduled: string | null;
    actual: string | null;
    delay: number | null;
  };

  arrival: {
    airport: string | null;
    iata: string | null;
    scheduled: string | null;
    actual: string | null;
    delay: number | null;
  };

  airline: {
    name: string | null;
    iata: string | null;
  };

  flight: {
    number: string | null;
    iata: string | null;
    icao: string | null;
  };

  aircraft?: {
    registration: string | null;
  } | null;
  live?: {
    latitude: number | null;
    longitude: number | null;
    altitude: number | null;
    direction: number | null;
    speed_horizontal: number | null;
    is_ground: boolean | null;
  } | null;
}

export interface FlightResponse {
  success: boolean;
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  } | null;
  data: Flight[];
}

export interface LiveFlight {
  flight_number: string | null;
  airline: string | null;

  departure: string | null;
  arrival: string | null;

  latitude: number;
  longitude: number;

  altitude: number | null;
  speed: number | null;
  direction: number | null;

  registration: string | null;
  icao24: string | null;

  updated: string | null;
}

export interface LiveFlightResponse {
  success: boolean;
  total_fetched: number;
  live_count: number;
  data: LiveFlight[];
}