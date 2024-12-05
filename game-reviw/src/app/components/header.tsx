import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-black text-white w-full pl-20 pr-20 h-16">
      <div className="flex">
        <Link href="/">
          <img
            src="/GameLens.png"
            alt="Logo"
            className="h-10 cursor-pointer"
          />
        </Link>
      </div>
      <ul className="flex gap-8">
        <li className="cursor-pointer hover:underline">
          <Link href="/">Home</Link>
        </li>
        <li className="cursor-pointer hover:underline">
          <Link href="/discover">Discover</Link>
        </li>
        <li className="cursor-pointer hover:underline">
          <Link href="/library">Library</Link>
        </li>
        <li className="cursor-pointer hover:underline">
          <Link href="/contact">Contact</Link>
        </li>
        <li className="cursor-pointer hover:underline">
          <Link href="/pages/signup">Sign Up</Link> 
        </li>
        <li className="cursor-pointer hover:underline">
          <Link href="/pages/login">Log in</Link>
        </li>
      </ul>

      <div className="w-10 h-10 bg-white text-black flex items-center justify-center rounded-full cursor-pointer">
        👤
      </div>
    </header>
  );
}
