import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import DeleteButton from './components/DeleteButton';

async function getYachts() {
  const { data, error } = await supabase
    .from('yachts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching yachts:', error);
    return [];
  }

  return data || [];
}

export default async function YachtsPage() {
  const yachts = await getYachts();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Quản lý du thuyền</h1>
        <Link
          href="/dashboard/yachts/new"
          className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
        >
          Thêm du thuyền mới
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {yachts.map((yacht) => (
              <tr key={yacht.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={yacht.images?.[0]?.url || '/assets/images/placeholder.png'}
                        alt={yacht.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{yacht.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {yacht.price?.toLocaleString()}đ
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Hoạt động
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/dashboard/yachts/${yacht.id}/edit`}
                    className="text-teal-600 hover:text-teal-900 mr-4"
                  >
                    Sửa
                  </Link>
                  <DeleteButton yachtId={yacht.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 