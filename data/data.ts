// /data/data.ts

export interface MenuItem {
  id: number | string;
  nama: string;
  harga: number;
  gambar_url: string;
  kategori: 'makanan' | 'minuman';
  deskripsi?: string;
  rating?: number;
}

export const initialMenuItems: MenuItem[] = [];

export const STORAGE_KEY = 'mieAyamMenuData';