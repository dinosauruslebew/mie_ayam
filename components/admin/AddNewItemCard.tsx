import { IoAdd } from 'react-icons/io5';

interface AddNewItemCardProps {
  onClick: () => void;
  category: 'Makanan' | 'Minuman';
}

export default function AddNewItemCard({ onClick, category }: AddNewItemCardProps) {
  return (
    <div
      onClick={onClick}
      className="group flex flex-col items-center justify-center h-full min-h-[320px] rounded-2xl border-2 border-dashed border-stone-300 hover:border-orange-400 bg-stone-50 hover:bg-orange-50/50 cursor-pointer transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-400 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-300 mb-4 group-hover:shadow-md">
        <IoAdd size={32} />
      </div>
      <span className="font-bold text-stone-500 group-hover:text-orange-600 transition-colors">
        Tambah {category}
      </span>
    </div>
  );
}