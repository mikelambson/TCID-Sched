'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from "@/lib/auth-context";


export default function LogoutPage() {
    const router = useRouter();
    const { isLoggedIn, setLoggedIn } = useAuth(); // Simulate a logged-in state

    useEffect(() => {
        const logout = async () => {
            setLoggedIn(false);
            // Clear user session (e.g., remove tokens from localStorage or cookies)
            localStorage.removeItem('authToken');
            // Redirect to login page or home
            router.push('/');
        };

        logout();
    }, [router]);

    return <div className='mt-8 text-center'>Logging out...</div>;
}