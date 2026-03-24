import { useState, useEffect } from 'react';
import { differenceInDays } from 'date-fns';
import { type TripInput, type PackingItemData, type ItemCategory, type AppState, type WeatherData } from './types';
import { fetchWeather } from './utils/weather';
import { generatePackingList } from './utils/gemini';
import { parseShareUrl } from './utils/share';
import TripForm from './components/TripForm';
import WeatherBanner from './components/WeatherBanner';
import PackingList from './components/PackingList';
import ShareButton from './components/ShareButton';

export default function App() {
  const [appState, setAppState] = useState<AppState>('input');
  const [trip, setTrip] = useState<TripInput | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [resolvedCity, setResolvedCity] = useState('');
  const [items, setItems] = useState<PackingItemData[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const shared = parseShareUrl();
    if (shared) {
      setTrip(shared.trip);
      setItems(shared.items);
      setAppState('list');
    }
  }, []);

  const handleSubmit = async (tripInput: TripInput) => {
    setAppState('loading');
    setError('');
    setTrip(tripInput);

    const nights = Math.max(1, differenceInDays(new Date(tripInput.endDate), new Date(tripInput.startDate)));

    const weatherResult = await fetchWeather(tripInput.destination, tripInput.startDate, tripInput.endDate);
    if (!weatherResult) {
      setError('Could not fetch weather for this destination. Check the city name and try again.');
      setAppState('input');
      return;
    }

    setWeather(weatherResult.weather);
    setResolvedCity(weatherResult.resolvedCity);

    try {
      const generatedItems = await generatePackingList(
        weatherResult.resolvedCity,
        tripInput.startDate,
        tripInput.endDate,
        tripInput.tripTypes,
        weatherResult.weather,
        nights
      );
      setItems(generatedItems);
      setAppState('list');
    } catch (e) {
      console.error('Gemini error:', e);
      const msg = e instanceof Error ? e.message : String(e);
      setError(`Could not generate packing list: ${msg}`);
      setAppState('input');
    }
  };

  const toggleItem = (id: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, packed: !i.packed } : i));

  const removeItem = (id: string) =>
    setItems(prev => prev.filter(i => i.id !== id));

  const updateQuantity = (id: string, qty: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));

  const addItem = (category: ItemCategory, name: string, quantity: string) =>
    setItems(prev => [...prev, {
      id: `custom_${Date.now()}`,
      name, quantity, category, packed: false, weatherDriven: false,
    }]);

  const nights = trip ? Math.max(1, differenceInDays(new Date(trip.endDate), new Date(trip.startDate))) : 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F0E8',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#2C1A0E',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 40px' }}>

        {/* Header */}
        <div style={{ paddingTop: 24, paddingBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: '#2C1A0E' }}>packrat</div>
            <div style={{ fontSize: 11, color: 'rgba(44,26,14,0.4)', fontWeight: 500, marginTop: 1 }}>weather-smart packing lists</div>
          </div>
          {appState === 'list' && trip && (
            <button
              onClick={() => { setAppState('input'); setItems([]); setWeather(null); setTrip(null); }}
              style={{ fontSize: 12, color: 'rgba(44,26,14,0.5)', background: 'none', border: '1px solid rgba(44,26,14,0.12)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              New trip
            </button>
          )}
        </div>

        {/* Loading */}
        {appState === 'loading' && (
          <div style={{ paddingTop: 60, textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '3px solid rgba(44,26,14,0.1)', borderTopColor: '#8B4513', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <div style={{ fontSize: 14, fontWeight: 500, color: '#2C1A0E', marginBottom: 4 }}>Checking weather...</div>
            <div style={{ fontSize: 12, color: 'rgba(44,26,14,0.4)' }}>Building your list with Gemini</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Input form */}
        {appState === 'input' && (
          <div>
            {error && (
              <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(153,27,27,0.06)', border: '1px solid rgba(153,27,27,0.15)', borderRadius: 8, fontSize: 13, color: '#991b1b' }}>
                {error}
              </div>
            )}
            <TripForm onSubmit={handleSubmit} loading={appState === 'loading'} />
          </div>
        )}

        {/* List view */}
        {appState === 'list' && trip && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {weather && (
              <WeatherBanner weather={weather} destination={resolvedCity || trip.destination} nights={nights} />
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11, color: 'rgba(44,26,14,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>
                {trip.tripTypes.join(' · ')}
              </div>
              <ShareButton trip={trip} items={items} />
            </div>

            <PackingList
              items={items}
              onToggle={toggleItem}
              onRemove={removeItem}
              onQuantityChange={updateQuantity}
              onAddItem={addItem}
            />
          </div>
        )}

      </div>
    </div>
  );
}
