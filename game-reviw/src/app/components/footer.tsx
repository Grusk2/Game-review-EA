export default function Footer() {

    return (
        <footer className="bg-black text-white py-4 px-8">
          <div className="flex justify-between">
            <div>
              {/* Logo or Company Name */}
              <p className="font-bold">GameLens</p>
              {/* Copyright Information */}
              <p>&copy; 2023 GameLens. All rights reserved.</p>
            </div>
            <div>
              {/* Social Media Links */}
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
                        className="h-10" // Adjust height as needed
                    />
                </div>
              </ul>
            </div>
          </div>
        </footer>
      );
    }