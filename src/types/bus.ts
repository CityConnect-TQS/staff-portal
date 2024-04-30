export interface Bus {
    id: number;
    capacity: number;
    company: string;
  }
  
  export type BusCreate = Omit<Bus, "id">;
  
  export type BusReference = Pick<Bus, "id">;