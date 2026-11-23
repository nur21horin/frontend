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