// /components/admin/MenuFormModal.tsx (Diperbarui dengan Tailwind CSS)
'use client';

import React, { useState, useEffect } from 'react';
import { MenuItem } from '@/data/data'; // Menggunakan interface dari data/data.ts

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Handler untuk menyimpan/memperbarui data
  onSave: (item: Omit<MenuItem, 'id'> & { id?: number }) => void;
  itemToEdit?: MenuItem | null; // Data item jika sedang mode Edit
}

// Initial state, disesuaikan dengan interface MenuItem (nama, harga, kategori, gambar_url)
const initialFormState = {
  nama: '',
  harga: 0,
  kategori: 'makanan' as 'makanan' | 'minuman',
  gambar_url: '',
};

const MenuFormModal: React.FC<MenuFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
}) => {
  const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);

  // Mengisi form saat itemToEdit berubah (mode Edit)
  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        nama: itemToEdit.nama,
        harga: itemToEdit.harga,
        kategori: itemToEdit.kategori,
        gambar_url: itemToEdit.gambar_url || '',
      });
    } else {
      setFormData(initialFormState); // Reset untuk mode Create
    }
  }, [itemToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Konversi ke Number hanya jika tipe inputnya 'number'
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Panggil onSave, sertakan ID jika sedang mode edit
    onSave({ ...formData, id: itemToEdit?.id });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-amber-950 mb-6 border-b pb-2">
          {itemToEdit ? `Edit Menu: ${itemToEdit.nama}` : 'Tambah Item Baru'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {/* Input Nama */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Input Harga */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
            <input
              type="number"
              name="harga"
              value={formData.harga}
              onChange={handleChange}
              required
              min="0"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          
          {/* Input Kategori */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
            </select>
          </div>

          {/* Input URL Gambar */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
            <input
              type="text"
              name="gambar_url"
              value={formData.gambar_url}
              onChange={handleChange}
              placeholder="/images/placeholder.jpg"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
            />
            <p className="mt-1 text-xs text-gray-500">Gunakan path relatif dari folder /public</p>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition"
            >
              {itemToEdit ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuFormModal;