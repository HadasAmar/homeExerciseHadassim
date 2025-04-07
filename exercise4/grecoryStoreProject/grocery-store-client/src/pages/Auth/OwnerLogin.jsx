import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import "../../styles/SupplierLogin.css"
import { loginOwnerApi } from "../../api/ownerApi";
import { useNavigate } from "react-router-dom";

const OwnerLogin = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: ""
  });
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: loginOwnerApi,
    onSuccess: (response) => {
      //save the token and role in local storage
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", "owner");
      window.location.href = "/products";
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData); // call loginOwnerApi with form data
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Store owner login</h2>
        {mutation.isError && <p className="error-text">Error: {mutation.error}</p>}
        {mutation.isSuccess && <p className="success-text">Successful login!!</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="login2-button" disabled={mutation.isLoading}>
            Login
          </button>
        </form>


      </div>
    </div>
  );
};

export default OwnerLogin;
