# Weather dashboard

Weather Service web app that shows the weather for a city using OpenWeatherMap API. A user searches for a city and sees the current weather and a 5-day forecast.

Live demo: [https://weather-dashboard-vitu-lemos.vercel.app/](https://weather-dashboard-vitu-lemos.vercel.app/)

## Approach and Key Decisions

### Backend-for-Frontend (BFF)

The browser never calls the OpenWeatherMap API directly. Server-only modules under `src/services/` hold the API key and call OpenWeatherMap. React Server Components in `src/components/` call these service modules during render. One route handler, `src/app/api/locations/route.ts`, exposes a BFF endpoint for the client-side city search.

This pattern keeps the API key on the server. It also keeps OpenWeatherMap's raw response shapes out of the browser bundle.

### Data Flow and State

The URL holds the app's state. The home route's `lat`, `lon`, and `units` query parameters drive every fetch. `src/app/page.tsx` reads these parameters and passes plain data down to Server Components, which fetch weather data during render. This removes the need for a client-side state library.

### Error Handling

`src/lib/errors/` defines a `CustomError` base class and one subclass per HTTP status code (for example `NotFoundError`, `BadGatewayError`). Service code throws these typed errors instead of generic `Error` objects.

App wrappers turn a thrown `CustomError` into a safe result

### Forecast Data Source

`src/services/forecast.ts` calls OpenWeatherMap's One Call API 4.0 `timeline/1day` and `timeline/1h` endpoints. These endpoints return data already grouped per day and per hour, so the app does not group entries or pick a representative time block itself. See "OpenWeatherMap API Requirements" below for the subscription this endpoint needs.

## Main Stack

- **Next.js 16** (App Router) — React framework, server components, and API routes
- **React 19**
- **TypeScript**
- **Vitest** and **Testing Library** — unit and component tests
- **ESLint** — linting, with Husky and lint-staged for pre-commit checks
- **pnpm** — package manager

## Local Setup

Follow these steps to run the app on your machine.

1. Install pnpm 10 or later, and Node.js 20 or later.
2. Clone the repository.
3. Run `pnpm install` in the repository root.
4. Copy `env.example` to a new file named `.env`.
5. Add your OpenWeatherMap API key to `.env` as `OPEN_WEATHER_API_KEY`. See the "OpenWeatherMap API Requirements" section below.
6. Run `pnpm dev` to start the local dev server.
7. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Useful Commands

- `pnpm test` — run the unit test suite
- `pnpm build` — create a production build
- `pnpm start` — run the production build locally

## OpenWeatherMap API Requirements

The app calls the OpenWeatherMap API for all weather data. You need an OpenWeatherMap account with two active subscriptions:

1. **One Call API 4.0** — [https://openweathermap.org/api/one-call-4](https://openweathermap.org/api/one-call-4). The app uses this for the daily and hourly forecast.
2. **Current Weather API** — [https://openweathermap.org/api/current](https://openweathermap.org/api/current). The app uses this for the current weather on the dashboard.

Both subscriptions have a free tier. OpenWeatherMap still requires a valid credit card on file to activate each subscription, even on the free tier. Add the card in your OpenWeatherMap account before you generate the API key, or requests will fail.

Use the same API key for both subscriptions. Set it once as `OPEN_WEATHER_API_KEY` in your `.env` file.
