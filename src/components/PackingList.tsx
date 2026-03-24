import { type PackingItemData, type ItemCategory } from '../types';
import CategoryCard from './CategoryCard';

const CATEGORY_ORDER: ItemCategory[] = ['Clothing', 'Footwear', 'Toiletries', 'Electronics', 'Documents', 'Health', 'Accessories', 'Other'];

interface Props {
  items: PackingItemData[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, qty: string) => void;
  onAddItem: (category: ItemCategory, name: string, quantity: string) => void;
}

export default function PackingList({ items, onToggle, onRemove, onQuantityChange, onAddItem }: Props) {
  const packed = items.filter(i => i.packed).length;
  const categories = CATEGORY_ORDER.filter(cat => items.some(i => i.category === cat));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#2C1A0E', letterSpacing: '-0.01em' }}>Your list</div>
        <div style={{ fontSize: 12, color: 'rgba(44,26,14,0.4)' }}>{packed}/{items.length} packed</div>
      </div>
      {categories.map(cat => (
        <CategoryCard key={cat} category={cat}
          items={items.filter(i => i.category === cat)}
          onToggle={onToggle} onRemove={onRemove}
          onQuantityChange={onQuantityChange} onAddItem={onAddItem}
        />
      ))}
    </div>
  );
}
