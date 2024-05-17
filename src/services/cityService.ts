import { City, CityCreate } from "@/types/city";
import { BACKOFFICE_BASE_API_URL, PUBLIC_BASE_API_URL } from "./config";



export const createCity = async (city: CityCreate, jwt: string): Promise<City> =>
 fetch(BACKOFFICE_BASE_API_URL + "city", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
    },
    body: JSON.stringify(city),
 }).then((res) => res.json() as Promise<City>);

 export const getCities = async (name?: string): Promise<City[]> => {
    return fetch(
      PUBLIC_BASE_API_URL +
        "city" +
        (typeof name !== "undefined" ? "?name=" + name : ""),
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    ).then((res) => res.json() as Promise<City[]>);
};

export const getCity = async (id: number): Promise<City> =>
  fetch(PUBLIC_BASE_API_URL + "city/" + id, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json() as Promise<City>);

export const updateCity = async (id: number, city: CityCreate, jwt: string): Promise<City> =>
  fetch(BACKOFFICE_BASE_API_URL + "city/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
    },
    body: JSON.stringify(city),
  }).then((res) => res.json() as Promise<City>);

export const deleteCity = async (id: number, jwt: string): Promise<undefined> =>
  fetch(BACKOFFICE_BASE_API_URL + "city/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
    },
  }).then((res) => res.json() as Promise<undefined>);