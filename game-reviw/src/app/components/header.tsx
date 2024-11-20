export default function Header() {

    return (
        <header className="flex items-center  justify-between bg-black text-white px-8 py-4 h-16">
                 {/* Logo Placeholder replaced with Image */}
      <div className="flex">
        <img 
          src="/GameLens.png" 
          alt="Logo" 
          className="h-10" // Adjust height as needed
        />
      </div>
          {/* Navigation Items */}
          <ul className="flex gap-8">
            <li className="cursor-pointer hover:underline">Home</li>
            <li className="cursor-pointer hover:underline">About</li>
            <li className="cursor-pointer hover:underline">Services</li>
            <li className="cursor-pointer hover:underline">Contact</li>
          </ul>
    
          {/* Profile Picture Placeholder */}
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center rounded-full cursor-pointer">
            👤
          </div>
        </header>
      );
    };