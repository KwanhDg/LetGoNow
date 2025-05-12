import { supabase } from '../../../lib/supabase';
import { notFound } from 'next/navigation';
import YachtDetail from './YachtDetail';
import { Metadata } from 'next';

async function getYachtData(id: string) {
  const { data: yacht, error } = await supabase
    .from('yachts')
    .select(`
      *,
      rooms (
        id,
        name,
        area,
        max_guests,
        price,
        images
      )
    `)
    .eq('id', id)
    .single();

  if (error || !yacht) {
    notFound();
  }

  return yacht;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const yacht = await getYachtData(params.id);
  return {
    title: `${yacht.name} - LetGoNow`,
    description: yacht.description,
  };
}

export default async function YachtDetailPage({ params }: { params: { id: string } }) {
  const yacht = await getYachtData(params.id);
  return <YachtDetail yacht={yacht} />;
}