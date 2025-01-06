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
              <img src="/GameLens.png" alt="Logo" className="h-10" />
            </div>
          </ul>
        </div>
      </div>
    </footer>
  );
}
