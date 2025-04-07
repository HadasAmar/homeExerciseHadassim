import React, { useEffect, useState } from "react";
import "../styles/Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

  
const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <ul>
        {!token && (
          <li>
            <Link to="/login"> homePage</Link>
          </li>
        )}

        {token && (
          <>
            {userRole=="owner"&&(<li>
              <Link to="/products"> add order</Link>
            </li>)}
            {userRole === "supplier" && (
              <li>
                <Link to="/ordersBySupplier">orders</Link>
              </li>
            )}
            {userRole === "supplier" && (
              <li>
                <Link to="/addProduct"> add product</Link>
              </li>
            )}
            {userRole === "owner" && (
              <li>
                <Link to="/ordersByOwner">orders</Link>
              </li>
            )}
            <li>
              <button className="logout-btn" onClick={() => {
                // remove the token and role from local storage
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                window.location.href = "/login";
              }}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
