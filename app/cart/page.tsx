import { supabase } from '../../lib/supabase';

// Định nghĩa kiểu dữ liệu cho đặt chỗ
interface Booking {
  id: number;
  user_id: string;
  service_type: string;
  service_id: number;
  booking_date: string;
  created_at: string;
}

// Định nghĩa kiểu dữ liệu cho các dịch vụ (Yacht, Hotel, Flight)
interface Service {
  id: number;
  name: string;
  price: number;
  location?: string;
  departure?: string;
  destination?: string;
}

// Hàm đăng nhập
async function handleLogin() {
  "use server";
  const { error } = await supabase.auth.signInWithPassword({
    email: 'customer1@example.com',
    password: 'password123',
  });
  if (error) throw new Error(error.message);
}

// Hàm xóa đặt chỗ
async function deleteBooking(formData: FormData) {
  "use server";
  const bookingId = formData.get('bookingId') as string;
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', parseInt(bookingId));
  if (error) throw new Error(error.message);
}

export default async function Cart() {
  let bookings: Booking[] = [];
  let services: { [key: string]: Service } = {};
  let errorMessage: string | null = null;

  // Lấy thông tin người dùng
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    errorMessage = 'Please login to view your cart.';
  } else {
    // Lấy danh sách đặt chỗ từ Supabase
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userData.user.id);

    if (bookingError) {
      errorMessage = 'Failed to load cart. Please try again.';
      console.error('Error fetching bookings:', bookingError);
    } else {
      bookings = bookingData || [];

      // Lấy thông tin chi tiết dịch vụ từ Strapi
      for (const booking of bookings) {
        let service: Service | null = null;
        try {
          const res = await fetch(
            `http://localhost:1337/api/${booking.service_type}s/${booking.service_id}?populate=*`,
            { cache: 'no-store' }
          );
          if (!res.ok) throw new Error(`Failed to fetch ${booking.service_type}`);
          const data = await res.json();
          service = {
            id: data.data.id,
            name: data.data.name,
            price: data.data.price,
            location: data.data.location,
            departure: data.data.departure,
            destination: data.data.destination,
          };
          services[`${booking.service_type}-${booking.service_id}`] = service;
        } catch (error) {
          console.error(`Error fetching ${booking.service_type}:`, error);
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">LetGoNow - Cart</h1>
        <form action={handleLogin}>
          <button type="submit" className="bg-yellow-400 text-blue-800 px-4 py-2 rounded hover:bg-yellow-500">
            Login
          </button>
        </form>
      </header>
      <section className="container mx-auto py-12 px-4">
        <h3 className="text-3xl font-semibold text-center text-blue-800 mb-8">Your Cart</h3>
        {errorMessage ? (
          <p className="text-red-500 text-center">{errorMessage}</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const serviceKey = `${booking.service_type}-${booking.service_id}`;
              const service = services[serviceKey];
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-xl font-semibold text-blue-700">
                      {service?.name || 'Unknown Service'}
                    </h4>
                    <p className="text-gray-500">
                      Type: {booking.service_type.charAt(0).toUpperCase() + booking.service_type.slice(1)}
                    </p>
                    {booking.service_type === 'yacht' || booking.service_type === 'hotel' ? (
                      <p className="text-gray-600">Location: {service?.location || 'N/A'}</p>
                    ) : (
                      <p className="text-gray-600">
                        From: {service?.departure || 'N/A'} to {service?.destination || 'N/A'}
                      </p>
                    )}
                    <p className="text-green-600 font-bold">
                      ${service?.price || 'N/A'}/{booking.service_type === 'yacht' ? 'day' : booking.service_type === 'hotel' ? 'night' : 'ticket'}
                    </p>
                  </div>
                  <form action={deleteBooking}>
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                      Remove
                    </button>
                  </form>
                </div>
              );
            })}
            <a href="/checkout" className="block text-center mt-6">
              <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
                Proceed to Checkout
              </button>
            </a>
          </div>
        )}
      </section>
    </div>
  );
}