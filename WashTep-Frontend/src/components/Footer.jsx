import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>WashTep</h4>
          <p>
            We take the load off your mind, delivering fresh, clean clothes
            right to your door.
          </p>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>
            Email:{' '}
            <a href="mailto:himanshu99071.com">himanshu99071.com</a>
          </p>
          <p>
            Phone:{' '}
            <a href="tel:+9195098729257">+91 95087 29257</a>
          </p>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a
              href="https://www.linkedin.com/in/himanshu-kumar-145ab6337/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* LinkedIn SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.82-2.2 3.75-2.2 4.01 0 4.75 2.64 4.75 6.1V24h-4v-7.9c0-1.9-.03-4.35-2.65-4.35-2.65 0-3.05 2.07-3.05 4.2V24h-4V8z" />
              </svg>
            </a>

            <a
              href="https://www.instagram.com/_kr_himanshu/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Instagram SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.75 2.25a.75.75 0 110 1.5.75.75 0 010-1.5zm-4.5 1a5.25 5.25 0 110 10.5 5.25 5.25 0 010-10.5zm0 1.5a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
              </svg>
            </a>

            <a
              href="https://x.com/Lol_character7"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Twitter (X) SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2h3.308l-7.227 8.26L22.5 22h-6.556l-5.122-6.826L4.828 22H1.5l7.73-8.833L1.5 2h6.715l4.622 6.186L18.244 2zm-1.158 18h1.833L7.083 4h-1.98L17.086 20z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <a href="#">Terms & Conditions</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 WashTep. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
