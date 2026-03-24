import { type WeatherData } from '../types';

interface Props {
  weather: WeatherData;
  destination: string;
  nights: number;
}

const CONDITION_ICONS: Record<WeatherData['conditionCode'], string> = {
  sunny: '☀️', partly_cloudy: '⛅', cloudy: '☁️', rainy: '🌧️', stormy: '⛈️', snowy: '❄️',
};

export default function WeatherBanner({ weather, destination, nights }: Props) {
  return (
    <div style={{ background: '#2C1A0E', borderRadius: 12, padding: '16px 18px', display: 'flex', gap: 16, alignItems: 'center' }}>
      <div style={{ fontSize: 32, flexShrink: 0 }}>{CONDITION_ICONS[weather.conditionCode]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: 'rgba(245,240,232,0.8)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {destination} · {nights} night{nights !== 1 ? 's' : ''}
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#E8A870', letterSpacing: '-0.02em', marginBottom: 2 }}>
          {weather.minTempC}–{weather.maxTempC}°C
        </div>
        <div style={{ fontSize: 12, color: 'rgba(245,240,232,0.9)' }}>{weather.conditionLabel}</div>
      </div>
      {weather.precipMm > 0 && (
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#E8A870' }}>{weather.precipMm}mm</div>
          <div style={{ fontSize: 10, color: 'rgba(245,240,232,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rain</div>
        </div>
      )}
    </div>
  );
}
