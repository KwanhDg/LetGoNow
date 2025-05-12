'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const AIRLINE_LOGOS: Record<string, string> = {
  HVN: '/assets/airlines/vietnamairlines.png',
  QH: '/assets/airlines/bamboo.png',
  VJ: '/assets/airlines/vietjet.png',
};

function formatPrice(price: number) {
  return price.toLocaleString('vi-VN');
}

// Định nghĩa interface cho bookingData
interface Flight {
  id: number;
  flight_date: string;
  flight_status: string;
  departure: { iata: string; scheduled: string };
  arrival: { iata: string; scheduled: string };
  airline: { name: string; iata: string };
  flight: { iata: string };
  price: number;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
}

interface Passenger {
  name: string;
  dob: string;
  cccd: string;
  nationality: string;
}

interface BookingData {
  flight: Flight;
  passengers: Passenger[];
  contact: { name: string; phone: string; email: string };
}

// Mock data - in real app this would come from your state management
const mockFlight = {
  airline: { iata: 'HVN', name: 'Vietnam Airlines' },
  flightNumber: 'VN123',
  departure: { iata: 'HAN', scheduled: '2024-03-20T10:00:00' },
  arrival: { iata: 'SGN', scheduled: '2024-03-20T12:00:00' },
  price: 1500000,
  passengers: {
    adults: 1,
    children: 0,
    infants: 0
  }
};

const SEATS = [
  { id: 'A1', type: 'window', price: 0 },
  { id: 'A2', type: 'aisle', price: 0 },
  { id: 'A3', type: 'middle', price: 0 },
  { id: 'B1', type: 'window', price: 0 },
  { id: 'B2', type: 'aisle', price: 0 },
  { id: 'B3', type: 'middle', price: 0 },
  { id: 'C1', type: 'window', price: 0 },
  { id: 'C2', type: 'aisle', price: 0 },
  { id: 'C3', type: 'middle', price: 0 },
];

const BAGGAGE_OPTIONS = [
  { id: 'none', name: 'Không có hành lý', price: 0 },
  { id: '7kg', name: '7kg xách tay', price: 0 },
  { id: '20kg', name: '20kg ký gửi', price: 500000 },
  { id: '30kg', name: '30kg ký gửi', price: 800000 },
];

const MEAL_OPTIONS = [
  { id: 'none', name: 'Không có bữa ăn', price: 0 },
  { id: 'chicken', name: 'Cơm gà', price: 150000 },
  { id: 'beef', name: 'Cơm bò', price: 150000 },
  { id: 'vegetarian', name: 'Cơm chay', price: 150000 },
];

export default function BookingPage() {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedBaggage, setSelectedBaggage] = useState<string>('none');
  const [selectedMeal, setSelectedMeal] = useState<string>('none');
  const [totalPassengers, setTotalPassengers] = useState(0);

  useEffect(() => {
    // Calculate total passengers from mock data
    const total = mockFlight.passengers.adults + mockFlight.passengers.children;
    setTotalPassengers(total);
  }, []);

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      }
      if (prev.length < totalPassengers) {
        return [...prev, seatId];
      }
      return prev;
    });
  };

  const getTotalPrice = () => {
    const baggagePrice = BAGGAGE_OPTIONS.find(b => b.id === selectedBaggage)?.price || 0;
    const mealPrice = MEAL_OPTIONS.find(m => m.id === selectedMeal)?.price || 0;
    return mockFlight.price + baggagePrice + mealPrice;
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* Progress bar */}
      <div className="flex items-center justify-center gap-12 mb-8">
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full border-4 border-teal-400 bg-white flex items-center justify-center">
            <div className="w-4 h-4 bg-teal-400 rounded-full"></div>
          </div>
          <div className="font-bold mt-2 text-teal-600">Chọn chuyến bay</div>
          <div className="text-xs text-gray-500">Hoàn thành</div>
        </div>
        <div className="h-1 w-16 bg-teal-400 rounded-full"></div>
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full border-4 border-teal-400 bg-white flex items-center justify-center">
            <div className="w-4 h-4 bg-teal-400 rounded-full"></div>
          </div>
          <div className="font-bold mt-2 text-teal-600">Đặt chỗ</div>
          <div className="text-xs text-gray-500">Vui lòng chọn ghế và dịch vụ</div>
        </div>
        <div className="h-1 w-16 bg-gray-200 rounded-full"></div>
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full border-4 border-gray-200 bg-white flex items-center justify-center">
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
          </div>
          <div className="font-bold mt-2">Thanh toán</div>
          <div className="text-xs text-gray-500">Thanh toán để nhận vé máy bay</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Box chi tiết chuyến bay */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full md:w-1/3 mb-6 md:mb-0">
          <div className="flex items-center gap-3 mb-4">
            <img src={AIRLINE_LOGOS[mockFlight.airline.iata]} alt={mockFlight.airline.name} className="h-10 w-20 object-contain" />
            <div>
              <div className="font-semibold">{mockFlight.departure.iata} → {mockFlight.arrival.iata}</div>
              <div className="text-gray-500 text-sm">
                {new Date(mockFlight.departure.scheduled).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })},
                {new Date(mockFlight.departure.scheduled).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="font-semibold mb-2">Tóm tắt vé</div>
            <div className="text-gray-700 mb-1">{mockFlight.passengers.adults} x Người lớn</div>
            {mockFlight.passengers.children > 0 && (
              <div className="text-gray-700 mb-1">{mockFlight.passengers.children} x Trẻ em</div>
            )}
            {mockFlight.passengers.infants > 0 && (
              <div className="text-gray-700 mb-1">{mockFlight.passengers.infants} x Em bé</div>
            )}
            <div className="text-gray-700 mb-1">Chiều đi: {formatPrice(mockFlight.price)} VND</div>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="font-semibold mb-2">Ghế đã chọn ({selectedSeats.length}/{totalPassengers})</div>
            <div className="text-gray-700 mb-1">
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Chưa chọn ghế'}
            </div>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="font-semibold mb-2">Hành lý</div>
            <div className="text-gray-700 mb-1">
              {BAGGAGE_OPTIONS.find(b => b.id === selectedBaggage)?.name || 'Chưa chọn'}
            </div>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="font-semibold mb-2">Bữa ăn</div>
            <div className="text-gray-700 mb-1">
              {MEAL_OPTIONS.find(m => m.id === selectedMeal)?.name || 'Chưa chọn'}
            </div>
          </div>
          <div className="border-t pt-4 mt-4 flex items-center justify-between">
            <div className="font-bold">Tổng</div>
            <div className="font-bold text-xl text-teal-700">{formatPrice(getTotalPrice())} VND</div>
          </div>
        </div>

        {/* Box chọn ghế và dịch vụ */}
        <div className="flex-1 bg-white rounded-2xl shadow-md p-6">
          {/* Chọn ghế */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Chọn ghế ({selectedSeats.length}/{totalPassengers})</h2>
            <div className="grid grid-cols-3 gap-4">
              {SEATS.map(seat => (
                <button
                  key={seat.id}
                  type="button"
                  onClick={() => handleSeatClick(seat.id)}
                  disabled={!selectedSeats.includes(seat.id) && selectedSeats.length >= totalPassengers}
                  className={`p-4 rounded-xl border ${
                    selectedSeats.includes(seat.id)
                      ? 'bg-teal-100 border-teal-400 text-teal-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  } ${!selectedSeats.includes(seat.id) && selectedSeats.length >= totalPassengers ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-semibold">{seat.id}</div>
                  <div className="text-sm">{seat.type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Chọn hành lý */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Hành lý</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BAGGAGE_OPTIONS.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedBaggage(option.id)}
                  className={`p-4 rounded-xl border ${
                    selectedBaggage === option.id
                      ? 'bg-teal-100 border-teal-400 text-teal-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="font-semibold">{option.name}</div>
                  <div className="text-sm">{option.price > 0 ? `${formatPrice(option.price)} VND` : 'Miễn phí'}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Chọn bữa ăn */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Bữa ăn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MEAL_OPTIONS.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedMeal(option.id)}
                  className={`p-4 rounded-xl border ${
                    selectedMeal === option.id
                      ? 'bg-teal-100 border-teal-400 text-teal-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="font-semibold">{option.name}</div>
                  <div className="text-sm">{option.price > 0 ? `${formatPrice(option.price)} VND` : 'Miễn phí'}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Nút điều hướng */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold"
            >
              ← Quay lại
            </button>
            <button
              type="button"
              onClick={() => router.push('/flights/payment')}
              disabled={selectedSeats.length !== totalPassengers}
              className="px-8 py-3 rounded-full bg-[#7ee3e0] text-gray-800 font-bold text-lg hover:bg-[#5fd3d0] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tiếp tục thanh toán →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}