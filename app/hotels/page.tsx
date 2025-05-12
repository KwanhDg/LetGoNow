import { getHotels } from '../../lib/strapi';
import { supabase } from '../../lib/supabase';

interface Hotel {
  id: number;
  documentId: string;
  name: string;
  description: string;
  price: number;
  location: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  images: {
    id: number;
    url: string;
  }[];
}

interface StrapiResponse {
  data: Hotel[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
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
  if (userError || !userData?.user) throw new Error('Please login to book');
  const { error } = await supabase
    .from('bookings')
    .insert({
      user_id: userData.user.id,
      service_type: serviceType,
      service_id: parseInt(serviceId),
      booking_date: new Date().toISOString(),
    });
  if (error) throw error;
}

export default async function Hotels() {
  let hotels: Hotel[] = [];
  let errorMessage: string | null = null;

  try {
    const response = await getHotels() as StrapiResponse;
    hotels = response.data || [];
    console.log('Hotels data:', hotels);
  } catch (error) {
    errorMessage = 'Failed to load hotels. Please ensure Strapi is running.';
    console.error('Error fetching hotels:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">LetGoNow</h1>
        <form action={handleLogin}>
          <button type="submit" className="bg-yellow-400 text-blue-800 px-4 py-2 rounded hover:bg-yellow-500">
            Login
          </button>
        </form>
      </header>
      <section className="container mx-auto py-12 px-4">
        <h3 className="text-3xl font-semibold text-center text-blue-800 mb-8">Featured Hotels</h3>
        {errorMessage ? (
          <p className="text-red-500 text-center">{errorMessage}</p>
        ) : hotels.length === 0 ? (
          <p className="text-gray-500 text-center">No hotels available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="h-48 bg-gray-200">
                  {hotel.images?.[0]?.url && (
                    <img
                      src={`http://localhost:1337${hotel.images[0].url}`}
                      alt={hotel.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="text-xl font-semibold text-blue-700">{hotel.name}</h4>
                  <p className="text-gray-500 mt-2 line-clamp-2">{hotel.description}</p>
                  <p className="mt-2 text-green-600 font-bold">${hotel.price}/night</p>
                  <form action={createBooking}>
                    <input type="hidden" name="serviceType" value="hotel" />
                    <input type="hidden" name="serviceId" value={hotel.id} />
                    <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                      Book Now
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}