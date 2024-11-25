import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-black text-white w-100% pl-80 pr-80 h-16">
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
        <li className="cursor-pointer hover:underline">Home</li>
        <li className="cursor-pointer hover:underline">Discover</li>
        <li className="cursor-pointer hover:underline">Library</li>
        <li className="cursor-pointer hover:underline">Contact</li>
      </ul>

      <div className="w-10 h-10 bg-white text-black flex items-center justify-center rounded-full cursor-pointer">
        👤
      </div>
    </header>
  );
}
