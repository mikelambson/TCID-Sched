"use client"
import Link from "next/link";
import Image from "next/image";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { GiHamburgerMenu } from "react-icons/gi";
import { MdLogin, MdOutlineKey } from "react-icons/md";
import { TbCircleLetterC, TbCircleLetterE, TbCircleLetterT, TbCircleLetterW } from "react-icons/tb";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import { useRef } from "react";



 // Shift focus to drawer when it opens

  
const Navbar = () => {
    const pathname = usePathname();
    const { isLoggedIn } = useAuth();
    const isLogin = isLoggedIn ? "Logout" : "Login";
    const iconColor = pathname.startsWith("/admin") ? "text-white" : "text-foreground";

    const drawerRef = useRef<HTMLDivElement>(null);

    const handleDrawerOpen = () => {
        if (drawerRef.current) {
          drawerRef.current.focus(); // Move focus to drawer content
        }
     };

    return ( 
        <Drawer direction="left">
            <DrawerTrigger 
                className={`fixed top-1 left-1 p-2 z-10 border-b border-r border-black/40 bg-slate-600/30 hover:bg-slate-400/50 hover:border-yellow-600/30 cursor-pointer rounded-md drop-shadow-lg ${iconColor}`}
                onClick={handleDrawerOpen}
            >
                    <GiHamburgerMenu size={30} />
                    <span className="sr-only">Open navigation</span>
            </DrawerTrigger>
            <DrawerContent ref={drawerRef} tabIndex={-1}>
                <DrawerHeader>
                    <DrawerTitle className="sr-only">Main Menu</DrawerTitle>
                    <DrawerDescription className="sr-only">
                        TCID Online Schedule choose a district
                    </DrawerDescription>
                </DrawerHeader>
                <nav className="-mt-8 flex flex-col text-accent-foreground font-semibold text-xl">
                    {
                        <DrawerClose asChild>
                            
                            <Link href="/" className="p-4 hover:bg-slate-600">
                                <span className="inline-flex items-center gap-4">
                                    <Image
                                        src="/logo.png"
                                        alt="Logo"
                                        width={40}
                                        height={40}
                                        className=""
                                    />
                                    TCID Online Schedule
                                </span>
                            
                            </Link>
                        </DrawerClose>
                    }
                    <DrawerClose asChild>
                        <Link href="/west" className="p-4 hover:bg-slate-600">
                            <span className="inline-flex items-center gap-4">
                                <TbCircleLetterW size={30} />
                                West
                            </span>
                        </Link>
                    </DrawerClose>
                    <DrawerClose asChild>
                        <Link href="/central" className="p-4 hover:bg-slate-600">
                            <span className="inline-flex items-center gap-4">
                                <TbCircleLetterC size={30} />
                                Central
                            </span>
                        </Link>
                    </DrawerClose>
                    <DrawerClose asChild>
                        <Link href="/east" className="p-4 hover:bg-slate-600">
                            <span className="inline-flex items-center gap-4">
                                <TbCircleLetterE size={30} />
                                East
                            </span>
                        </Link>
                    </DrawerClose>
                    <DrawerClose asChild>
                        <Link href="/truckee" className="p-4 hover:bg-slate-600">
                            <span className="inline-flex items-center gap-4">
                                <TbCircleLetterT size={30} />
                                Truckee
                            </span>
                        </Link>
                    </DrawerClose>
                </nav>
                <DrawerFooter className="mx-0 px-0 font-semibold">
                        {isLoggedIn === true && (
                            <DrawerClose asChild>
                                <Link href="/admin">
                                    <div className="w-full p-4 hover:bg-slate-600 inline-flex items-center gap-4 text-xl">
                                        <MdOutlineKey size={30} />
                                        Admin
                                    </div>
                                </Link>
                            </DrawerClose>
                        )}
                    <DrawerClose asChild>
                        
                        <Link href={isLoggedIn === true ? "/logout" : "/login"}>
                            <div className="w-full p-4 hover:bg-slate-600 inline-flex items-center gap-4 text-xl">
                                <MdLogin size={30} />
                                {isLogin}
                            </div>
                        </Link>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
     );
  }
   
  export { Navbar };