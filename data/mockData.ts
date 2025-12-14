// /data/mockData.ts

export interface MenuItem {
  id: number;
  nama: string;
  harga: number;
  gambar_url: string;
  kategori: 'makanan' | 'minuman';
}

// Data Dummy, ganti 'gambar_url' dengan path yang sesuai di public/images Anda.
export const MOCK_MENU: MenuItem[] = []