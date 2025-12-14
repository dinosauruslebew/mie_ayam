'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';

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

            // Role-based Redirect Logic
            // In a real app, this should be checked against a database or custom claims.
            // For now, we check the admin email directly.
            if (email === 'admin@mieayampakmin.com') {
                router.replace('/admin/dashboard');
            } else {
                router.replace('/');
            }

        } catch (err: any) {
            console.error('Login error:', err);
            if (err.code === 'auth/invalid-credential') {
                setError('Email atau password salah.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Terlalu banyak percobaan. Coba lagi nanti.');
            } else {
                setError('Gagal masuk. Periksa koneksi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 font-sans p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-8 w-full max-w-md relative">

                <Link href="/" className="absolute top-6 left-6 text-stone-400 hover:text-stone-600 transition-colors">
                    <IoArrowBack size={24} />
                </Link>

                <div className="text-center mb-8 mt-4">
                    <h1 className="text-2xl font-bold text-stone-800">Selamat Datang</h1>
                    <p className="text-stone-500 mt-2">Silakan login ke akun Anda</p>
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
                            placeholder="nama@email.com"
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
                        className="w-full py-3 bg-stone-800 text-white font-bold rounded-xl hover:bg-stone-900 shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {isLoading ? 'Memproses...' : 'Masuk'}
                    </button>

                    <p className="text-center text-stone-500 text-sm mt-4">
                        Belum punya akun?{' '}
                        <Link href="/register" className="text-orange-600 font-bold hover:underline">
                            Daftar Sekarang
                        </Link>
                    </p>
                </form>

            </div>
        </div>
    );
}
