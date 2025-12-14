'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import MenuItemCard from '@/components/admin/MenuItemCard';
import AddNewItemCard from '@/components/admin/AddNewItemCard';
import MenuFormModal from '@/components/admin/MenuFormModal';
import { MenuItem } from '@/data/data';
import { IoIosSearch, IoIosNotificationsOutline } from 'react-icons/io';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/firestore';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const [activeMenu, setActiveMenu] = useState<'makanan' | 'minuman'>('makanan');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<MenuItem | null>(null);

  // Check Authentication handled by Layout now
  useEffect(() => {
    fetchItems();
  }, []); // Run once on mount

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const items = await getMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => item.kategori === activeMenu);
  }, [menuItems, activeMenu]);

  const handleAddItem = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id: number | string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      try {
        setIsLoading(true);
        await deleteMenuItem(id);
        await fetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Gagal menghapus item");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setItemToEdit(null);
  };

  const handleCreateOrUpdate = async (itemData: Omit<MenuItem, 'id'> & { id?: number | string }) => {
    try {
      if (itemData.id) {
        await updateMenuItem(itemData.id, itemData);
      } else {
        await addMenuItem(itemData);
      }
      await fetchItems();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Gagal menyimpan item");
    }
  };



  return (
    <div className="flex bg-stone-50 min-h-screen font-sans">

      {/* 1. Sidebar */}
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* 2. Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">

        {/* Header - Clean Version */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-stone-800 tracking-tight">Dashboard Menu</h1>
            <p className="text-stone-500 mt-1">Kelola daftar {activeMenu} Anda dengan mudah</p>
          </div>
          {/* Right side removed as requested */}
        </header>

        {/* Content Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-stone-800 capitalize">
                Daftar {activeMenu}
              </h2>
              <div className="h-8 w-1 bg-orange-500 rounded-full"></div>
            </div>

            <span className="text-sm font-medium text-stone-500 bg-white px-4 py-1.5 rounded-full shadow-sm border border-stone-100">
              {isLoading ? '...' : filteredItems.length} Item
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {/* Skeleton Loading - Bisa dibuat komponen terpisah */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {/* Add New Card */}
              <AddNewItemCard
                onClick={handleAddItem}
                category={activeMenu === 'makanan' ? 'Makanan' : 'Minuman'}
              />

              {/* Menu Items */}
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={String(item.id)} // Ensure key is string
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={(id) => handleDeleteItem(id)} // Fix type mismatch if Card expects number specific
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal */}
      <MenuFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleCreateOrUpdate}
        itemToEdit={itemToEdit}
        defaultCategory={activeMenu}
      />

    </div>
  );
}