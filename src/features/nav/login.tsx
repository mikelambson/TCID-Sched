// @/features/nav/login.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { loginUser } from "@/services/loginService";

const Login = () => {
  const { isLoggedIn, user, recheckSession, setLoggedIn } = useAuth();
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkLoginState = async () => {
      if (pathname === "/login" && isLoggedIn === false) {
        setOpen(true);
      } else if (pathname === "/login" && isLoggedIn === true) {
        setOpen(false);
        router.push("/admin");
      } else {
        setOpen(true);
      }
    };

    checkLoginState();
  }, [isLoggedIn, pathname, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const username = formData.get("username") as string | null;
    const password = formData.get("current-password") as string | null;

    if (!username || !password) {
      alert("Username and password are required.");
      return;
    }

    try {
      const response = await loginUser({ username, password });
      console.log("Login response:", response);

      if (!response.success || !response.user) {
        alert(response.error || "Login failed");
        return;
      }

      // Wait for session to update
      await recheckSession();

      // Use a promise to wait for state to settle
      const waitForAuthUpdate = () =>
        new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if (isLoggedIn && user) {
              clearInterval(checkInterval);
              resolve(true);
            }
          }, 50);
          setTimeout(() => {
            clearInterval(checkInterval);
            resolve(false);
          }, 1000); // Timeout after 1s
        });

      const isAuthenticated = await waitForAuthUpdate();
      console.log("After recheck - isLoggedIn:", isLoggedIn, "user:", user);

      if (isAuthenticated) {
        console.log("Session confirmed valid, navigating to /admin");
        setOpen(false);
        router.push("/admin");
      } else {
        console.log("Session still invalid after login, response user:", response.user);
        alert("Login succeeded but session validation failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An unexpected error occurred during login.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => router.back()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>Enter your login details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Label>
            Username
            <Input type="text" name="username" autoComplete="username" required />
          </Label>
          <Label>
            Password
            <Input type="password" name="current-password" autoComplete="current-password" required />
          </Label>
          <Button type="submit" className="cursor-pointer">Login</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { Login };