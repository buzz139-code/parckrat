import { type WeatherData } from '../types';

const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
const CLIMATE_TTL = 24 * 60 * 60 * 1000;

async function geocode(city: string): Promise<{ lat: number; lon: number; name: string } | null> {
  const key = `packrat_geo_${city.toLowerCase().trim()}`;
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);
  try {
    const res = await fetch(`${GEO_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    if (!res.ok) return null;
    const data = await res.json();
    const r = data.results?.[0];
    if (!r) return null;
    const result = { lat: r.latitude, lon: r.longitude, name: `${r.name}, ${r.country}` };
    localStorage.setItem(key, JSON.stringify(result));
    return result;
  } catch { return null; }
}

function getCondition(weatherCode: number, precipitation: number): WeatherData['conditionCode'] {
  if (weatherCode >= 71) return 'snowy';
  if (weatherCode >= 61 || precipitation > 5) return 'rainy';
  if (weatherCode >= 51) return 'rainy';
  if (weatherCode >= 45) return 'cloudy';
  if (weatherCode >= 2) return 'partly_cloudy';
  return 'sunny';
}

function getConditionLabel(code: WeatherData['conditionCode']): string {
  const labels: Record<WeatherData['conditionCode'], string> = {
    sunny: 'Sunny and clear',
    partly_cloudy: 'Partly cloudy',
    cloudy: 'Overcast',
    rainy: 'Rain expected',
    stormy: 'Storms possible',
    snowy: 'Snow expected',
  };
  return labels[code];
}

export async function fetchWeather(city: string, startDate: string, endDate: string): Promise<{ weather: WeatherData; resolvedCity: string } | null> {
  const geo = await geocode(city);
  if (!geo) return null;

  const cacheKey = `packrat_weather_${geo.lat}_${geo.lon}_${startDate}_${endDate}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < CLIMATE_TTL) return { weather: parsed.data, resolvedCity: geo.name };
  }

  try {
    const url = `${WEATHER_API}?latitude=${geo.lat}&longitude=${geo.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&start_date=${startDate}&end_date=${endDate}&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    const maxTemps: number[] = data.daily.temperature_2m_max;
    const minTemps: number[] = data.daily.temperature_2m_min;
    const precips: number[] = data.daily.precipitation_sum;
    const codes: number[] = data.daily.weathercode;

    const avgMax = Math.round(maxTemps.reduce((a, b) => a + b, 0) / maxTemps.length);
    const avgMin = Math.round(minTemps.reduce((a, b) => a + b, 0) / minTemps.length);
    const avgTemp = Math.round((avgMax + avgMin) / 2);
    const totalPrecip = Math.round(precips.reduce((a, b) => a + b, 0));
    const dominantCode = codes.sort((a, b) =>
      codes.filter(v => v === b).length - codes.filter(v => v === a).length
    )[0];

    const conditionCode = getCondition(dominantCode, totalPrecip / codes.length);
    const weather: WeatherData = {
      avgTempC: avgTemp,
      minTempC: avgMin,
      maxTempC: avgMax,
      precipMm: totalPrecip,
      conditionLabel: getConditionLabel(conditionCode),
      conditionCode,
    };

    localStorage.setItem(cacheKey, JSON.stringify({ data: weather, timestamp: Date.now() }));
    return { weather, resolvedCity: geo.name };
  } catch { return null; }
}
