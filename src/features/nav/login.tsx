// @/features/nav/login.tsx
"use client";
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { loginUser } from "@/services/loginService";


const Login = () => {
    const { isLoggedIn, recheckSession } = useAuth(); // ✅ replace setLoggedIn with recheckSession
 // Simulate a logged-in state
    const [open, setOpen] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const login = async () => {
            
            if (pathname === "/login" && isLoggedIn === false) {
                setOpen(true);  
                return;
            }
            else if (pathname === "/login" && isLoggedIn === true) {
                router.push("/admin");
                setOpen(false);
                return;
            } else { setOpen(true);}
            return   
        };

        login();    
    }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

    
    
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

        const response = await loginUser({ username, password });

        if (response.success) {
            await recheckSession();
            setOpen(false);
            router.push("/admin");
        } else {
            alert(response.error || "Login failed");
        }
      };

    return ( 
        <Dialog open={open} onOpenChange={() => router.back()}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Login</DialogTitle>
                <DialogDescription>
                Enter your login details
                </DialogDescription>
            </DialogHeader>
            <form
                onSubmit={(e) => {handleSubmit(e)}}
                className="flex flex-col gap-4"
            >
                <Label>
                Username
                <Input 
                    type="text" 
                    name="username" 
                    autoComplete="username" 
                    required    
                />
                </Label>
                <Label>
                Password
                <Input 
                    type="password" 
                    name="current-password" 
                    autoComplete="current-password" 
                    required    
                />
                </Label>
                
                <Button type="submit" className="cursor-pointer">Login</Button>
                
            </form>
            </DialogContent>
        </Dialog>
    );
}
   
export { Login };