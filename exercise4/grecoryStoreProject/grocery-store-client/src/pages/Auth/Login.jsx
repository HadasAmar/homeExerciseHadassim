import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css"; 
const Login = () => {
  const navigate = useNavigate();
  
  return (
    <div className="login-container">
      <h2 className="login-title" style={{fontSize:"35px"}} >Welcome to Grocery Management</h2>
      <div className="login-buttons">
        <button
          className="login-button storeOwner"
          onClick={() => navigate("/OwnerLogin")}
        >
          Grocery Owner Login
        </button>
        <button
          className="login-button supplier"
          onClick={() => navigate("/SupplierLogin")}
        >
          Supplier login        </button>
      </div>
    </div>
  );
};

export default Login;
