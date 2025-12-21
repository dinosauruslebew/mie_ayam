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
    <div className="group bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full border border-gray-100 overflow-hidden hover:-translate-y-1 relative">

      {/* Gambar */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
        <Image
          src={item.gambar_url || "/images/placeholder.jpg"}
          alt={item.nama}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Actions (Simple, top right) */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(item)}
            className="w-8 h-8 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-full text-gray-700 hover:text-blue-600 shadow-sm transition-all hover:scale-105"
            title="Edit Menu"
          >
            <MdEdit size={14} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="w-8 h-8 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-full text-gray-700 hover:text-red-500 shadow-sm transition-all hover:scale-105"
            title="Hapus Menu"
          >
            <MdDelete size={14} />
          </button>
        </div>
      </div>

      {/* Konten */}
      <div className="p-4 flex flex-col flex-1">

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">
          {item.nama}
        </h3>

        {/* Description */}
        {item.deskripsi ? (
          <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed flex-1">
            {item.deskripsi}
          </p>
        ) : (
          <div className="flex-1"></div>
        )}

        {/* Separator, Price & Rating (can add rating later if needed, stick to price for now) */}
        <div className="pt-3 border-t border-dashed border-gray-100 flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Harga</span>
            <p className="text-base font-extrabold text-gray-900">{formatRupiah(item.harga)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
