'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const mockBooking = {
  bookingCode: 'YACHT' + Math.random().toString(36).substring(2, 8).toUpperCase(),
  yacht: 'Paradise Luxury',
  date: '2024-07-20',
  guests: 4,
  room: 'Suite',
  total: 25000000,
  contact: {
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    email: 'nguyenvana@email.com',
  }
};

function formatPrice(price: number) {
  return price.toLocaleString('vi-VN');
}

export default function YachtConfirmationPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push('/yachts');
    }
  }, [countdown, router]);

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* Progress bar */}
      <div className="flex items-center justify-center gap-12 mb-8">
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full border-4 border-teal-400 bg-white flex items-center justify-center">
            <div className="w-4 h-4 bg-teal-400 rounded-full"></div>
          </div>
          <div className="font-bold mt-2 text-teal-600">Chọn du thuyền</div>
          <div className="text-xs text-gray-500">Hoàn thành</div>
        </div>
        <div className="h-1 w-16 bg-teal-400 rounded-full"></div>
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full border-4 border-teal-400 bg-white flex items-center justify-center">
            <div className="w-4 h-4 bg-teal-400 rounded-full"></div>
          </div>
          <div className="font-bold mt-2 text-teal-600">Nhập thông tin</div>
          <div className="text-xs text-gray-500">Hoàn thành</div>
        </div>
        <div className="h-1 w-16 bg-teal-400 rounded-full"></div>
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full border-4 border-teal-400 bg-white flex items-center justify-center">
            <div className="w-4 h-4 bg-teal-400 rounded-full"></div>
          </div>
          <div className="font-bold mt-2 text-teal-600">Thanh toán</div>
          <div className="text-xs text-gray-500">Hoàn thành</div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
            <p className="text-gray-600">Cảm ơn bạn đã đặt du thuyền với LetGoNow</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="text-lg font-semibold">Mã đặt chỗ</div>
              <div className="text-2xl font-bold text-teal-600">{mockBooking.bookingCode}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="mb-2"><span className="text-gray-500">Du thuyền:</span> <span className="font-semibold">{mockBooking.yacht}</span></div>
              <div className="mb-2"><span className="text-gray-500">Ngày đi:</span> <span className="font-semibold">{new Date(mockBooking.date).toLocaleDateString('vi-VN')}</span></div>
              <div className="mb-2"><span className="text-gray-500">Số khách:</span> <span className="font-semibold">{mockBooking.guests}</span></div>
              <div className="mb-2"><span className="text-gray-500">Loại phòng:</span> <span className="font-semibold">{mockBooking.room}</span></div>
              <div className="mb-2"><span className="text-gray-500">Tổng tiền:</span> <span className="font-semibold text-teal-700">{formatPrice(mockBooking.total)} VND</span></div>
              <div className="mb-2"><span className="text-gray-500">Liên hệ:</span> <span className="font-semibold">{mockBooking.contact.name} - {mockBooking.contact.phone} - {mockBooking.contact.email}</span></div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-semibold text-blue-800 mb-1">Thông tin quan trọng</div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Vé điện tử đã được gửi đến email của bạn</li>
                    <li>• Vui lòng kiểm tra email để xem chi tiết vé và mã đặt chỗ</li>
                    <li>• Vui lòng đến bến du thuyền sớm ít nhất 1 giờ trước giờ khởi hành</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-center">
              <button type="button" onClick={() => router.push('/yachts')} className="px-8 py-3 rounded-full bg-[#7ee3e0] text-gray-800 font-bold text-lg hover:bg-[#5fd3d0] transition">
                Quay lại trang chủ
              </button>
              <div className="text-sm text-gray-500 mt-4">
                Tự động chuyển hướng sau {countdown} giây...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 