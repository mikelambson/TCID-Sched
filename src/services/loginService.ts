// /services/loginService.ts

type LoginCredentials = {
    username: string;
    password: string;
  };
  
export const loginUser = async ({ username, password }: LoginCredentials) => {
    try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ⬅️ important to send/receive cookies
          body: JSON.stringify({
            email: username,
            password,
          }),
        });
    
        const data = await res.json();
    
        if (!res.ok) {
          return {
            success: false,
            error: data.error || "Login failed",
          };
        }
    
        return {
          success: true,
          user: data.user,
        };
    } catch {
        return {
          success: false,
          error: "Unexpected error occurred",
        };
    }
};
  