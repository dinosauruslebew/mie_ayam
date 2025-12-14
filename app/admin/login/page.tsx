'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Success, redirect to dashboard
            router.push('/admin/dashboard');
        } catch (err: any) {
            console.error('Login error:', err);
            if (err.code === 'auth/invalid-credential') {
                setError('Email atau password salah.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Terlalu banyak percobaan. Coba lagi nanti.');
            } else {
                setError('Gagal masuk. Periksa koneksi atau hubungi admin.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 font-sans p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-8 w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-stone-800">Admin Login</h1>
                    <p className="text-stone-500 mt-2">Mie Ayam Pak Min</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-1.5">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none text-stone-800 placeholder:text-stone-400 bg-stone-50/50 focus:bg-white"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none text-stone-800 placeholder:text-stone-400 bg-stone-50/50 focus:bg-white"
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all hover:shadow-orange-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {isLoading ? 'Memproses...' : 'Masuk Dashboard'}
                    </button>

                    <div className="text-center mt-6">
                        <button
                            type="button"
                            onClick={() => router.push('/')}
                            className="text-stone-400 hover:text-orange-600 text-sm font-medium transition-colors"
                        >
                            ← Kembali ke Halaman Utama
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
