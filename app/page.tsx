import { getYachts, type Yacht } from '../lib/yachts';
import { supabase } from '../lib/supabase';
import { redirect } from 'next/navigation';

interface StrapiResponse {
  data: Yacht[];
}

async function handleLogin() {
  "use server";
  const { error } = await supabase.auth.signInWithPassword({
    email: 'customer1@example.com',
    password: 'password123',
  });
  if (error) throw new Error(error.message);
}

async function createBooking(formData: FormData) {
  "use server";
  const serviceType = formData.get('serviceType') as string;
  const serviceId = formData.get('serviceId') as string;
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) throw new Error('Please login to book a yacht');
  const { error } = await supabase
    .from('bookings')
    .insert({
      user_id: userData.user.id,
      service_type: serviceType,
      service_id: parseInt(serviceId),
      booking_date: new Date().toISOString(),
    });
  if (error) throw new Error(error.message);
}

async function handleSearch(formData: FormData) {
  "use server";
  const searchQuery = formData.get('searchQuery') as string;
  const location = formData.get('location') as string;
  const priceRange = formData.get('priceRange') as string;

  // Build search params
  const searchParams = new URLSearchParams();
  if (searchQuery) searchParams.set('q', searchQuery);
  if (location && location !== 'Tất cả địa điểm') searchParams.set('location', location);
  if (priceRange && priceRange !== 'Tất cả mức giá') searchParams.set('price', priceRange);

  // Redirect to search results page
  redirect(`/yachts/search?${searchParams.toString()}`);
}

export default async function Home() {
  const response = await getYachts();
  const yachts = response.data || [];

  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* Hero */}
      <section className="relative h-[1000px] overflow-hidden">
        <img
          src="/assets/images/background.png"
          alt="Hero Background"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="relative z-10 h-full flex items-end justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-5xl w-full mb-[20px]">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Bạn lựa chọn du thuyền Hạ Long nào?
            </h1>
            <p className="text-gray-500 text-sm mb-6">Hơn 100 tour du thuyền hàng sang giá tốt đang chờ bạn</p>
            <form action={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
              <input
                type="text"
                name="searchQuery"
                placeholder="Nhập tên du thuyền"
                className="px-5 py-4 border border-gray-300 rounded-lg w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <select
                name="priceRange"
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
        </div>
      </section>

      {/* Featured yachts */}
      <section className="max-w-7xl mx-auto py-32 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
          Du thuyền mới và phổ biến nhất
        </h2>
        {yachts.length === 0 ? (
          <div className="text-center text-gray-500">
            Không có du thuyền nào được tìm thấy
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {yachts.map((yacht) => (
              <div
                key={yacht.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <img
                  src={yacht.images[0]?.url}
                  alt={yacht.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-1">{yacht.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{yacht.description}</p>
                  <p className="text-teal-600 font-bold mt-3">
                    {yacht.price.toLocaleString()}đ / khách
                  </p>
                  <a 
                    href={`/yachts/${yacht.id}`}
                    className="block w-full bg-teal-500 text-white text-center py-2 rounded hover:bg-teal-600 mt-3"
                  >
                    Đặt ngay
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="relative py-16">
        <img
          src="/assets/images/background1.png"
          alt="Testimonials Background"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
            Đánh giá từ những người đã trải nghiệm
          </h2>
          <p className="text-gray-600 text-lg italic mb-4">
            "Du thuyền 5 sao với sự trải nghiệm tuyệt vời. Tour câu cá cùng với đội ngũ hướng dẫn viên nhiệt tình, ăn uống ngon, uống rượu vang miễn phí. Đồ ăn khá đa dạng, nhiều lựa chọn để thử. Rất đáng để trải nghiệm!"
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Khách hàng chia sẻ về trải nghiệm tuyệt vời trên du thuyền du lịch vòng vịnh.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100">
              Chí Thu Hà
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100">
              Anh Khánh
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100">
              Chị Linh - Anh Định
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100">
              Bà Minh Hoang
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100">
              Cô Thanh Hằng và Bàn
            </button>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Các điểm đến của LetGoNow
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Khám phá vẻ đẹp tuyệt vời của Du thuyền Hạ Long: Hành trình dẫn bạn qua những địa điểm du lịch vòng vịnh.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-24 max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-md min-h-[320px]">
            <img
              src="/assets/images/vinhHaLong.jpg"
              alt="Vịnh Hạ Long"
              className="w-full h-64 object-cover"
            />
            <p className="p-4 text-lg font-medium">Vịnh Hạ Long</p>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-md min-h-[320px]">
            <img
              src="/assets/images/vinhLanHa.jpg"
              alt="Vịnh Lan Hạ"
              className="w-full h-64 object-cover"
            />
            <p className="p-4 text-lg font-medium">Vịnh Lan Hạ</p>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-md min-h-[320px]">
            <img
              src="/assets/images/daoCatBa.jpg"
              alt="Đảo Cát Bà"
              className="w-full h-64 object-cover"
            />
            <p className="p-4 text-lg font-medium">Đảo Cát Bà</p>
          </div>
        </div>
      </section>
    </div>
  );
}