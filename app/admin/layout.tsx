'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
            // Allow access to login and seed page without auth
            const isPublicPage = pathname === '/admin/login' || pathname === '/admin/seed';

            if (!user && !isPublicPage) {
                router.replace('/admin/login');
            } else if (user && pathname === '/admin/login') {
                // If logged in and trying to go to login, redirect to dashboard
                router.replace('/admin/dashboard');
            } else {
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router, pathname]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return <>{children}</>;
}
