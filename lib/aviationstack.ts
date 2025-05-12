const API_KEY = process.env.AVIATIONSTACK_API_KEY || '';

export interface Flight {
  id: number;
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string;
    iata: string;
    scheduled: string;
  };
  arrival: {
    airport: string;
    iata: string;
    scheduled: string;
  };
  airline: {
    name: string;
    iata: string;
  };
  flight: {
    iata: string;
  };
  price: number;
}

interface AviationStackResponse {
  data: Flight[];
}

// Dữ liệu giả lập nếu không thể gọi API
const mockFlights: Flight[] = [
  {
    id: 1,
    flight_date: '2025-05-08',
    flight_status: 'scheduled',
    departure: {
      airport: 'Noi Bai International Airport',
      iata: 'HAN',
      scheduled: '2025-05-08T08:00:00+07:00',
    },
    arrival: {
      airport: 'Tan Son Nhat International Airport',
      iata: 'SGN',
      scheduled: '2025-05-08T10:00:00+07:00',
    },
    airline: {
      name: 'Vietnam Airlines',
      iata: 'VN',
    },
    flight: {
      iata: 'VN123',
    },
    price: 2500000,
  },
  {
    id: 2,
    flight_date: '2025-05-08',
    flight_status: 'scheduled',
    departure: {
      airport: 'Noi Bai International Airport',
      iata: 'HAN',
      scheduled: '2025-05-08T12:00:00+07:00',
    },
    arrival: {
      airport: 'Tan Son Nhat International Airport',
      iata: 'SGN',
      scheduled: '2025-05-08T14:00:00+07:00',
    },
    airline: {
      name: 'Vietjet Air',
      iata: 'VJ',
    },
    flight: {
      iata: 'VJ456',
    },
    price: 2000000,
  },
];

export async function getFlights(depIata: string, arrIata: string, flightDate: string, returnDate?: string): Promise<Flight[]> {
  // Kiểm tra API key
  if (!API_KEY) {
    console.error('AviationStack API key is missing. Using mock data instead.');
    return mockFlights;
  }

  const url = `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&dep_iata=${depIata}&arr_iata=${arrIata}&flight_date=${flightDate}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache 1 giờ
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
    }
    const data: AviationStackResponse = await response.json();
    let flights = data.data || [];

    // Nếu là khứ hồi, lấy thêm chuyến bay về (giả lập)
    if (returnDate) {
      const returnResponse = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&dep_iata=${arrIata}&arr_iata=${depIata}&flight_date=${returnDate}`);
      if (!returnResponse.ok) {
        throw new Error(`HTTP error on return flight! Status: ${returnResponse.status} - ${returnResponse.statusText}`);
      }
      const returnData: AviationStackResponse = await returnResponse.json();
      flights = [...flights, ...returnData.data || []];
    }

    return flights.map((flight, index) => ({
      ...flight,
      id: index + 1, // Gán id tạm thời
      price: 2000000 + Math.floor(Math.random() * 3000000), // Giả lập giá từ 2M đến 5M
    }));
  } catch (error) {
    console.error('Error fetching flights from AviationStack:', error);
    console.warn('Falling back to mock data due to API error.');
    return mockFlights;
  }
}