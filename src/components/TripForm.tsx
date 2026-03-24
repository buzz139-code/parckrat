import { useState, useRef } from 'react';
import { format, addDays, differenceInDays } from 'date-fns';
import { type TripInput, type TripType } from '../types';
import TripTypeSelector from './TripTypeSelector';

interface Props {
  onSubmit: (trip: TripInput) => void;
  loading: boolean;
}

export default function TripForm({ onSubmit, loading }: Props) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const defaultEnd = format(addDays(new Date(), 7), 'yyyy-MM-dd');

  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [tripTypes, setTripTypes] = useState<TripType[]>(['leisure']);
  const [error, setError] = useState('');

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nights = Math.max(1, differenceInDays(new Date(endDate), new Date(startDate)));

  const fetchSuggestions = async (value: string) => {
    if (value.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(value)}&count=5&language=en&format=json`
      );
      if (!res.ok) return;
      const data = await res.json();
      const results = (data.results || []).map((r: any) =>
        [r.name, r.admin1, r.country].filter(Boolean).join(', ')
      );
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch { setSuggestions([]); }
  };

  const handleSubmit = () => {
    if (!destination.trim()) { setError('Please enter a destination'); return; }
    if (new Date(endDate) <= new Date(startDate)) { setError('End date must be after start date'); return; }
    setError('');
    onSubmit({ destination: destination.trim(), startDate, endDate, tripTypes });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(44,26,14,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          Destination
        </div>
        <input
          type="text"
          placeholder="City or country..."
          value={destination}
          onChange={e => {
            const value = e.target.value;
            setDestination(value);
            setError('');
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => fetchSuggestions(value), 350);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 10,
            border: '1px solid rgba(44,26,14,0.25)', background: '#fff',
            fontSize: 15, color: '#2C1A0E', outline: 'none', fontFamily: 'inherit',
          }}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: '#fff', border: '1px solid rgba(44,26,14,0.25)',
            borderRadius: 10, zIndex: 50, marginTop: 4,
            boxShadow: '0 4px 16px rgba(44,26,14,0.08)', overflow: 'hidden',
          }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onMouseDown={() => {
                  setDestination(s);
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 14px',
                  background: 'none', border: 'none',
                  borderBottom: i < suggestions.length - 1 ? '1px solid rgba(44,26,14,0.1)' : 'none',
                  fontSize: 13, color: '#2C1A0E', cursor: 'pointer', fontFamily: 'inherit',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f5f0e8')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(44,26,14,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Depart</div>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
            style={{ width: '100%', padding: '12px 10px', borderRadius: 10, border: '1px solid rgba(44,26,14,0.25)', background: '#fff', fontSize: 13, color: '#2C1A0E', outline: 'none', fontFamily: 'inherit' }} />
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(44,26,14,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Return</div>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
            style={{ width: '100%', padding: '12px 10px', borderRadius: 10, border: '1px solid rgba(44,26,14,0.25)', background: '#fff', fontSize: 13, color: '#2C1A0E', outline: 'none', fontFamily: 'inherit' }} />
        </div>
      </div>

      {nights > 0 && (
        <div style={{ fontSize: 12, color: 'rgba(44,26,14,0.7)', textAlign: 'center' }}>
          {nights} night{nights !== 1 ? 's' : ''}
        </div>
      )}

      <TripTypeSelector selected={tripTypes} onChange={setTripTypes} />

      {error && (
        <div style={{ fontSize: 12, color: '#991b1b', padding: '8px 12px', background: 'rgba(153,27,27,0.1)', borderRadius: 8 }}>
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !destination.trim()}
        style={{
          width: '100%', padding: '14px', borderRadius: 10, border: 'none',
          background: loading || !destination.trim() ? 'rgba(44,26,14,0.3)' : '#2C1A0E',
          color: '#F5F0E8', fontSize: 14, fontWeight: 700, cursor: loading || !destination.trim() ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', letterSpacing: '0.02em', transition: 'background 0.15s',
        }}
      >
        {loading ? 'Building your list...' : 'Build my packing list'}
      </button>
    </div>
  );
}
