import "server-only";

import type { Location, OWM_LocationSearchResponse } from "@/types/location";
import type { Units } from "@/types/weather";

import { owmClient } from "./owm-client";

interface FindLocationsParams {
  city: string;
  units?: Units;
  limit?: number;
}

export const findLocations = async ({
  city,
  units = "metric",
  limit = 5,
}: FindLocationsParams): Promise<Location[]> => {
  const data = await owmClient.request<OWM_LocationSearchResponse>(
    "/data/2.5/find",
    {
      q: city,
      type: "like",
      sort: "population",
      cnt: limit.toString(),
      units,
    },
  );

  return data.list.map(
    ({ id, name, coord, main, dt, wind, sys, clouds, weather }) => ({
      id,
      name,
      coord,
      main,
      dt,
      wind,
      sys,
      clouds,
      weather,
    }),
  );
};
