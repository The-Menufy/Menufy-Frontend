import React from "react";

const Footer = () => {
  // Get the current date
  const today = new Date();
  
  // Format the date as "Month Day, Year" (e.g., "April 09, 2025")
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long", // Full month name (e.g., "April")
    day: "2-digit", // Day with leading zero (e.g., "09")
    year: "numeric", // Full year (e.g., "2025")
  });

  return (
    <div className="footer">
      <div className="copyright">
        <p>
          Copyright © Designed & Developed by{" "}
          <a href="http://codemaster4twin6.com/" target="_blank" rel="noreferrer">
            CodeMaster 4Twin 6
          </a>{" "}
          - Updated on {formattedDate}
        </p>
      </div>
    </div>
  );
};

export default Footer;