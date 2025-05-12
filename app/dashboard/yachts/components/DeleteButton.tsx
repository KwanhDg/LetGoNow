'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';

interface DeleteButtonProps {
  yachtId: number;
}

export default function DeleteButton({ yachtId }: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa du thuyền này?')) {
      const { error } = await supabase
        .from('yachts')
        .delete()
        .eq('id', yachtId);

      if (error) {
        alert('Có lỗi xảy ra khi xóa du thuyền');
        return;
      }

      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-900"
    >
      Xóa
    </button>
  );
} 