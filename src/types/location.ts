export interface Location {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface OWM_Location {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
