export default function Footer() {

    return (
        <footer className="bg-black text-white py-4 px-8">
          <div className="flex justify-between">
            <div>
              <p className="font-bold">GameLens</p>
              <p>&copy; 2023 GameLens. All rights reserved.</p>
            </div>
            <div>
              <ul className="flex gap-4">
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram"></i>   
    
                  </a>
                </li>
                <div className="flex">
                    <img 
                        src="/GameLens.png" 
                        alt="Logo" 
                        className="h-10"
                    />
                </div>
              </ul>
            </div>
          </div>
        </footer>
      );
    }