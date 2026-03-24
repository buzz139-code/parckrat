import { useState } from 'react';
import { type PackingItemData, type ItemCategory } from '../types';
import PackingItem from './PackingItem';

interface Props {
  key?: string;
  category: ItemCategory;
  items: PackingItemData[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, qty: string) => void;
  onAddItem: (category: ItemCategory, name: string, quantity: string) => void;
}

export default function CategoryCard({ category, items, onToggle, onRemove, onQuantityChange, onAddItem }: Props) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('1');
  const packed = items.filter(i => i.packed).length;

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddItem(category, newName.trim(), newQty.trim() || '1');
    setNewName('');
    setNewQty('1');
    setAdding(false);
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(44,26,14,0.07)', overflow: 'hidden', marginBottom: 10 }}>
      <div style={{ padding: '12px 14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#2C1A0E', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{category}</span>
          <span style={{ fontSize: 10, color: 'rgba(44,26,14,0.7)' }}>{items.length} items</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {packed > 0 && <span style={{ fontSize: 10, color: '#8B4513', fontWeight: 700 }}>{packed}/{items.length}</span>}
          <button onClick={() => setAdding(!adding)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'rgba(44,26,14,0.7)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ height: 2, background: 'rgba(44,26,14,0.15)', margin: '10px 14px 0' }}>
        {items.length > 0 && <div style={{ height: 2, background: '#8B4513', width: `${(packed / items.length) * 100}%`, transition: 'width 0.3s' }} />}
      </div>

      <div style={{ padding: '0 14px 10px' }}>
        {items.map(item => (
          <PackingItem key={item.id} item={item}
            onToggle={() => onToggle(item.id)}
            onRemove={() => onRemove(item.id)}
            onQuantityChange={qty => onQuantityChange(item.id, qty)}
          />
        ))}

        {adding && (
          <div style={{ display: 'flex', gap: 6, marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(44,26,14,0.2)' }}>
            <input autoFocus placeholder="Item name..." value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(44,26,14,0.25)', fontSize: 12, color: '#2C1A0E', background: '#faf8f3', outline: 'none', fontFamily: 'inherit' }} />
            <input placeholder="Qty" value={newQty} onChange={e => setNewQty(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              style={{ width: 48, padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(44,26,14,0.25)', fontSize: 12, color: '#2C1A0E', background: '#faf8f3', outline: 'none', fontFamily: 'inherit', textAlign: 'center' }} />
            <button onClick={handleAdd} style={{ background: '#8B4513', border: 'none', borderRadius: 6, padding: '6px 10px', color: '#F5F0E8', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Add</button>
          </div>
        )}
      </div>
    </div>
  );
}
