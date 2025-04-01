"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getProfile, updateProfile } from "@/services/manageProfile";
import { useAuth } from "@/lib/auth-context";

export default function Profile() {
  const { recheckSession } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const user = await getProfile();
      if (user) {
        setName(user.name ?? "");
        setEmail(user.email);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg("");

    // Validate password fields
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        setErrorMsg("Please enter your current password.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMsg("New passwords do not match.");
        return;
      }

      if (newPassword.length < 6) {
        setErrorMsg("New password must be at least 6 characters.");
        return;
      }
    }

    setStatus("saving");

    const result = await updateProfile({
      name,
      email,
      password: newPassword ? newPassword : undefined,
      currentPassword: currentPassword || undefined, // optional: send for server-side verification
    });

    if (result.success) {
      setStatus("success");
      await recheckSession();
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Update failed. Please try again.");
    }
  };

  if (loading) return <div className="p-4">Loading profile...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Your Profile</h2>

      <Label>
        Name
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Label>

      <Label>
        Email
        <Input
          type="email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Label>

      <Label>
        Current Password
        <Input
          type="password"
          value={currentPassword}
          autoComplete="current-password"
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Required to change your password"
        />
      </Label>

      <Label>
        New Password
        <Input
          type="password"
          value={newPassword}
          autoComplete="new-password"
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Leave blank to keep current"
        />
      </Label>

      <Label>
        Confirm New Password
        <Input
          type="password"
          value={confirmPassword}
          autoComplete="new-password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat new password"
        />
      </Label>

      {errorMsg && (
        <p className="text-red-600 font-medium">{errorMsg}</p>
      )}

      <Button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Saving..." : "Update Profile"}
      </Button>

      {status === "success" && (
        <p className="text-green-600 font-medium">Profile updated!</p>
      )}
    </form>
  );
}
