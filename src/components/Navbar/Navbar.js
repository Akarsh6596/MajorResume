import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa"; // Menu icon
//import { IoMdArrowDropdown } from "react-icons/io"; // Dropdown icon
import "./Navbar.css"; // Import CSS for styling

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
          <FaBars size={25} />
        </button>
      </div>
      
      <div className="nav-right">
        <h2>Resume Summarizer</h2>
      </div>

      {isOpen && (
        <ul className="dropdown-menu">
          <li>
            <Link to="/">About</Link>
          </li>
          <li>
            <Link to="/bart">BART Summarizer</Link>
          </li>
          <li>
            <Link to="/bert">BERT Summarizer</Link>
          </li>
          <li>
            <Link to="/Rank">Rank</Link>
          </li>
          <li>
            <Link to="/Comparision">Bar Graphs</Link>
          </li>
          <li>
            <Link to="/ComparisonV2">Tables</Link>
          </li>
          <li>
            <Link to="/DisplaySummaries">Display Summaries</Link>
          </li>
          <li>
            <Link to="/ComparisonGraphs">Line Graph</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
