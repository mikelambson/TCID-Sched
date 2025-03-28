import Link from "next/link";

const AdminNav = () => {
    return ( 
        <nav className="fixed top-0 left-0 w-full bg-neutral-800/90 text-white p-4">
            <ul className="pl-10 flex gap-4">
                <li><Link href="/admin">Dashboard</Link></li>
                <li><Link href="/admin/users">Users</Link></li>
                <li><Link href="/admin/settings">Settings</Link></li>
                {/* <li><Link href="/login">Login</Link></li> */}
            </ul>
        </nav>
    );
}
 
export default AdminNav;