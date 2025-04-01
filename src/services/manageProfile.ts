export type Profile = {
  id: string;
  name?: string | null;
  email: string;
  isAdmin?: boolean;
};

export type UpdateProfilePayload = {
  name?: string;
  email?: string;
  password?: string;         // New password
  currentPassword?: string;  // Must be present to change password
};

export const getProfile = async (): Promise<Profile | null> => {
  try {
    const res = await fetch("/api/profile", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      console.warn("Failed to get profile", await res.json());
      return null;
    }

    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
};

export const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<{ success: boolean; user?: Profile; error?: string }> => {
  try {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || "Failed to update profile" };
    }

    return { success: true, user: data.user };
  } catch (err) {
    console.error("Error updating profile:", err);
    return { success: false, error: "Network error or unexpected error" };
  }
};
