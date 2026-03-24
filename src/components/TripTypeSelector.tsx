import { type TripType, type TripTypeConfig } from '../types';

const TRIP_TYPES: TripTypeConfig[] = [
  { id: 'business', label: 'Business', description: 'Meetings & formal', icon: '💼' },
  { id: 'leisure', label: 'Leisure', description: 'Sightseeing & relaxing', icon: '🌅' },
  { id: 'backpacking', label: 'Backpacking', description: 'Light & multi-city', icon: '🎒' },
  { id: 'beach', label: 'Beach', description: 'Sun, sea & swim', icon: '🏖️' },
  { id: 'adventure', label: 'Adventure', description: 'Hiking & outdoors', icon: '🎒' },
  { id: 'winter', label: 'Winter', description: 'Ski & cold weather', icon: '⛷️' },
];

interface Props {
  selected: TripType[];
  onChange: (types: TripType[]) => void;
}

export default function TripTypeSelector({ selected, onChange }: Props) {
  const toggle = (id: TripType) => {
    if (selected.includes(id)) {
      if (selected.length === 1) return;
      onChange(selected.filter(t => t !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(44,26,14,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        Trip type — select all that apply
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {TRIP_TYPES.map(type => {
          const isActive = selected.includes(type.id);
          return (
            <button
              key={type.id}
              onClick={() => toggle(type.id)}
              style={{
                padding: '10px 8px',
                borderRadius: 10,
                border: isActive ? '1.5px solid #8B4513' : '1px solid rgba(44,26,14,0.2)',
                background: isActive ? 'rgba(139,69,19,0.08)' : '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 18, marginBottom: 4 }}>{type.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? '#8B4513' : '#2C1A0E', marginBottom: 2 }}>{type.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(44,26,14,0.7)', lineHeight: 1.3 }}>{type.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
