import { GiNoodles, GiSodaCan } from 'react-icons/gi';
import { IoFastFoodOutline, IoCafeOutline, IoLogOutOutline } from 'react-icons/io5';
import NextImage from 'next/image';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  activeMenu: 'makanan' | 'minuman';
  setActiveMenu: (menu: 'makanan' | 'minuman') => void;
}

export default function Sidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/admin/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    { name: 'Makanan', key: 'makanan', icon: IoFastFoodOutline },
    { name: 'Minuman', key: 'minuman', icon: IoCafeOutline },
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-100 flex-shrink-0 flex flex-col justify-between h-screen sticky top-0 shadow-sm">
      <div>
        <div className="p-8 pb-4 flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-md">
            <NextImage
              src="/images/logo_pak_min.png"
              alt="Logo Pak Min"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-800 tracking-tight">Mie Ayam <br /><span className="text-orange-600">Pak Min</span></h1>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveMenu(item.key as 'makanan' | 'minuman')}
                className={`flex items-center w-full px-5 py-3.5 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? 'bg-orange-50 text-orange-600 shadow-sm border-r-4 border-orange-500'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
                  }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-white/80' : 'bg-transparent'}`}>
                  <item.icon size={22} className={isActive ? 'text-orange-600' : 'text-stone-400 group-hover:text-stone-600'} />
                </div>
                <span className="font-semibold text-base tracking-wide">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-stone-50">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-5 py-3 rounded-xl text-stone-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <div className="p-2 rounded-lg bg-transparent hover:bg-red-100/50 transition-colors mr-1">
            <IoLogOutOutline size={22} />
          </div>
          <span className="font-semibold text-base tracking-wide">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
