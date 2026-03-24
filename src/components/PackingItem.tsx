import { useState } from 'react';
import { type PackingItemData } from '../types';

interface Props {
  key?: string;
  item: PackingItemData;
  onToggle: () => void;
  onRemove: () => void;
  onQuantityChange: (quantity: string) => void;
}

export default function PackingItem({ item, onToggle, onRemove, onQuantityChange }: Props) {
  const [editingQty, setEditingQty] = useState(false);
  const [qtyVal, setQtyVal] = useState(item.quantity);

  const commitQty = () => {
    setEditingQty(false);
    if (qtyVal.trim()) onQuantityChange(qtyVal.trim());
    else setQtyVal(item.quantity);
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
      borderBottom: '1px solid rgba(44,26,14,0.1)',
      opacity: item.packed ? 0.45 : 1, transition: 'opacity 0.15s',
    }}>
      <button onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
        <div style={{
          width: 18, height: 18, borderRadius: 4,
          border: item.packed ? 'none' : '1.5px solid rgba(44,26,14,0.4)',
          background: item.packed ? '#8B4513' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {item.packed && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L4 7L9 1" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: '#2C1A0E', textDecoration: item.packed ? 'line-through' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.name}
          </span>
          {item.descriptor && (
            <span style={{ fontSize: 11, color: 'rgba(44,26,14,0.7)', fontStyle: 'italic', textDecoration: item.packed ? 'line-through' : 'none' }}>
              ({item.descriptor})
            </span>
          )}
          {item.weatherDriven && (
            <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(139,69,19,0.1)', color: '#8B4513', padding: '2px 5px', borderRadius: 4, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              weather
            </span>
          )}
        </div>
        {editingQty ? (
          <input
            autoFocus
            value={qtyVal}
            onChange={e => setQtyVal(e.target.value)}
            onBlur={commitQty}
            onKeyDown={e => e.key === 'Enter' && commitQty()}
            style={{ fontSize: 11, color: '#8B4513', background: 'none', border: 'none', outline: 'none', fontFamily: 'inherit', width: '100%', padding: 0, marginTop: 1 }}
          />
        ) : (
          <button onClick={() => setEditingQty(true)} style={{ fontSize: 11, color: 'rgba(44,26,14,0.7)', background: 'none', border: 'none', cursor: 'text', padding: 0, textAlign: 'left', fontFamily: 'inherit', marginTop: 1 }}>
            {item.quantity}
          </button>
        )}
      </div>

      <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(44,26,14,0.4)', flexShrink: 0, transition: 'color 0.15s' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#991b1b')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(44,26,14,0.4)')}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
