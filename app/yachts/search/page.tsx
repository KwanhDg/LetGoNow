import { getYachts } from '../../../lib/yachts';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

interface SearchParams {
  q?: string;
  price?: string;
}

function getPriceRange(priceRange: string) {
  switch (priceRange) {
    case 'Dưới 1 triệu':
      return { min: 0, max: 1000000 };
    case '1-3 triệu':
      return { min: 1000000, max: 3000000 };
    case 'Trên 3 triệu':
      return { min: 3000000, max: Infinity };
    default:
      return { min: 0, max: Infinity };
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q: searchQuery, price } = searchParams;
  const priceRange = getPriceRange(price || '');

  // Fetch all yachts
  const { data: yachts, error } = await supabase
    .from('yachts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching yachts:', error);
    return <div>Error loading yachts</div>;
  }

  // Filter yachts based on search criteria
  const filteredYachts = yachts.filter((yacht) => {
    const matchesSearch = !searchQuery || 
      yacht.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      yacht.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice = yacht.price >= priceRange.min && yacht.price <= priceRange.max;

    return matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Kết quả tìm kiếm
            </h1>
            <p className="text-gray-600">
              {filteredYachts.length} du thuyền được tìm thấy
              {searchQuery && ` cho "${searchQuery}"`}
              {price && ` với mức giá ${price}`}
            </p>
          </div>
          <Link
            href="/"
            className="bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-200 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Quay lại
          </Link>
        </div>

        {filteredYachts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Không tìm thấy du thuyền nào phù hợp với tiêu chí tìm kiếm của bạn.
            </p>
            <Link 
              href="/"
              className="mt-4 inline-block bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition"
            >
              Quay lại trang chủ
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredYachts.map((yacht) => (
              <div
                key={yacht.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <img
                  src={yacht.images[0]?.url}
                  alt={yacht.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{yacht.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {yacht.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-teal-600 font-bold">
                      {yacht.price.toLocaleString()}đ / khách
                    </p>
                    <Link
                      href={`/yachts/${yacht.id}`}
                      className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 