import { NextRequest, NextResponse } from 'next/server';

const VIETNAM_AIRLINES = ['HVN', 'VJ', 'QH']; // Vietnam Airlines, Vietjet, Bamboo
const AIRLINE_NAMES: Record<string, string> = {
  HVN: 'Vietnam Airlines',
  VJ: 'Vietjet Air',
  QH: 'Bamboo Airways',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dep_iata = searchParams.get('dep_iata');
  const arr_iata = searchParams.get('arr_iata');
  const flight_date = searchParams.get('flight_date');

  const params = [
    `access_key=${process.env.AVIATIONSTACK_API_KEY}`,
    dep_iata ? `dep_iata=${dep_iata}` : '',
    arr_iata ? `arr_iata=${arr_iata}` : '',
    flight_date ? `flight_date=${flight_date}` : '',
  ].filter(Boolean).join('&');

  const url = `http://api.aviationstack.com/v1/flights?${params}`;
  const res = await fetch(url);
  const data = await res.json();

  // Lọc hãng bay Việt Nam
  const flights = (data.data || []).filter((f: any) =>
    VIETNAM_AIRLINES.includes(f.airline?.iata)
  ).map((f: any) => {
    const iata = f.airline?.iata;
    return {
      flight_number: f.flight?.iata,
      airline: {
        iata,
        name: iata && AIRLINE_NAMES[iata] ? AIRLINE_NAMES[iata] : f.airline?.name,
      },
      departure: {
        airport: f.departure?.airport,
        iata: f.departure?.iata,
        scheduled: f.departure?.scheduled,
        terminal: f.departure?.terminal,
        gate: f.departure?.gate,
      },
      arrival: {
        airport: f.arrival?.airport,
        iata: f.arrival?.iata,
        scheduled: f.arrival?.scheduled,
        terminal: f.arrival?.terminal,
        gate: f.arrival?.gate,
      },
      status: f.flight_status,
      // Mock giá vé và số ghế còn lại
      price: mockPrice(iata),
      seats_left: mockSeats(),
    };
  });

  return NextResponse.json({ flights });
}

function mockPrice(iata: string) {
  // Giá vé giả lập theo hãng
  if (iata === 'HVN') return randomInt(1200000, 2500000);
  if (iata === 'QH') return randomInt(900000, 1800000);
  if (iata === 'VJ') return randomInt(800000, 1600000);
  return randomInt(1000000, 2000000);
}
function mockSeats() {
  return randomInt(5, 30);
}
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 