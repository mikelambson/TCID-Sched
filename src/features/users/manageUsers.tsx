"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getUsers,
  createUser,
  updateUser,
  UserPayload,
  User,
  deleteUser,
} from "@/services/userService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const userSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    isAdmin: z.boolean(),
  })
  .refine((data) => {
    // Only validate confirmation if password is filled in
    if (data.password) {
      return data.password.length >= 6;
    }
    return true;
  }, {
    message: "Password must be at least 6 characters",
    path: ["password"],
  })
  .refine((data) => {
    if (data.password) {
      return data.password === data.confirmPassword;
    }
    return true;
  }, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UserFormSchema = z.infer<typeof userSchema>;

export default function ManageUsers() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [open, setOpen] = useState(false);
    const [deleteTargetUser, setDeleteTargetUser] = useState<User | null>(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    const form = useForm<UserFormSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        isAdmin: false,
        },
    });

    const refreshUsers = async () => {
        const allUsers = await getUsers();
        if (allUsers) setUsers(allUsers);
    };

    useEffect(() => {
        refreshUsers();
    }, []);

    const openDialog = (user?: User) => {
        if (user) {
        setEditingUser(user);
        form.reset({
            name: user.name || "",
            email: user.email,
            password: "",
            confirmPassword: "",
            isAdmin: user.isAdmin,
          });          
        } else {
        setEditingUser(null);
        form.reset({
            name: "",
            email: "",
            password: "",
            confirmPassword: "", // ✅ Add this too
            isAdmin: false,
          });
        }
        setOpen(true);
    };

    const handleSubmit = async (values: UserFormSchema) => {
        const payload: UserPayload = {
          name: values.name,
          email: values.email,
          isAdmin: values.isAdmin,
        };
      
        if (values.password?.trim()) {
          payload.password = values.password;
        }
      
        if (editingUser) {
          await updateUser(editingUser.id, payload);
        } else {
          await createUser(payload);
        }
      
        setOpen(false);
        refreshUsers();
      };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Users</h2>
                <Button onClick={() => openDialog()}>Add User</Button>
            </div>

            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.isAdmin ? "Yes" : "No"}</TableCell>
                    {/* <TableCell>
                        {user.id !== currentUser?.id && (
                        <Button size="sm" onClick={() => openDialog(user)}>
                            Edit
                        </Button>
                        )}
                    </TableCell> */}
                    <TableCell className="flex gap-2 justify-between">
                            {user.id !== currentUser?.id && (
                                <>
                                <Button size="sm" onClick={() => openDialog(user)}>
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                        setDeleteTargetUser(user);
                                        setDeleteConfirmText("");
                                    }}
                                    >
                                    Delete
                                </Button>

                                </>
                            )}
                        </TableCell>

                    </TableRow>
                ))}
                </TableBody>
            </Table>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
                    <DialogDescription className="sr-only">
                        Edit user details
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form autoComplete="off" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                            <FormControl><Input type="email" autoComplete="email" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <input
                        type="text"
                        name="username"
                        autoComplete="off"
                        className="sr-only"
                        tabIndex={-1}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                            {editingUser ? "New Password (optional)" : "Password"}
                            </FormLabel>
                            <FormControl><Input type="password" autoComplete="off" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {form.watch("password") !== "" && (
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                            <Input type="password" autoComplete="off" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    )}


                    <FormField
                        control={form.control}
                        name="isAdmin"
                        render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                            <FormLabel>Admin</FormLabel>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <div className="text-right">
                        <Button type="submit">
                        {editingUser ? "Update" : "Create"}
                        </Button>
                    </div>
                    </form>
                </Form>
                </DialogContent>
            </Dialog>
            {deleteTargetUser && (
                <Dialog open={!!deleteTargetUser} onOpenChange={() => setDeleteTargetUser(null)}>
                    <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                        Type <span className="font-bold text-red-600">DELETE</span> to confirm deleting{" "}
                        <span className="font-semibold">{deleteTargetUser.email}</span>.
                        </DialogDescription>
                    </DialogHeader>

                    <Input
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                    />

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                        variant="outline"
                        onClick={() => setDeleteTargetUser(null)}
                        >
                        Cancel
                        </Button>
                        <Button
                        variant="destructive"
                        disabled={deleteConfirmText !== "DELETE"}
                        onClick={async () => {
                            try {
                            await deleteUser(deleteTargetUser.id);
                            refreshUsers();
                            setDeleteTargetUser(null);
                            } catch (err: any) {
                            alert(err.message || "Failed to delete user");
                            }
                        }}
                        >
                        Delete User
                        </Button>
                    </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
