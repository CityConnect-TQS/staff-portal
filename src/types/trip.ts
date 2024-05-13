import { Bus, BusReference } from "./bus";
import { City, CityReference } from "./city";
import { CurrencyParams } from "./currency";

export interface Trip {
  id: number;
  bus: Bus;
  departure: City;
  departureTime: Date;
  arrival: City;
  arrivalTime: Date;
  price: number;
  freeSeats: number;
  status: string;
}

export type TripCreate = Omit<Trip, "id" | "bus" | "departure" | "arrival" | "departureTime" | "arrivalTime" | "price" | "freeSeats"> & {
  bus: BusReference;
  departure: CityReference;
  arrival: CityReference;
  departureTime: Date | string;
  arrivalTime: Date | string;
  price: number;
};

export type TripReference = Pick<Trip, "id">;

export type TripSearchParameters = CurrencyParams & {
  departure?: number;
  arrival?: number;
  departureTime?: string;
  seats?: number;
};

export type SelectedTripCookies = & {
  trip: Trip;
  edit: boolean
}
