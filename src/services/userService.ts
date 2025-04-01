// services/userService.ts

export type User = {
    id: string;
    name?: string | null;
    email: string;
    isAdmin: boolean;
  };
  
  export type UserPayload = {
    name: string;
    email: string;
    password?: string;
    isAdmin: boolean;
  };
  
  export const getUsers = async (): Promise<User[]> => {
    const res = await fetch("/api/users", { credentials: "include" });
    return res.ok ? await res.json() : [];
  };
  
  export const createUser = async (payload: UserPayload) => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return await res.json();
  };
  
  export const updateUser = async (id: string, payload: UserPayload) => {
    const res = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return await res.json();
  };
  
  export const deleteUser = async (id: string) => {
    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to delete user");
    }
  
    return true;
  };
  