import { Bus, BusCreate } from "@/types/bus";
import { BACKOFFICE_BASE_API_URL, PUBLIC_BASE_API_URL } from "./config";

export const createBus = async (bus: BusCreate): Promise<Bus> =>
  fetch(BACKOFFICE_BASE_API_URL + "bus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bus),
  }).then((res) => res.json() as Promise<Bus>);

export const getBuses = async (): Promise<Bus[]> =>
  fetch(PUBLIC_BASE_API_URL + "bus", {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json() as Promise<Bus[]>);

export const getBus = async (id: number): Promise<Bus> =>
  fetch(PUBLIC_BASE_API_URL + "bus/" + id, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json() as Promise<Bus>);

export const updateBus = async (id: number, bus: BusCreate): Promise<Bus> =>
  fetch(BACKOFFICE_BASE_API_URL + "bus/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bus),
  }).then((res) => res.json() as Promise<Bus>);

export const deleteBus = async (id: number) =>
  fetch(BACKOFFICE_BASE_API_URL + "bus/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.status === 200);