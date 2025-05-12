// lib/strapi.js
export async function getYachts() {
  try {
    const res = await fetch('http://localhost:1337/api/yachts?populate=*', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch yachts');
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error('Unable to connect to Strapi server');
  }
}

export async function getHotels() {
  try {
    const res = await fetch('http://localhost:1337/api/hotels?populate=*', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch hotels');
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error('Unable to connect to Strapi server');
  }
}

export async function getFlights() {
  try {
    const res = await fetch('http://localhost:1337/api/flights?populate=*', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch flights');
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error('Unable to connect to Strapi server');
  }
}