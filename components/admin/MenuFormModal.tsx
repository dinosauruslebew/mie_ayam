'use client';

import React, { useState, useEffect } from 'react';
import { MenuItem } from '@/data/data';
import { IoClose, IoCloudUploadOutline, IoStar } from 'react-icons/io5';
import { uploadImage } from '@/app/actions/upload';
import Image from 'next/image';

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<MenuItem, 'id'> & { id?: number | string }) => Promise<void>;
  itemToEdit?: MenuItem | null;
  defaultCategory: 'makanan' | 'minuman';
}

const initialFormState = {
  nama: '',
  harga: 0,
  gambar_url: '',
  kategori: 'makanan' as 'makanan' | 'minuman',
  deskripsi: '',
  rating: 4.5,
};

const MenuFormModal: React.FC<MenuFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
  defaultCategory,
}) => {
  const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setFormData({
          nama: itemToEdit.nama,
          harga: itemToEdit.harga,
          gambar_url: itemToEdit.gambar_url,
          kategori: itemToEdit.kategori,
          deskripsi: itemToEdit.deskripsi || '',
          rating: itemToEdit.rating || 4.5,
        });
        setPreviewUrl(itemToEdit.gambar_url);
      } else {
        // Reset form for new item with default category
        setFormData({
          ...initialFormState,
          kategori: defaultCategory
        });
        setPreviewUrl('');
      }
      setFile(null);
    }
  }, [itemToEdit, isOpen, defaultCategory]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Modal: Submit triggered");
    setIsLoading(true);

    try {
      let finalImageUrl = formData.gambar_url;

      if (file) {
        console.log("Modal: File selected, starting upload...");
        const data = new FormData();
        data.append('file', file);
        finalImageUrl = await uploadImage(data);
        console.log("Modal: Image uploaded, URL:", finalImageUrl);
      } else {
        console.log("Modal: No new file selected, using existing URL:", finalImageUrl);
      }

      console.log("Modal: Calling onSave with data:", { ...formData, gambar_url: finalImageUrl });
      await onSave({
        ...formData,
        gambar_url: finalImageUrl,
        id: itemToEdit?.id,
      });

      console.log("Modal: Save completed, closing modal.");
      onClose();
    } catch (error) {
      console.error('Failed to save item:', error);
      alert(`Gagal menyimpan data: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all scale-100 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {itemToEdit ? `Edit ${itemToEdit.nama}` : `Tambah ${defaultCategory === 'makanan' ? 'Makanan' : 'Minuman'} Baru`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            disabled={isLoading}
          >
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">

            {/* Input Nama */}
            {/* Input Nama */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Nama Menu</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                placeholder="Contoh: Mie Ayam Spesial"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow outline-none text-stone-800 placeholder:text-stone-400"
                disabled={isLoading}
              />
            </div>

            {/* Input Harga */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Harga (Rp)</label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-stone-500 font-medium">Rp</span>
                <input
                  type="number"
                  name="harga"
                  value={formData.harga === 0 ? '' : formData.harga}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow outline-none text-stone-800 placeholder:text-stone-300 font-medium"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Input Deskripsi (New) */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Deskripsi (Opsional)</label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                rows={3}
                placeholder="Jelaskan detail menu ini..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow outline-none text-gray-900 placeholder:text-gray-400 resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Input Rating (New) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                Rating <IoStar className="text-amber-400" />
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow outline-none text-gray-900"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-400 mt-1">Skala 0 - 5 (Default: 4.5)</p>
            </div>

            {/* Input Gambar (Upload File) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gambar Menu</label>

              {/* Preview Area */}
              <div className="mt-2 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-6 hover:bg-gray-50 transition-colors relative bg-gray-50/30">
                {previewUrl ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden group">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <label
                      htmlFor="file-upload"
                      className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full cursor-pointer shadow-md hover:bg-white text-amber-600 transition-all transform hover:scale-110"
                    >
                      <IoCloudUploadOutline size={20} />
                    </label>
                  </div>
                ) : (
                  <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer text-center w-full py-4">
                    <div className="bg-amber-100 p-3 rounded-full mb-3 text-amber-600">
                      <IoCloudUploadOutline size={24} />
                    </div>
                    <div className="flex text-sm text-gray-600">
                      <span className="font-semibold text-amber-600 hover:text-amber-500">Klik untuk upload</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max 5MB)</p>
                  </label>
                )}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all hover:shadow-orange-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? 'Menyimpan...' : (itemToEdit ? 'Simpan' : 'Tambah')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuFormModal;