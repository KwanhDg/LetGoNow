'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Yacht, Room, Image as ImageType } from './types';
import { useRouter } from 'next/navigation';

export default function YachtDetail({ yacht }: { yacht: Yacht }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'room' | 'yacht'>('room');
  const [roomQuantities, setRoomQuantities] = useState<{ [key: number]: number }>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [modalAdults, setModalAdults] = useState(1);
  const [modalChildren, setModalChildren] = useState(0);
  const [showQuantityDropdown, setShowQuantityDropdown] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalNote, setModalNote] = useState('');
  const [modalDate, setModalDate] = useState('');
  const [modalError, setModalError] = useState('');

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleQuantityChange = (roomId: number, change: number) => {
    setRoomQuantities(prev => {
      const currentQuantity = prev[roomId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      const newQuantities = { ...prev, [roomId]: newQuantity };
      
      // Calculate total price
      const newTotal = yacht.rooms.reduce((total, room) => {
        return total + (room.price * (newQuantities[room.id] || 0));
      }, 0);
      setTotalPrice(newTotal);
      
      return newQuantities;
    });
  };

  const handleBooking = (type: 'room' | 'yacht') => {
    if (type === 'yacht') {
      // Calculate total price for entire yacht
      const yachtTotal = yacht.rooms.reduce((total, room) => total + room.price, 0);
      setTotalPrice(yachtTotal);
    }
    setBookingType(type);
    setIsModalOpen(true);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-24 bg-white flex items-center justify-between shadow-md px-6">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <Image src="/assets/icon/logo.png" alt="LetGoNow" width={56} height={56} className="h-14 w-auto" />
          </Link>
          <nav className="flex space-x-8">
            <Link
              href="/yachts"
              className="text-black font-roboto text-xl font-bold hover:text-teal-500 hover:border-b-4 hover:border-teal-500 transition py-2"
            >
              Tìm du thuyền
            </Link>
            <Link
              href="/flights"
              className="text-black font-roboto text-xl font-bold hover:text-teal-500 hover:border-b-4 hover:border-teal-500 transition py-2"
            >
              Đặt vé máy bay
            </Link>
          </nav>
        </div>
        <Link href="/login">
          <button 
            type="button" 
            className="flex items-center justify-center w-10 h-10 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>
        </Link>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-24">
        {/* Hero Section with Gallery */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[70vh]">
            {(yacht.images || []).slice(0, 5).map((image: ImageType, index: number) => (
              <div
                key={index}
                className={`relative h-[300px] ${
                  index === 0 ? 'md:col-span-2 md:row-span-2 md:h-[600px]' : 'h-[300px]'
                } overflow-hidden rounded-none md:first:rounded-bl-lg last:rounded-tr-lg`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || yacht.name}
                  fill
                  className="object-cover hover:scale-105 transition duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>

          {/* Floating Info Card */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{yacht.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{yacht.rating} ({yacht.reviewCount} đánh giá)</span>
                </div>
                <span>•</span>
                <span>{yacht.location}</span>
                <span>•</span>
                <span>{yacht.duration}</span>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Quick Info */}
              <section className="bg-white rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-teal-100 rounded-full">
                      <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">Thời gian</h3>
                    <p className="mt-1 text-sm text-gray-500">{yacht.duration}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-teal-100 rounded-full">
                      <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">Địa điểm</h3>
                    <p className="mt-1 text-sm text-gray-500">{yacht.location}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-teal-100 rounded-full">
                      <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">Khởi hành</h3>
                    <p className="mt-1 text-sm text-gray-500">{yacht.departureTime}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-teal-100 rounded-full">
                      <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">Số chỗ</h3>
                    <p className="mt-1 text-sm text-gray-500">{(yacht.rooms || []).reduce((acc: number, room: Room) => acc + room.max_guests, 0)} khách</p>
                  </div>
                </div>
              </section>

              {/* Overview */}
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Tổng quan</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{yacht.description}</p>
              </section>

              {/* Highlights */}
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Điểm nổi bật</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(yacht.highlights || []).map((highlight: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-gray-600 flex-1">{highlight}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Itinerary */}
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Lịch trình</h2>
                <div className="space-y-8">
                  {(yacht.itinerary || []).map((item: { time: string; activity: string }, index: number) => (
                    <div key={index} className="relative pl-8 pb-8 last:pb-0">
                      <div className="absolute left-0 top-0 h-full w-px bg-teal-200">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-teal-500 bg-white"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="font-medium text-teal-600">{item.time}</div>
                        <p className="text-gray-600">{item.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Included/Not Included */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4 text-green-600">Đã bao gồm</h2>
                  <ul className="space-y-3">
                    {(yacht.included || []).map((item: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4 text-red-600">Không bao gồm</h2>
                  <ul className="space-y-3">
                    {(yacht.notIncluded || []).map((item: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-red-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Reviews */}
              <section className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Đánh giá từ khách hàng</h2>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold text-teal-600 mr-2">{yacht.rating}</div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(yacht.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-500">({yacht.reviewCount} đánh giá)</span>
                  </div>
                </div>
                <div className="space-y-6">
                  {(yacht.reviews || []).map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-teal-600 font-medium">{review.user.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium">{review.user}</div>
                            <div className="text-gray-500 text-sm">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold mb-6">Các loại phòng & giá</h2>
                  
                  {/* Room List */}
                  <div className="space-y-6 mb-6">
                    {(yacht.rooms || []).map((room: Room, index: number) => (
                      <div key={index} className="flex items-center justify-between py-6 border-b border-gray-200 last:border-b-0">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{room.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="whitespace-nowrap">{room.area}m²</span>
                            <span>•</span>
                            <span>Tối đa {room.max_guests} khách</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">{room.price.toLocaleString()}đ</div>
                            <div className="text-sm text-gray-600">/KHÁCH</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleQuantityChange(room.id, -1)}
                              className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-teal-500 hover:text-teal-500 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="w-8 text-center text-lg font-medium">{roomQuantities[room.id] || 0}</span>
                            <button 
                              onClick={() => handleQuantityChange(room.id, 1)}
                              className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-teal-500 hover:text-teal-500 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total and Booking */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-t border-gray-200">
                      <span className="text-xl font-bold">Tổng tiền</span>
                      <span className="text-2xl font-bold text-teal-600">{totalPrice.toLocaleString()}đ</span>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => handleBooking('yacht')}
                        className="flex-1 bg-white text-teal-600 border-2 border-teal-600 py-4 px-6 rounded-xl text-lg font-semibold hover:bg-teal-50 transition duration-150 ease-in-out"
                      >
                        Thuê trọn tàu
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBooking('room')}
                        className="flex-1 bg-teal-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-teal-700 transition duration-150 ease-in-out"
                      >
                        Đặt ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">Đặt du thuyền</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày nhận phòng
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    value={modalDate}
                    onChange={e => setModalDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="w-full rounded-full border-2 border-teal-200 px-4 py-3 text-left font-semibold text-gray-700 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-teal-300"
                      onClick={() => setShowQuantityDropdown(v => !v)}
                    >
                      {modalAdults} Người lớn - {modalChildren} Trẻ em
                      <svg
                        className="w-5 h-5 ml-2 text-teal-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {showQuantityDropdown && (
                      <div className="absolute left-0 w-full bg-white rounded-2xl shadow-xl border border-teal-100 mt-2 z-10 p-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-medium">Người lớn</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="w-8 h-8 rounded-full border flex items-center justify-center text-xl"
                              onClick={() => setModalAdults(a => Math.max(1, a - 1))}
                            >
                              -
                            </button>
                            <span className="w-6 text-center">{modalAdults}</span>
                            <button
                              type="button"
                              className="w-8 h-8 rounded-full border flex items-center justify-center text-xl"
                              onClick={() => setModalAdults(a => a + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-medium">Trẻ em</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="w-8 h-8 rounded-full border flex items-center justify-center text-xl"
                              onClick={() => setModalChildren(c => Math.max(0, c - 1))}
                            >
                              -
                            </button>
                            <span className="w-6 text-center">{modalChildren}</span>
                            <button
                              type="button"
                              className="w-8 h-8 rounded-full border flex items-center justify-center text-xl"
                              onClick={() => setModalChildren(c => c + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="w-full mt-2 py-2 rounded-full bg-[#7ee3e0] text-gray-800 font-semibold text-base hover:bg-[#5fd3d0] transition"
                          onClick={() => setShowQuantityDropdown(false)}
                        >
                          Áp dụng
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập họ và tên"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    value={modalName}
                    onChange={e => setModalName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    value={modalPhone}
                    onChange={e => setModalPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Nhập email"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    value={modalEmail}
                    onChange={e => setModalEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yêu cầu của bạn
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Nhập yêu cầu của bạn"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    value={modalNote}
                    onChange={e => setModalNote(e.target.value)}
                  />
                </div>
                {modalError && <div className="text-red-500 text-sm font-medium mt-2">{modalError}</div>}
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div>
                <div className="text-sm text-gray-500">Tổng tiền</div>
                <div className="text-2xl font-bold text-gray-900">{totalPrice.toLocaleString()}đ</div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Đăng ký tư vấn
                </button>
                <button
                  type="button"
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  onClick={() => {
                    if (!modalName || !modalPhone || !modalEmail || modalAdults < 1) {
                      setModalError('Vui lòng nhập đầy đủ thông tin và phải có ít nhất 1 người lớn!');
                      return;
                    }
                    setModalError('');
                    setIsModalOpen(false);
                    router.push('/yachts/payment');
                  }}
                >
                  Đặt ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 