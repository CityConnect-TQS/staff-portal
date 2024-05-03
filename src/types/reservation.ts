import { Trip, TripReference } from "./trip";
import { User, UserReference } from "./user";

export interface Reservation {
  id: number;
  seats: number;
  trip: Trip;
  user: User;
}

export type ReservationCreate = Omit<Reservation, "id" | "trip" | "user"> & {
  trip: TripReference;
  user: UserReference;
};

export type ReservationReference = Pick<Reservation, "id">;