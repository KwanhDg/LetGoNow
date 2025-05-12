import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

async function getYachts(searchQuery?: string, priceRange?: string) {
  let query = supabase
    .from('yachts')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply search filters
  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  if (priceRange && priceRange !== 'Tất cả mức giá') {
    const [min, max] = priceRange.split('-').map(Number);
    if (min) query = query.gte('price', min * 1000000);
    if (max) query = query.lte('price', max * 1000000);
  }

  const { data: yachts, error } = await query;

  if (error) {
    console.error('Error fetching yachts:', error);
    return [];
  }

  return yachts;
}

export default async function YachtsPage({
  searchParams,
}: {
  searchParams: { q?: string; price?: string };
}) {
  const yachts = await getYachts(searchParams.q, searchParams.price);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="pt-24">
        {/* Hero Section */}
        <div className="relative h-[400px]">
          <img
            src="/assets/images/background2.png"
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Khám phá du thuyền Hạ Long
              </h1>
              <p className="text-lg md:text-xl">
                Hơn 100 tour du thuyền hàng sang giá tốt đang chờ bạn
              </p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <form className="flex flex-col md:flex-row items-center gap-4">
              <input
                type="text"
                name="q"
                placeholder="Nhập tên du thuyền"
                defaultValue={searchParams.q}
                className="px-5 py-4 border border-gray-300 rounded-lg w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <select
                name="price"
                defaultValue={searchParams.price || 'Tất cả mức giá'}
                className="px-5 py-4 border border-gray-300 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option>Tất cả mức giá</option>
                <option>Dưới 1 triệu</option>
                <option>1-3 triệu</option>
                <option>Trên 3 triệu</option>
              </select>
              <button
                type="submit"
                className="bg-teal-500 text-white font-bold px-6 py-4 rounded-lg hover:bg-teal-600 transition w-full md:w-auto"
              >
                Tìm kiếm
              </button>
            </form>
          </div>

          {/* Search Results Summary */}
          {(searchParams.q || searchParams.price) && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Kết quả tìm kiếm {searchParams.q && `cho "${searchParams.q}"`} {searchParams.price && `với giá ${searchParams.price}`}
              </h2>
              <p className="text-gray-600">{yachts.length} du thuyền được tìm thấy</p>
            </div>
          )}

          <div className="flex gap-8">
            {/* Filter Sidebar */}
            <div className="hidden lg:block w-1/4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">Lọc kết quả</h3>
                
                <div className="space-y-6">
                  {/* Rating Filter */}
                  <div>
                    <h4 className="font-medium mb-2">Đánh giá</h4>
                    <div className="space-y-2">
                      {[5,4,3,2,1].map((rating) => (
                        <label key={rating} className="flex items-center gap-2">
                          <input type="checkbox" className="rounded text-teal-500 focus:ring-teal-500" />
                          <div className="flex items-center">
                            {Array.from({length: rating}).map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-1 text-sm text-gray-600">({rating} sao)</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Facilities Filter */}
                  <div>
                    <h4 className="font-medium mb-2">Tiện ích</h4>
                    <div className="space-y-2">
                      {['Có bể sục', 'Bao gồm tất cả các bữa ăn', 'Quầy bar', 'Lễ tân 24 giờ', 'Nhà hàng'].map((facility) => (
                        <label key={facility} className="flex items-center gap-2">
                          <input type="checkbox" className="rounded text-teal-500 focus:ring-teal-500" />
                          <span className="text-sm text-gray-600">{facility}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Ship Type Filter */}
                  <div>
                    <h4 className="font-medium mb-2">Loại tàu</h4>
                    <div className="space-y-2">
                      {['Tàu vỏ Kim loại', 'Tàu vỏ Gỗ'].map((type) => (
                        <label key={type} className="flex items-center gap-2">
                          <input type="checkbox" className="rounded text-teal-500 focus:ring-teal-500" />
                          <span className="text-sm text-gray-600">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Yachts List */}
            <div className="flex-1">
              <div className="space-y-6">
                {yachts.map((yacht) => (
                  <div
                    key={yacht.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex"
                  >
                    <div className="w-1/3">
                      <img
                        src={yacht.images[0]?.url}
                        alt={yacht.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center text-yellow-400">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="ml-1">{yacht.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">({yacht.review_count} đánh giá)</span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{yacht.location}</span>
                          </div>
                          <h3 className="text-xl font-semibold">{yacht.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Hạ thủy {yacht.launch_year} - {yacht.ship_type} - {yacht.rooms?.length || 0} phòng
                          </p>
                        </div>
                        <Link
                          href={`/yachts/${yacht.id}`}
                          className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition"
                        >
                          Đặt ngay
                        </Link>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {yacht.facilities?.map((facility: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                            {facility}
                          </span>
                        ))}
                        {yacht.facilities?.length > 5 && (
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                            +{yacht.facilities.length - 5}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="text-2xl font-bold text-teal-600">
                          {yacht.price.toLocaleString()}đ
                          <span className="text-sm text-gray-500 font-normal"> / khách</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}