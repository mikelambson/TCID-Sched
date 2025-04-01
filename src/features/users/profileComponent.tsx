"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getProfile, updateProfile } from "@/services/manageProfile";
import { useAuth } from "@/lib/auth-context";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const profileSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => {
    if (data.newPassword || data.confirmPassword) {
      return data.currentPassword?.length;
    }
    return true;
  }, {
    message: "Current password is required to change password",
    path: ["currentPassword"],
  })
  .refine((data) => {
    if (data.newPassword || data.confirmPassword) {
      return data.newPassword === data.confirmPassword;
    }
    return true;
  }, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormSchema = z.infer<typeof profileSchema>;

export default function Profile() {
  const { recheckSession } = useAuth();
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");

  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const loadUser = async () => {
      const user = await getProfile();
      if (user) {
        form.reset({
          name: user.name ?? "",
          email: user.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
      setLoading(false);
    };

    loadUser();
  }, [form]);

  const onSubmit = async (values: ProfileFormSchema) => {
    setServerError("");
    setStatus("saving");

    const result = await updateProfile({
      name: values.name,
      email: values.email,
      password: values.newPassword || undefined,
      currentPassword: values.currentPassword || undefined,
    });

    if (result.success) {
      setStatus("success");
      await recheckSession();
      form.reset({
        name: result.user?.name ?? "",
        email: result.user?.email ?? "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setStatus("error");
      setServerError(result.error || "Update failed");
    }
  };

  if (loading) return <div className="p-4">Loading profile...</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-4 p-4">
        <h2 className="text-2xl font-bold">Your Profile</h2>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {serverError && (
          <p className="text-red-600 font-medium">{serverError}</p>
        )}

        <Button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : "Update Profile"}
        </Button>

        {status === "success" && (
          <p className="text-green-600 font-medium">Profile updated successfully!</p>
        )}
      </form>
    </Form>
  );
}
