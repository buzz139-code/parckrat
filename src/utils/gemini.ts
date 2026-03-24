import { GoogleGenAI } from '@google/genai';
import { type WeatherData, type TripType, type PackingItemData, type ItemCategory } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const TRIP_TYPE_CONTEXT: Record<TripType, string> = {
  business: 'business meetings, formal events, professional attire required',
  leisure: 'sightseeing, casual dining, relaxed activities',
  backpacking: 'budget travel, hostels, minimal luggage, multi-city',
  beach: 'beach, swimming, water activities, sun exposure',
  adventure: 'hiking, outdoor activities, physical exertion, varied terrain',
  winter: 'skiing, snowboarding, cold weather outdoor activities',
};

export async function generatePackingList(
  destination: string,
  startDate: string,
  endDate: string,
  tripTypes: TripType[],
  weather: WeatherData,
  nights: number
): Promise<PackingItemData[]> {
  const tripContext = tripTypes.map(t => TRIP_TYPE_CONTEXT[t]).join('; ');
  const prompt = `You are a travel packing expert. Generate a smart packing list for this trip:

Destination: ${destination}
Dates: ${startDate} to ${endDate} (${nights} nights)
Trip type: ${tripTypes.join(', ')} — ${tripContext}
Weather: ${weather.conditionLabel}, avg ${weather.avgTempC}°C (${weather.minTempC}–${weather.maxTempC}°C), total precipitation ${weather.precipMm}mm

Rules:
- Quantities should be practical for ${nights} nights (e.g. "3 pairs", "1 bottle", "enough for the trip")
- Mark weatherDriven: true for items specifically needed because of this weather (umbrella for rain, heavy coat for cold, sunscreen for sun)
- Categories must be one of: Clothing, Footwear, Toiletries, Electronics, Documents, Health, Accessories, Other
- Be specific (e.g. "Waterproof jacket" not just "Jacket")
- Don't include obvious things everyone always packs (wallet, phone) unless trip-type specific
- Aim for 25-40 items total, weighted toward the trip types selected
- For business: include formal wear, for beach: swimwear and sun protection, for adventure/backpacking: technical gear

Return ONLY valid JSON, no markdown, no explanation:
{
  "items": [
    {
      "name": "string",
      "quantity": "string",
      "category": "Clothing|Footwear|Toiletries|Electronics|Documents|Health|Accessories|Other",
      "weatherDriven": boolean
    }
  ]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });

  const text = response.text || '{}';
  const clean = text.replace(/```json|```/g, '').trim();
  const data = JSON.parse(clean);

  return (data.items || []).map((item: any, idx: number) => ({
    id: `item_${idx}_${Date.now()}`,
    name: item.name || '',
    quantity: item.quantity || '1',
    category: (item.category as ItemCategory) || 'Other',
    packed: false,
    weatherDriven: item.weatherDriven === true,
  }));
}
