'use client';
import { useState, useEffect } from 'react';
import { getFlights, Flight } from '../../../lib/aviationstack';
import { createBooking } from '../../../lib/actions'; // Import Server Action

interface Props {
  params: { id: string };
}

export default function FlightDetail({ params }: Props) {
  const { id } = params;
  const [flight, setFlight] = useState<Flight | null>(null);
  const [passengers, setPassengers] = useState([{ name: '', dob: '', cccd: '', nationality: 'Vietnam' }]);
  const [contact, setContact] = useState({ name: '', phone: '', email: '' });

  // Lấy searchParams từ localStorage
  const [searchParams, setSearchParams] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  useEffect(() => {
    const fetchFlight = async () => {
      const flights = await getFlights('HAN', 'SGN', '2025-05-08');
      const selectedFlight = flights.find((f) => f.id === parseInt(id)) || null;
      setFlight(selectedFlight);
    };
    fetchFlight();

    // Lấy searchParams từ localStorage
    const storedParams = JSON.parse(localStorage.getItem('searchParams') || '{}');
    setSearchParams({
      adults: storedParams.adults || 1,
      children: storedParams.children || 0,
      infants: storedParams.infants || 0,
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('flightId', id);
    formData.append('totalPrice', flight?.price.toString() || '0');
    
    try {
      await createBooking(formData);
      // Lưu dữ liệu vào localStorage để trang booking sử dụng
      localStorage.setItem('flightBooking', JSON.stringify({ flight, passengers, contact }));
      window.location.href = '/flights/booking';
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Có lỗi xảy ra khi đặt vé. Vui lòng thử lại!');
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-24 bg-white flex items-center justify-between shadow-md px-6">
        <div className="flex items-center space-x-8">
          <a href="/">
            <img src="/assets/icon/logo.png" alt="Letgo Now" className="h-14 w-auto" />
          </a>
          <nav className="flex space-x-8">
            <a
              href="/yachts"
              className="text-black font-roboto text-xl font-bold hover:text-teal-500 hover:border-b-4 hover:border-teal-500 transition py-2"
            >
              Tìm du thuyền
            </a>
            <a
              href="/flights"
              className="text-black font-roboto text-xl font-bold border-b-4 border-teal-500 py-2"
            >
              Đặt vé máy bay
            </a>
            <a
              href="/hotels"
              className="text-black font-roboto text-xl font-bold hover:text-teal-500 hover:border-b-4 hover:border-teal-500 transition py-2"
            >
              Tìm khách sạn
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-32 max-w-5xl mx-auto px-4">
        {flight && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">Thông tin hành khách</h1>
            <div className="mb-4">
              <p className="text-gray-600">
                {flight.departure.iata} → {flight.arrival.iata} - {flight.departure.scheduled.slice(0, 10)}
              </p>
              <p className="text-lg font-semibold">
                {flight.flight.iata} - {flight.airline.name} - {flight.price.toLocaleString()}đ
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Array.from({ length: searchParams.adults + searchParams.children + searchParams.infants }, (_, i) => (
                <div key={i} className="border p-4 rounded-lg">
                  <h3 className="text-lg font-medium">Hành khách {i + 1}</h3>
                  <input
                    type="text"
                    placeholder="Họ tên"
                    value={passengers[i]?.name || ''}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[i] = { ...newPassengers[i], name: e.target.value };
                      setPassengers(newPassengers);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="date"
                    placeholder="Ngày sinh"
                    value={passengers[i]?.dob || ''}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[i] = { ...newPassengers[i], dob: e.target.value };
                      setPassengers(newPassengers);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mt-2"
                  />
                  <input
                    type="text"
                    placeholder="CCCD"
                    value={passengers[i]?.cccd || ''}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[i] = { ...newPassengers[i], cccd: e.target.value };
                      setPassengers(newPassengers);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mt-2"
                  />
                  <select
                    value={passengers[i]?.nationality || 'Vietnam'}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[i] = { ...newPassengers[i], nationality: e.target.value };
                      setPassengers(newPassengers);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mt-2"
                  >
                    <option value="Vietnam">Vietnam</option>
                    <option value="USA">USA</option>
                  </select>
                </div>
              ))}
              <h3 className="text-lg font-medium mt-4">Thông tin liên hệ</h3>
              <input
                type="text"
                placeholder="Họ tên"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="tel"
                placeholder="Số điện thoại"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mt-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mt-2"
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
                >
                  Tiếp
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-14 mt-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2">LetGoNow</h3>
            <p className="text-sm leading-relaxed">Khám phá du thuyền Hạ Long - Trải nghiệm độc đáo</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2">Liên kết</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:underline">Trang chủ</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">Đăng nhập</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2">Liên hệ</h4>
            <p className="text-sm">Email: info@letgonow.com</p>
            <p className="text-sm">Hotline: 0932 210 903</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Theo dõi</h4>
            <p className="text-sm">Facebook, Instagram, Tiktok</p>
          </div>
        </div>
        <p className="text-center text-xs mt-10 opacity-60">© 2025 LetGoNow. All rights reserved.</p>
      </footer>
    </div>
  );
}