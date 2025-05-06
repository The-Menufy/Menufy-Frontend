import React from "react";

const Footer = () => {
  // Get the current date
  const today = new Date();

  // Format the date as "Month Day, Year" (e.g., "April 09, 2025")
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <footer
      className="w-100 bg-secondary text-white pt-5 pb-4"
      // z index={1000}
      style={{
        position: "relative",
        zIndex: 1000,
        backgroundColor: "#343a40",
        color: "#f8f9fa",
        padding: "2rem 0",
        fontSize: "0.875rem",
      }}
    >
      <div className="container">
        <div className="row gy-4">
          {/* Company Info */}
          <div className="col-12 col-sm-6 col-lg-3">
            <h3 className="h5 fw-bold mb-3 text-warning">TheMenuFy</h3>
            <p className="small text-light mb-4">
              Discover delicious meals with TheMenuFy. Customize your orders and
              enjoy a seamless dining experience.
            </p>
            <div className="d-flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-secondary fs-4"
              >
                <i className="bi bi-twitter"></i>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-secondary fs-4"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://plus.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-secondary fs-4"
              >
                <i className="bi bi-google"></i>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-12 col-sm-6 col-lg-3">
            <h3 className="h6 fw-semibold mb-3 text-warning">Contact Info</h3>
            <p className="small mb-2">
              <span className="d-block">📍 123 Fulton Street, Suite 721</span>
              <span className="d-block">New York, NY 10010</span>
            </p>
            <p className="small mb-2">
              📧{" "}
              <a
                href="mailto:support@themenufy.com"
                className="text-light text-decoration-underline"
              >
                support@themenufy.com
              </a>
            </p>
            <p className="small">
              📞{" "}
              <a
                href="tel:+198101000000"
                className="text-light text-decoration-underline"
              >
                +1 (981) 010 000 000
              </a>
            </p>
          </div>

          {/* Newsletter Signup */}
          <div className="col-12 col-sm-6 col-lg-3">
            <h3 className="h6 fw-semibold mb-3 text-warning">Newsletter</h3>
            <p className="small text-light mb-3">
              Stay updated with our latest menus and offers.
            </p>
            <form className="d-flex flex-column flex-sm-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="form-control bg-secondary text-white border-0"
                disabled
              />
              <button
                type="submit"
                className="btn btn-warning text-white"
                disabled
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Support & Downloads */}
          <div className="col-12 col-sm-6 col-lg-3">
            <h3 className="h6 fw-semibold mb-3 text-warning">
              Support & Downloads
            </h3>
            <p className="small text-light mb-3">
              Download our app to order on the go!
            </p>
            <div className="d-flex flex-column gap-2">
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="App Store"
                  style={{ height: "40px" }}
                />
              </a>
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  style={{ height: "40px" }}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-5 pt-3 border-top border-secondary text-center">
          <p className="small text-light mb-1">
            © {new Date().getFullYear()} TheMenuFy. All rights reserved. |
            Updated on {formattedDate}
          </p>
          <p className="small text-light mb-0">
            Designed & Developed by{" "}
            <a
              href="http://codemaster4twin6.com/"
              target="_blank"
              rel="noreferrer"
              className="text-warning text-decoration-underline"
            >
              CodeMaster 4Twin 6
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
