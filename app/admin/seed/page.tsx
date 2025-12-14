'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SeedPage() {
    const [status, setStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        setLoading(true);
        setStatus('Creating user...');
        try {
            // You can change these credentials if you want different ones
            const email = 'admin@mieayampakmin.com';
            const password = 'admin123';

            await createUserWithEmailAndPassword(auth, email, password);
            setStatus(`Success! User created: ${email} / ${password}`);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                setStatus('User already exists (admin@mieayampakmin.com). You can login now.');
            } else {
                setStatus(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-stone-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-4 text-stone-800">Admin Seeder</h1>
                <p className="mb-6 text-stone-600">
                    Click the button below to create the default admin user.
                </p>

                <button
                    onClick={handleSeed}
                    disabled={loading}
                    className="w-full bg-orange-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Admin User'}
                </button>

                {status && (
                    <div className={`mt-6 p-4 rounded-xl text-sm font-medium ${status.includes('Success') || status.includes('already exists')
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {status}
                    </div>
                )}

                <div className="mt-6 text-sm text-stone-400">
                    ⚠️ This is a temporary page. Remove it after use.
                </div>
            </div>
        </div>
    );
}
