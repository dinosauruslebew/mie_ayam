'use client';

import Link from "next/link";
import { IoLogInOutline } from "react-icons/io5";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 font-sans p-4">
      <main className="text-center max-w-2xl w-full">

        {/* Logo / Brand */}
        <div className="w-24 h-24 bg-orange-500 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-orange-200 mb-8 transform hover:scale-105 transition-transform duration-300">
          <span className="text-white font-extrabold text-5xl">M</span>
        </div>

        <h1 className="text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
          Mie Ayam <span className="text-orange-600">Pak Min</span>
        </h1>
        <p className="text-stone-500 text-xl font-medium mb-12 max-w-lg mx-auto leading-relaxed">
          Sistem Manajemen Menu Modern, Cepat, dan Efisien.
        </p>

        {/* Action Button */}
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-3 px-8 py-4 bg-stone-900 text-white rounded-full font-bold text-lg hover:bg-orange-600 transition-all duration-300 shadow-xl hover:shadow-orange-200 group"
        >
          <span>Masuk ke Dashboard Admin</span>
          <IoLogInOutline className="text-2xl group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="mt-16 pt-8 border-t border-stone-200">
          <p className="text-stone-400 text-sm font-medium">
            © 2024 Mie Ayam Pak Min. All rights reserved.
          </p>
        </div>

      </main>
    </div>
  );
}
