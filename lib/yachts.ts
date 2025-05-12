import { supabase } from './supabase';

export interface Image {
  id: number;
  url: string;
}

export interface Yacht {
  id: number;
  name: string;
  description: string;
  price: number;
  images: Image[];
}

export async function getYachts() {
  try {
    const { data, error } = await supabase
      .from('yachts')
      .select('*');

    if (error) {
      console.error('Error fetching yachts:', error);
      return { data: [] };
    }

    return {
      data: data.map(yacht => ({
        ...yacht,
        images: yacht.images || []
      }))
    };
  } catch (error) {
    console.error('Unexpected error fetching yachts:', error);
    return { data: [] };
  }
}

export async function getYachtById(id: number) {
  try {
    const { data, error } = await supabase
      .from('yachts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching yacht:', error);
      return { data: null };
    }

    return {
      data: {
        ...data,
        images: data.images || []
      }
    };
  } catch (error) {
    console.error('Unexpected error fetching yacht:', error);
    return { data: null };
  }
} 