import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from "@/lib/auth-context";

'use client';


export default function LogoutPage() {
    const router = useRouter();
    const { isLoggedIn, setLoggedIn } = useAuth(); // Simulate a logged-in state

    useEffect(() => {
        const logout = async () => {
            isLoggedIn === true ? setLoggedIn(false) : router.push("/");
            // Clear user session (e.g., remove tokens from localStorage or cookies)
            localStorage.removeItem('authToken');
            // Redirect to login page or home
            router.push('/');
        };

        logout();
    }, [router]);

    return <p>Logging out...</p>;
}