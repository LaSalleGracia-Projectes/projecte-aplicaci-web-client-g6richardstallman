import React from "react";
import Link from "next/link";
import "./NavLinks.css";

const NavLinks = ({ navItems, currentPath }) => {
  return (
    <nav className="header-nav">
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              href={item.path}
              className={
                currentPath === item.path ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default React.memo(NavLinks);
