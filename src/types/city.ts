export interface City {
    id: number;
    name: string;
  }
  
  export type CityCreate = Omit<City, "id">;
  
  export type CityReference = Pick<City, "id">;