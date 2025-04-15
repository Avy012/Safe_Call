// src/Header.js
import React from "react";
import logo from './logo.png';


function Header({ currentSection, setSection }) {
  const sections = ["analytics", "blocks", "login", "signup"];

  return (
    <header>
      <div className="logo-container">
        <img src="logo.png" alt="SAFE CALL Logo" />
        <span className="logo-text">SAFE CALL</span>
      </div>
      <nav>
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => setSection(sec)}
            className={currentSection === sec ? "active" : ""}
          >
            {sec.charAt(0).toUpperCase() + sec.slice(1)}
          </button>
        ))}
      </nav>
    </header>
  );
}

export default Header;
