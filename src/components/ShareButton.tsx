import { useState } from 'react';
import { type TripInput, type PackingItemData } from '../types';
import { buildShareUrl, copyToClipboard } from '../utils/share';

interface Props {
  trip: TripInput;
  items: PackingItemData[];
}

export default function ShareButton({ trip, items }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = buildShareUrl(trip, items);
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button onClick={handleShare} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: copied ? 'rgba(139,69,19,0.1)' : '#fff',
      border: '1px solid rgba(44,26,14,0.12)', borderRadius: 8,
      padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit',
      fontSize: 12, fontWeight: 700, color: copied ? '#8B4513' : '#2C1A0E',
      transition: 'all 0.2s',
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M9 1l4 3-4 3M13 4H6a3 3 0 000 6h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {copied ? 'Link copied!' : 'Share list'}
    </button>
  );
}
