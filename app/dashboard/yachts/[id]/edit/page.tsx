import { supabase } from '../../../../../lib/supabase';
import { notFound } from 'next/navigation';
import YachtForm from '../../components/YachtForm';

async function getYacht(id: string) {
  const { data, error } = await supabase
    .from('yachts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  return data;
}

export default async function EditYachtPage({ params }: { params: { id: string } }) {
  const yacht = await getYacht(params.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Chỉnh sửa du thuyền</h1>
      <YachtForm yacht={yacht} />
    </div>
  );
} 