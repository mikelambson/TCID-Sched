'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from "@/lib/auth-context";

export default function LogoutPage() {
  const router = useRouter();
  const { setLoggedIn, recheckSession } = useAuth();

  useEffect(() => {
    const logout = async () => {
      try {
        // Clear server-side session
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Logout request failed');
        }
        <div className="text-center mt-10 text-yellow-500 ">
          Logging out...
        </div>;
        router.push('/');
        setLoggedIn(false);
        await recheckSession(); // This will update the user state
         // Use replace to avoid going back to logout page
        // Redirect to login or home
        router.push('/'); 
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    logout();
  }, [router, setLoggedIn, recheckSession]);

  return null; // Changed from empty return to explicit null
}