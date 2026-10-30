// src/services/liveWeatherService.ts
// Real-time weather from Open-Meteo (free, no API key, CORS-open)
// https://open-meteo.com/en/docs

export interface LiveWeather {
  tempC: number;
  feelsLikeC: number;
  humidity: number;
  precipMm: number;
  windKmh: number;
  weatherCode: number;
  emoji: string;
  label: string;
  advisory: string;
  fetchedAt: string;
}

/** WMO Weather Interpretation Codes → emoji + label + tourism advisory */
function interpretWeatherCode(code: number): { emoji: string; label: string; advisory: string } {
  if (code === 0) return { emoji: '☀️', label: 'Clear Sky', advisory: 'Perfect for outdoor sightseeing and trekking.' };
  if (code <= 2) return { emoji: '🌤️', label: 'Partly Cloudy', advisory: 'Good conditions for most tourism activities.' };
  if (code === 3) return { emoji: '☁️', label: 'Overcast', advisory: 'Comfortable for heritage walks and temples.' };
  if (code <= 48) return { emoji: '🌫️', label: 'Foggy / Misty', advisory: 'Misty Malnad / Coorg ambiance — beautiful but drive carefully.' };
  if (code <= 57) return { emoji: '🌦️', label: 'Drizzle', advisory: 'Light rain — carry an umbrella. Ideal for coffee plantation walks.' };
  if (code <= 67) return { emoji: '🌧️', label: 'Rain', advisory: 'Moderate rain. Western Ghat roads may have reduced visibility.' };
  if (code <= 77) return { emoji: '❄️', label: 'Snow / Sleet', advisory: 'Unusual weather — check Mullayanagiri peak conditions.' };
  if (code <= 82) return { emoji: '🌦️', label: 'Rain Showers', advisory: 'Intermittent showers. Beach visits not recommended.' };
  if (code <= 86) return { emoji: '⛈️', label: 'Heavy Showers', advisory: 'Heavy rain. Postpone ghat drives and trekking.' };
  if (code <= 99) return { emoji: '⛈️', label: 'Thunderstorm', advisory: '⚠️ Thunderstorm alert — avoid open hilltops and beaches.' };
  return { emoji: '🌡️', label: 'Weather Data', advisory: 'Check local conditions before travelling.' };
}

const WEATHER_CACHE = new Map<string, { data: LiveWeather; expiresAt: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function fetchLiveWeather(
  lat: number,
  lng: number,
  locationKey: string
): Promise<LiveWeather | null> {
  const cached = WEATHER_CACHE.get(locationKey);
  if (cached && Date.now() < cached.expiresAt) return cached.data;

  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', lat.toFixed(4));
    url.searchParams.set('longitude', lng.toFixed(4));
    url.searchParams.set(
      'current',
      'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weathercode,windspeed_10m'
    );
    url.searchParams.set('timezone', 'Asia/Kolkata');
    url.searchParams.set('forecast_days', '1');

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const json = await res.json();
    const c = json.current;
    const { emoji, label, advisory } = interpretWeatherCode(c.weathercode);

    const weather: LiveWeather = {
      tempC: Math.round(c.temperature_2m),
      feelsLikeC: Math.round(c.apparent_temperature),
      humidity: Math.round(c.relative_humidity_2m),
      precipMm: Number((c.precipitation ?? 0).toFixed(1)),
      windKmh: Math.round(c.windspeed_10m),
      weatherCode: c.weathercode,
      emoji,
      label,
      advisory,
      fetchedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    WEATHER_CACHE.set(locationKey, { data: weather, expiresAt: Date.now() + CACHE_TTL_MS });
    return weather;
  } catch {
    return null;
  }
}

/** Fetch weather for multiple Karnataka POI hubs in one batch */
export async function fetchWeatherForDestinations(
  coords: Array<{ id: string; name: string; lat: number; lng: number }>
): Promise<Map<string, LiveWeather>> {
  const results = new Map<string, LiveWeather>();
  await Promise.all(
    coords.map(async ({ id, lat, lng }) => {
      const w = await fetchLiveWeather(lat, lng, id);
      if (w) results.set(id, w);
    })
  );
  return results;
}
