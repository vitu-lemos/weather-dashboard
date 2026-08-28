import { findLocations } from "@/services/location-finder";
import { withErrorHandler } from "@/lib/errors";
import { sanitizeString } from "@/helpers/sanitize-string";

import { NextResponse, type NextRequest } from "next/server";
import { BadRequestError } from "@/lib/errors/errors";
import type { Units } from "@/types/weather";

const isUnits = (value: string | null): value is Units =>
  value === "imperial" || value === "metric";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const rawSearch = req.nextUrl.searchParams.get("search");
  const rawUnits = req.nextUrl.searchParams.get("units");

  const city = rawSearch
    ? sanitizeString(rawSearch, { preserveCommas: true })
    : rawSearch;
  const sanitizedUnits = sanitizeString(rawUnits ?? "");
  const units: Units = isUnits(sanitizedUnits) ? sanitizedUnits : "metric";

  if (!city) {
    throw new BadRequestError("City is required");
  }

  const locations = await findLocations({ city, units });
  return NextResponse.json(
    { locations },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=500, stale-while-revalidate=60",
      },
    },
  );
});
