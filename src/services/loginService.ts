// /services/loginService.ts
type LoginCredentials = {
  username: string;
  password: string;
};

export const loginUser = async ({ username, password }: LoginCredentials) => {
  try {
    // Use the environment variable for the API base URL
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || "/api";
    const url = `${apiBase}/auth/login`;
    
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for cookies
      body: JSON.stringify({
        email: username, // Assuming username is email as per your login route
        password,
      }),
    });

    let data;
    try {
      data = await res.json();
    } catch (jsonError) {
      console.error("Failed to parse login response JSON:", jsonError);
      data = {}; // Fallback to empty object if JSON parsing fails
    }

    // Log the raw response for debugging
    console.log("Login API response:", {
      url,
      status: res.status,
      statusText: res.statusText,
      data,
    });

    if (!res.ok) {
      return {
        success: false,
        error: data.error || `Login failed with status ${res.status}`,
      };
    }

    if (!data.user) {
      console.warn("Login succeeded but no user data returned:", data);
      return {
        success: false,
        error: "No user data received from server",
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    console.error("Unexpected error in loginUser:", error);
    return {
      success: false,
      error: "An unexpected error occurred during login",
    };
  }
};