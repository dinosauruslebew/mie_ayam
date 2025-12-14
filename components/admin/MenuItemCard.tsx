import Image from 'next/image';
import { MdEdit, MdDelete } from 'react-icons/md';
import { MenuItem } from '@/data/data';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number | string) => void;
}

const formatRupiah = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-100 hover:border-orange-100 relative items-stretch flex flex-col h-full transform hover:-translate-y-1">
      {/* Gambar Full Width */}
      <div className="relative w-full h-48 overflow-hidden bg-stone-100">
        <Image
          src={item.gambar_url || "/images/placeholder.jpg"}
          alt={item.nama}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay Action Buttons (tampil saat hover) */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onEdit(item)}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-blue-600 shadow-sm hover:bg-blue-50 transition"
            aria-label="Edit"
          >
            <MdEdit size={18} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-500 shadow-sm hover:bg-red-50 transition"
            aria-label="Delete"
          >
            <MdDelete size={18} />
          </button>
        </div>
      </div>

      {/* Konten */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2 leading-snug">{item.nama}</h3>
          {/* Bisa tambahkan deskripsi singkat di sini jika ada */}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-extrabold text-amber-600">{formatRupiah(item.harga)}</p>
          {/* Badge Kategori */}
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider
                ${item.kategori === 'makanan' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
            {item.kategori}
          </span>
        </div>
      </div>
    </div>
  );
}
