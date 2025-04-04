// /services/loginService.ts
type LoginCredentials = {
  username: string;
  password: string;
};

export const loginUser = async ({ username, password }: LoginCredentials) => {
  try {
    const url = "/api/auth/login";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Credentials': 'true',
      },
      credentials: "include",
      body: JSON.stringify({
        email: username,
        password,
      }),
    });

    const data = await res.json();
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
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        isAdmin: data.user.isAdmin || false, // Ensure isAdmin is included
      },
    };
  } catch (error) {
    console.error("Unexpected error in loginUser:", error);
    return {
      success: false,
      error: "An unexpected error occurred during login",
    };
  }
};