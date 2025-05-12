'use client';

import { useState, useEffect } from 'react';
import { getFlights, Flight } from '../../lib/aviationstack';
import { useRouter } from 'next/navigation';

const AIRLINE_LOGOS: Record<string, string> = {
  HVN: '/assets/airlines/vietnamairlines.png',
  QH: '/assets/airlines/bamboo.png',
  VJ: '/assets/airlines/vietjet.png',
};

function formatPrice(price: number) {
  return price.toLocaleString('vi-VN');
}
function getWeekday(dateStr: string) {
  const d = new Date(dateStr);
  return ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][d.getDay()];
}
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN');
}

const AIRPORTS = [
  { code: 'HAN', name: 'Sân bay Nội Bài (HAN)' },
  { code: 'SGN', name: 'Sân bay Tân Sơn Nhất (SGN)' },
  { code: 'DAD', name: 'Sân bay Đà Nẵng (DAD)' },
  { code: 'CXR', name: 'Sân bay Cam Ranh (CXR)' },
  { code: 'HUI', name: 'Sân bay Phú Bài (HUI)' },
  { code: 'VCA', name: 'Sân bay Cần Thơ (VCA)' },
  { code: 'PQC', name: 'Sân bay Phú Quốc (PQC)' },
  { code: 'VDH', name: 'Sân bay Đồng Hới (VDH)' },
  { code: 'VII', name: 'Sân bay Vinh (VII)' },
];

export default function FlightSearch() {
  const [searchParams, setSearchParams] = useState({
    isRoundTrip: false,
    departure: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<{[key: string]: boolean}>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const router = useRouter();
  const [passengerInputs, setPassengerInputs] = useState<any[]>([]);
  const [showValidationError, setShowValidationError] = useState(false);

  useEffect(() => {
    const total = searchParams.adults + searchParams.children;
    setPassengerInputs(inputs => {
      if (inputs.length < total) {
        return [
          ...inputs,
          ...Array.from({ length: total - inputs.length }, () => ({
            type: '', ho: '', ten: '', dob: '', cccd: '', cccd_exp: ''
          }))
        ];
      } else if (inputs.length > total) {
        return inputs.slice(0, total);
      }
      return inputs;
    });
  }, [searchParams.adults, searchParams.children]);

  const handleSearch = async () => {
    setLoading(true);
    setShowResult(false);
    setFlights([]);
    setSelectedDate(searchParams.departureDate);
    try {
      const res = await fetch(`/api/flights?dep_iata=${searchParams.departure}&arr_iata=${searchParams.destination}&flight_date=${searchParams.departureDate}`);
      const data = await res.json();
      setFlights(data.flights || []);
      setShowResult(true);
    } catch (e) {
      setFlights([]);
      setShowResult(true);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // Lấy 5 ngày liên tiếp để chọn
  const getDateRange = () => {
    const base = searchParams.departureDate ? new Date(searchParams.departureDate) : new Date();
    return Array.from({length: 5}, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i - 2);
      return d.toISOString().slice(0,10);
    });
  };

  // Lọc theo hãng bay
  const filteredFlights = flights.filter((f: any) => {
    const checked = Object.keys(filter).filter(k => filter[k]);
    if (checked.length === 0) return true;
    return checked.includes(f.airline.name);
  });

  const filteredFrom = AIRPORTS.filter(a =>
    a.name.toLowerCase().includes(searchParams.departure.toLowerCase()) ||
    a.code.toLowerCase().includes(searchParams.departure.toLowerCase())
  );
  const filteredTo = AIRPORTS.filter(a =>
    a.name.toLowerCase().includes(searchParams.destination.toLowerCase()) ||
    a.code.toLowerCase().includes(searchParams.destination.toLowerCase())
  );

  // Phân trang
  const total = filteredFlights.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pagedFlights = filteredFlights.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const isFormValid = () => {
    if (passengerInputs.length !== searchParams.adults + searchParams.children) return false;
    for (const p of passengerInputs) {
      if (!p.type || !p.ho || !p.ten || !p.dob || !p.cccd || !p.cccd_exp) return false;
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Hàng 1: loại vé */}
      <div className="flex items-center gap-6 mb-4">
        <label className="flex items-center gap-2 text-base font-medium">
          <input
            type="radio"
            checked={!searchParams.isRoundTrip}
            onChange={() => setSearchParams({ ...searchParams, isRoundTrip: false })}
            className="accent-teal-400 w-4 h-4"
          /> Một chiều
        </label>
        <label className="flex items-center gap-2 text-base font-medium">
          <input
            type="radio"
            checked={searchParams.isRoundTrip}
            onChange={() => setSearchParams({ ...searchParams, isRoundTrip: true })}
            className="accent-teal-400 w-4 h-4"
          /> Khứ hồi
        </label>
        <label className="flex items-center gap-2 text-base font-medium ml-auto">
          <input type="checkbox" className="accent-teal-400 w-4 h-4" /> Vé rẻ nhất tháng
        </label>
      </div>
      {/* Hàng 2: điểm đi/điểm đến */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Điểm đi */}
        <div className="flex-1 min-w-[220px] relative">
          <label className="block text-sm text-gray-500 mb-1 ml-2">Điểm đi</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.5" d="M2.25 19h19.5M3.5 15.5l7.5 2.5m0 0l7.5-5.5m-7.5 5.5V4.75a.75.75 0 0 1 1.5 0V13"/></svg>
            </span>
            <input
              type="text"
              value={searchParams.departure}
              onChange={e => setSearchParams({ ...searchParams, departure: e.target.value })}
              onFocus={() => setShowFromDropdown(true)}
              onBlur={() => setTimeout(() => setShowFromDropdown(false), 150)}
              placeholder="Nhập tên hoặc mã sân bay"
              className="pl-10 pr-4 py-4 w-full rounded-full border border-gray-200 focus:ring-2 focus:ring-teal-300 focus:border-teal-400 bg-white text-gray-700 placeholder-gray-400 text-base shadow-sm"
              autoComplete="off"
            />
            {showFromDropdown && filteredFrom.length > 0 && (
              <div className="absolute left-0 right-0 top-14 bg-white border border-gray-200 rounded-2xl shadow-lg z-30 max-h-60 overflow-auto">
                {filteredFrom.map(a => (
                  <div
                    key={a.code}
                    className="px-4 py-2 cursor-pointer hover:bg-teal-50"
                    onMouseDown={() => {
                      setSearchParams(sp => ({ ...sp, departure: a.code }));
                      setShowFromDropdown(false);
                    }}
                  >
                    {a.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Điểm đến */}
        <div className="flex-1 min-w-[220px] relative">
          <label className="block text-sm text-gray-500 mb-1 ml-2">Điểm đến</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.5" d="M2.25 19h19.5M3.5 15.5l7.5 2.5m0 0l7.5-5.5m-7.5 5.5V4.75a.75.75 0 0 1 1.5 0V13"/></svg>
            </span>
            <input
              type="text"
              value={searchParams.destination}
              onChange={e => setSearchParams({ ...searchParams, destination: e.target.value })}
              onFocus={() => setShowToDropdown(true)}
              onBlur={() => setTimeout(() => setShowToDropdown(false), 150)}
              placeholder="Nhập tên hoặc mã sân bay"
              className="pl-10 pr-4 py-4 w-full rounded-full border border-gray-200 focus:ring-2 focus:ring-teal-300 focus:border-teal-400 bg-white text-gray-700 placeholder-gray-400 text-base shadow-sm"
              autoComplete="off"
            />
            {showToDropdown && filteredTo.length > 0 && (
              <div className="absolute left-0 right-0 top-14 bg-white border border-gray-200 rounded-2xl shadow-lg z-30 max-h-60 overflow-auto">
                {filteredTo.map(a => (
                  <div
                    key={a.code}
                    className="px-4 py-2 cursor-pointer hover:bg-teal-50"
                    onMouseDown={() => {
                      setSearchParams(sp => ({ ...sp, destination: a.code }));
                      setShowToDropdown(false);
                    }}
                  >
                    {a.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Hàng 3: ngày đi, người lớn, trẻ em, em bé, nút tìm chuyến bay */}
      <div className="flex flex-col md:flex-row md:items-end md:gap-4">
        {/* Ngày đi */}
        <div className="flex-1 mb-4 md:mb-0">
          <label className="block text-sm text-gray-500 mb-1 ml-2">Ngày đi</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {/* Calendar icon */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/><path stroke="currentColor" strokeWidth="1.5" d="M16 3v4M8 3v4M3 9h18"/></svg>
            </span>
            <input
              type="date"
              value={searchParams.departureDate}
              onChange={e => setSearchParams({ ...searchParams, departureDate: e.target.value })}
              className="pl-10 pr-4 py-4 w-full rounded-full border border-gray-200 focus:ring-2 focus:ring-teal-300 focus:border-teal-400 bg-white text-gray-700 placeholder-gray-400 text-base shadow-sm"
            />
          </div>
        </div>
        {/* Người lớn */}
        <div className="flex-1 mb-4 md:mb-0">
          <label className="block text-sm text-gray-500 mb-1 ml-2">Người lớn</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {/* User icon */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path stroke="currentColor" strokeWidth="1.5" d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>
            </span>
            <input
              type="number"
              min="1"
              value={searchParams.adults}
              onChange={e => setSearchParams({ ...searchParams, adults: parseInt(e.target.value) })}
              className="pl-10 pr-4 py-4 w-full rounded-full border border-gray-200 focus:ring-2 focus:ring-teal-300 focus:border-teal-400 bg-white text-gray-700 placeholder-gray-400 text-base shadow-sm"
            />
          </div>
        </div>
        {/* Trẻ em */}
        <div className="flex-1 mb-4 md:mb-0">
          <label className="block text-sm text-gray-500 mb-1 ml-2">Trẻ em</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {/* User icon */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path stroke="currentColor" strokeWidth="1.5" d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>
            </span>
            <input
              type="number"
              min="0"
              value={searchParams.children}
              onChange={e => setSearchParams({ ...searchParams, children: parseInt(e.target.value) })}
              className="pl-10 pr-4 py-4 w-full rounded-full border border-gray-200 focus:ring-2 focus:ring-teal-300 focus:border-teal-400 bg-white text-gray-700 placeholder-gray-400 text-base shadow-sm"
            />
          </div>
        </div>
        {/* Em bé */}
        <div className="flex-1 mb-4 md:mb-0">
          <label className="block text-sm text-gray-500 mb-1 ml-2">Em bé</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {/* User icon */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path stroke="currentColor" strokeWidth="1.5" d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>
            </span>
            <input
              type="number"
              min="0"
              value={searchParams.infants}
              onChange={e => setSearchParams({ ...searchParams, infants: parseInt(e.target.value) })}
              className="pl-10 pr-4 py-4 w-full rounded-full border border-gray-200 focus:ring-2 focus:ring-teal-300 focus:border-teal-400 bg-white text-gray-700 placeholder-gray-400 text-base shadow-sm"
            />
          </div>
        </div>
        {/* Button */}
        <div className="flex-1 flex items-end justify-end">
          <button
            type="submit"
            className="w-full md:w-auto px-10 py-4 bg-[#7ee3e0] text-gray-800 font-semibold rounded-full text-base shadow-md hover:bg-[#5fd3d0] transition border-0"
            disabled={loading}
          >
            {loading ? 'Đang tìm...' : 'Tìm chuyến bay'}
          </button>
        </div>
      </div>

      {/* Kết quả tìm kiếm hoặc Đặt chỗ */}
      {showResult && !selectedFlight && (
        <div className="mt-12">
          {/* Tiến trình 3 bước */}
          <div className="flex items-center justify-center gap-12 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full border-4 border-teal-400 bg-white flex items-center justify-center">
                <div className="w-4 h-4 bg-teal-400 rounded-full"></div>
              </div>
              <div className="font-bold mt-2 text-teal-600">Chọn chuyến bay</div>
              <div className="text-xs text-gray-500">Vui lòng chọn chuyến bay</div>
            </div>
            <div className="h-1 w-16 bg-gray-200 rounded-full"></div>
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full border-4 border-gray-200 bg-white flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
              </div>
              <div className="font-bold mt-2">Đặt chỗ</div>
              <div className="text-xs text-gray-500">Điền thông tin để đặt chỗ</div>
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
            {/* Box kết quả chuyến bay */}
            <div className="flex-1 bg-white rounded-2xl shadow-md p-6">
              {/* Hành trình và ngày */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 text-teal-600 font-semibold">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.5" d="M2.25 19h19.5M3.5 15.5l7.5 2.5m0 0l7.5-5.5m-7.5 5.5V4.75a.75.75 0 0 1 1.5 0V13"/></svg>
                    {searchParams.departure && searchParams.destination ? (
                      <span>{searchParams.departure} &rarr; {searchParams.destination}</span>
                    ) : (
                      <span>Chọn hành trình</span>
                    )}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">
                    {selectedDate ? `${getWeekday(selectedDate)}, ${formatDate(selectedDate)}` : ''}
                  </div>
                </div>
                {/* Thanh chọn ngày */}
                <div className="flex gap-2 mt-4 md:mt-0">
                  {getDateRange().map(date => (
                    <button
                      key={date}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={`px-4 py-2 rounded-xl border ${selectedDate === date ? 'bg-teal-100 border-teal-400 text-teal-700 font-bold' : 'bg-gray-50 border-gray-200 text-gray-600'} transition`}
                    >
                      <div className="text-xs">{getWeekday(date)}</div>
                      <div className="text-lg">{date.slice(8,10)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Danh sách chuyến bay */}
              {loading ? (
                <div className="text-center py-12 text-gray-500">Đang tải chuyến bay...</div>
              ) : pagedFlights.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Không tìm thấy chuyến bay phù hợp.</div>
              ) : (
                <div className="space-y-4">
                  {pagedFlights.map((f: any) => (
                    <div key={f.flight_number + f.departure.scheduled} className={`flex items-center bg-white rounded-2xl shadow p-4 gap-4 ${selectedFlight && selectedFlight.flight_number === f.flight_number ? 'border-2 border-teal-400 bg-teal-50' : ''}`}>
                      <img src={AIRLINE_LOGOS[f.airline.iata] || '/assets/airlines/default.png'} alt={f.airline.name} className="h-10 w-20 object-contain" />
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{f.flight_number}</div>
                        <div className="text-gray-500 text-sm">{f.airline.name}</div>
                        <div className="text-gray-500 text-sm mt-1">{f.departure.iata} {f.departure.scheduled?.slice(11,16)} &rarr; {f.arrival.iata} {f.arrival.scheduled?.slice(11,16)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-teal-600 font-bold text-xl">{formatPrice(f.price)}</div>
                        <div className="text-xs text-gray-500">VND</div>
                        <button type="button" onClick={()=>setSelectedFlight(f)} className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 mt-2">Chọn</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 px-2 py-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 text-base">
                    Đang xem:
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border font-bold text-gray-800">{Math.min(page*PAGE_SIZE, total)}</span>
                    của {total}
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-4 py-2 rounded-full border bg-white text-gray-700 font-medium disabled:opacity-50">← Trước</button>
                    {/* Số trang */}
                    {Array.from({length: totalPages}).map((_,i)=>{
                      if (totalPages > 7 && (i+1 !== 1 && i+1 !== totalPages && Math.abs(i+1-page)>1 && i+1 !== page)) {
                        if (i+1 === 2 && page > 4) return <span key={i}>...</span>;
                        if (i+1 === totalPages-1 && page < totalPages-3) return <span key={i}>...</span>;
                        if (i+1 < page-1 && i+1 !== 1) return null;
                        if (i+1 > page+1 && i+1 !== totalPages) return null;
                      }
                      return (
                        <button key={i} type="button" onClick={()=>setPage(i+1)} className={`w-10 h-10 rounded-lg border text-base font-semibold mx-0.5 ${page===i+1?'bg-teal-100 border-teal-400 text-teal-700':'bg-white border-gray-200 text-gray-700'}`}>{i+1}</button>
                      );
                    })}
                    <button type="button" disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-4 py-2 rounded-full border bg-white text-gray-700 font-medium disabled:opacity-50">Tiếp →</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Giao diện Đặt chỗ */}
      {selectedFlight && (
        <div className="mt-12 flex flex-col md:flex-row gap-8">
          {/* Box chi tiết giá vé */}
          <div className="bg-white rounded-2xl shadow-md p-6 w-full md:w-1/3 mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <img src={AIRLINE_LOGOS[selectedFlight.airline.iata] || '/assets/airlines/default.png'} alt={selectedFlight.airline.name} className="h-10 w-20 object-contain" />
              <div>
                <div className="font-semibold">{selectedFlight.departure.iata} → {selectedFlight.arrival.iata}</div>
                <div className="text-gray-500 text-sm">{selectedFlight.departure.scheduled?.slice(11,16)}, {formatDate(selectedFlight.departure.scheduled)}</div>
              </div>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="font-semibold mb-2">Tóm tắt vé</div>
              <div className="text-gray-700 mb-1">{searchParams.adults} x Người lớn</div>
              <div className="text-gray-700 mb-1">Chiều đi: {formatPrice(selectedFlight.price)} VND</div>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="font-semibold mb-2">Hành lý ký gửi</div>
              <div className="text-gray-500 text-sm">Theo quy định của hãng</div>
            </div>
            <div className="border-t pt-4 mt-4 flex items-center justify-between">
              <div className="font-bold">Tổng</div>
              <div className="font-bold text-xl text-teal-700">{formatPrice(selectedFlight.price)} VND</div>
            </div>
          </div>

          {/* Box nhập thông tin hành khách và liên hệ */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6">
            <div className="font-bold text-lg mb-2">Thông tin hành khách</div>
            <div className="text-red-500 text-sm mb-4">
              * Quý Khách vui lòng sử dụng tiếng Việt không dấu và không sử dụng các ký tự đặc biệt.<br/>
              * Vui lòng nhập đầy đủ tên hành khách và những thông tin khác xuất hiện trên (các) giấy tờ tùy thân do chính phủ cấp của hành khách. (Số Căn cước công dân hoặc Hộ chiếu, ngày hết hạn phải chính xác)<br/>
              * Lưu ý đặc biệt: Hệ thống của hãng hàng không VietJet Air sẽ không cho phép khách hàng đặt vé quá 02 lần mà không thanh toán. Quý khách vui lòng chắc chắn khi đặt vé để đảm bảo thanh toán thành công.<br/>
              * Nếu cần sự hỗ trợ, quý khách vui lòng liên hệ Hotline của LetGoNow: 0922 222 016.
            </div>
            {/* Render form cho người lớn */}
            {Array.from({ length: searchParams.adults }).map((_, idx) => (
              <div key={`adult-${idx}`} className="mb-8">
                <div className="flex items-center gap-2 mb-2 font-semibold">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path stroke="currentColor" strokeWidth="1.5" d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>
                  Người lớn - Hành khách {idx + 1}
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <select className="w-full rounded-full border border-gray-200 py-3 px-4" required value={passengerInputs[idx]?.type || ''} onChange={e => setPassengerInputs(arr => { const cp = [...arr]; cp[idx].type = e.target.value; return cp; })}>
                    <option value="">Nam/Nữ *</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                  <input type="text" className="w-full rounded-full border border-gray-200 py-3 px-4" placeholder="Họ *" required value={passengerInputs[idx]?.ho || ''} onChange={e => setPassengerInputs(arr => { const cp = [...arr]; cp[idx].ho = e.target.value; return cp; })} />
                  <input type="text" className="w-full rounded-full border border-gray-200 py-3 px-4" placeholder="Tên đệm và tên *" required value={passengerInputs[idx]?.ten || ''} onChange={e => setPassengerInputs(arr => { const cp = [...arr]; cp[idx].ten = e.target.value; return cp; })} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1 ml-2">Ngày sinh *</label>
                    <input type="date" className="w-full rounded-full border border-gray-200 py-3 px-4" placeholder="dd/mm/yyyy" required value={passengerInputs[idx]?.dob || ''} onChange={e => setPassengerInputs(arr => { const cp = [...arr]; cp[idx].dob = e.target.value; return cp; })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1 ml-2">CCCD *</label>
                    <input type="text" className="w-full rounded-full border border-gray-200 py-3 px-4" placeholder="CCCD *" required value={passengerInputs[idx]?.cccd || ''} onChange={e => setPassengerInputs(arr => { const cp = [...arr]; cp[idx].cccd = e.target.value; return cp; })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1 ml-2">Ngày hết hạn CCCD *</label>
                    <input type="date" className="w-full rounded-full border border-gray-200 py-3 px-4" placeholder="dd/mm/yyyy" required value={passengerInputs[idx]?.cccd_exp || ''} onChange={e => setPassengerInputs(arr => { const cp = [...arr]; cp[idx].cccd_exp = e.target.value; return cp; })} />
                  </div>
                </div>
              </div>
            ))}
            {/* Render form cho trẻ em */}
            {Array.from({ length: searchParams.children }).map((_, idx) => (
              <div key={`child-${idx + searchParams.adults}`} className="mb-8">
                <div className="flex items-center gap-2 mb-2 font-semibold">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path stroke="currentColor" strokeWidth="1.5" d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>
                  Trẻ em - Hành khách {idx + 1}
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <select className="w-full rounded-full border border-gray-200 py-3 px-4" required value={passengerInputs[idx + searchParams.adults]?.type || ''} onChange={e => setPassengerInputs(arr => { const cp = [...arr]; cp[idx + searchParams.adults].type = e.target.value; return cp; })}>
                    <option value="">Nam/Nữ *</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                  <input type="text" className="w-full rounded-full border border-gray-200 py-3 px-4" placeholder="Họ *" required value={passengerInputs[idx + searchParams.adults]?.ho || ''} onChange={e => setPassengerInputs(arr => { const cp = [...arr]; cp[idx + searchParams.adults].ho = e.target.value; return cp; })} />
                  <input type="text" className="w-full rounded-full border border-gray-200 py-3 px-4" placeholder="Tên đệm và tên *" required value={passengerInputs[idx + searchParams.adults]?.ten || ''} onChange={e => setPassengerInputs(arr => { const cp = [...arr]; cp[idx + searchParams.adults].ten = e.target.value; return cp; })} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1 ml-2">Ngày sinh *</label>
                    <input type="date" className="w-full rounded-full border border-gray-200 py-3 px-4" placeholder="dd/mm/yyyy" required value={passengerInputs[idx + searchParams.adults]?.dob || ''} onChange={e => setPassengerInputs(arr => { const cp = [...arr]; cp[idx + searchParams.adults].dob = e.target.value; return cp; })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1 ml-2">CCCD *</label>
                    <input type="text" className="w-full rounded-full border border-gray-200 py-3 px-4" placeholder="CCCD *" required value={passengerInputs[idx + searchParams.adults]?.cccd || ''} onChange={e => setPassengerInputs(arr => { const cp = [...arr]; cp[idx + searchParams.adults].cccd = e.target.value; return cp; })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1 ml-2">Ngày hết hạn CCCD *</label>
                    <input type="date" className="w-full rounded-full border border-gray-200 py-3 px-4" placeholder="dd/mm/yyyy" required value={passengerInputs[idx + searchParams.adults]?.cccd_exp || ''} onChange={e => setPassengerInputs(arr => { const cp = [...arr]; cp[idx + searchParams.adults].cccd_exp = e.target.value; return cp; })} />
                  </div>
                </div>
              </div>
            ))}
            {showValidationError && !isFormValid() && (
              <div className="text-red-500 text-sm mb-4">Vui lòng điền đầy đủ thông tin cho tất cả hành khách.</div>
            )}
            <div className="font-bold text-lg mb-2">Thông tin liên hệ</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <select className="w-full rounded-full border border-gray-200 py-3 px-4" required>
                <option value="">Danh xưng *</option>
                <option value="mr">Ông</option>
                <option value="mrs">Bà</option>
              </select>
              <input type="text" className="w-full rounded-full border border-gray-200 py-3 px-4" placeholder="Họ *" required />
              <input type="text" className="w-full rounded-full border border-gray-200 py-3 px-4" placeholder="Tên đệm và tên *" required />
              <input type="tel" className="w-full rounded-full border border-gray-200 py-3 px-4" placeholder="Điện thoại *" required />
              <input type="email" className="w-full rounded-full border border-gray-200 py-3 px-4" placeholder="Email *" required />
            </div>
            <button type="button" className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 mb-6" onClick={() => alert('Tính năng xác thực Gmail đang phát triển!')}>
              <img src="/assets/gmail.svg" alt="Gmail" className="h-5 w-5" />
              Xác thực bằng gmail
            </button>
            <div className="flex justify-between mt-6">
              <button type="button" onClick={()=>setSelectedFlight(null)} className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold">
                ← Quay lại
              </button>
              <button 
                type="button" 
                className="px-8 py-3 rounded-full bg-[#7ee3e0] text-gray-800 font-bold text-lg hover:bg-[#5fd3d0] transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFormValid()}
                onClick={() => {
                  if (!isFormValid()) setShowValidationError(true);
                  else router.push('/flights/booking');
                }}
              >
                Tiếp →
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
} 