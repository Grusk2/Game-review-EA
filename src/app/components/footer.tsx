import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-4 px-8">
      <div className="flex justify-between">
        <div>
          <p className="font-bold">GameLens</p>
          <p>&copy; 2023 GameLens. All rights reserved.</p>
        </div>
        <div>
          <ul>
            <div className="flex">
              <Image src="/GameLens.png" alt="Logo"    width={300} 
   height={200} className="h-10 w-12" />
            </div>
          </ul>
        </div>
      </div>
    </footer>
  );
}
