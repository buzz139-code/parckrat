import { useState } from 'react';
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

  const nights = Math.max(1, differenceInDays(new Date(endDate), new Date(startDate)));

  const handleSubmit = () => {
    if (!destination.trim()) { setError('Please enter a destination'); return; }
    if (new Date(endDate) <= new Date(startDate)) { setError('End date must be after start date'); return; }
    setError('');
    onSubmit({ destination: destination.trim(), startDate, endDate, tripTypes });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(44,26,14,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          Destination
        </div>
        <input
          type="text"
          placeholder="City or country..."
          value={destination}
          onChange={e => { setDestination(e.target.value); setError(''); }}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 10,
            border: '1px solid rgba(44,26,14,0.12)', background: '#fff',
            fontSize: 15, color: '#2C1A0E', outline: 'none', fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(44,26,14,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Depart</div>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
            style={{ width: '100%', padding: '12px 10px', borderRadius: 10, border: '1px solid rgba(44,26,14,0.12)', background: '#fff', fontSize: 13, color: '#2C1A0E', outline: 'none', fontFamily: 'inherit' }} />
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(44,26,14,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Return</div>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
            style={{ width: '100%', padding: '12px 10px', borderRadius: 10, border: '1px solid rgba(44,26,14,0.12)', background: '#fff', fontSize: 13, color: '#2C1A0E', outline: 'none', fontFamily: 'inherit' }} />
        </div>
      </div>

      {nights > 0 && (
        <div style={{ fontSize: 12, color: 'rgba(44,26,14,0.4)', textAlign: 'center' }}>
          {nights} night{nights !== 1 ? 's' : ''}
        </div>
      )}

      <TripTypeSelector selected={tripTypes} onChange={setTripTypes} />

      {error && (
        <div style={{ fontSize: 12, color: '#991b1b', padding: '8px 12px', background: 'rgba(153,27,27,0.06)', borderRadius: 8 }}>
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !destination.trim()}
        style={{
          width: '100%', padding: '14px', borderRadius: 10, border: 'none',
          background: loading || !destination.trim() ? 'rgba(44,26,14,0.15)' : '#2C1A0E',
          color: '#F5F0E8', fontSize: 14, fontWeight: 700, cursor: loading || !destination.trim() ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', letterSpacing: '0.02em', transition: 'background 0.15s',
        }}
      >
        {loading ? 'Building your list...' : 'Build my packing list'}
      </button>
    </div>
  );
}
