import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import GoogleButton from "./ui/GoogleButton";

const LoginPage = () => {
  const {setUser} = useContext(AuthContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://trim-url-gpxt.onrender.com/auth/login", form, {
        withCredentials: true,
      });
      alert(res.data.message);
      setUser(res.data.userData);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
      navigate("/")
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Login</h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </label>

            <button
              className={`btn btn-primary w-full mt-2 ${
                loading ? "loading" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-3 text-sm">
             <GoogleButton></GoogleButton>
            <p className="mt-2">
              Don’t have an account?{" "}
              <a href="/signup" className="link link-primary">
                Sign Up
              </a>
            </p>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
