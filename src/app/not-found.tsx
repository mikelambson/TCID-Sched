// app/not-found.tsx
import Link from "next/link";
export default function NotFound() {
    const linktext = "<< Go back to Home";
    return (
      <div className="text-center mt-10 text-2xl text-gray-950 font-bold">
        404 – Page Not Found
        <div className="mt-8">
          <Link href="/" className="text-blue-950 hover:underline">
            {linktext}
          </Link>
        </div>
      </div>
    );
  }
  