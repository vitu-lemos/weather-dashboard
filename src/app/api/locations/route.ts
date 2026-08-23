import { searchLocations } from "@/services/location-service";
import { withErrorHandler } from "@/lib/errors";
import { sanitizeString } from "@/helpers/sanitize-string";

import { NextResponse, type NextRequest } from "next/server";
import { BadRequestError } from "@/lib/errors/errors";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const rawCity = req.nextUrl.searchParams.get("city");
  const rawState = req.nextUrl.searchParams.get("state");
  const rawCountry = req.nextUrl.searchParams.get("country");

  const city = rawCity ? sanitizeString(rawCity) : rawCity;
  const state = rawState ? sanitizeString(rawState) : rawState;
  const country = rawCountry ? sanitizeString(rawCountry) : rawCountry;

  if (!city) {
    throw new BadRequestError("City is required");
  }

  const locations = await searchLocations({ query: { city, country, state } });

  return NextResponse.json({ locations }, { status: 200 });
});
