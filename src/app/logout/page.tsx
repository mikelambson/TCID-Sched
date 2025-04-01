'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from "@/lib/auth-context";

export default function LogoutPage() {
  const router = useRouter();
  const { setLoggedIn } = useAuth();

  useEffect(() => {
    const logout = async () => {
      try {
        // Clear the server-side session
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });

        // Clear client state
        setLoggedIn(false);

        // Redirect to login or home
        router.push('/');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    logout();
  }, [router, setLoggedIn]);

  return <div className='mt-8 text-center'>Logging out...</div>;
}
