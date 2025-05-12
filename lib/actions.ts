'use server';
import { supabase } from './supabase';

export async function createBooking(formData: FormData) {
  const flightId = formData.get('flightId');
  const totalPrice = formData.get('totalPrice');

  const { error } = await supabase
    .from('bookings')
    .insert({
      service_type: 'flight',
      service_id: flightId,
      booking_date: new Date().toISOString(),
      total_price: totalPrice,
    });

  if (error) {
    throw new Error(error.message);
  }
}