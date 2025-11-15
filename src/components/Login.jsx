import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import GoogleButton from "./ui/GoogleButton";
import UrlShortnerImage from "../assets/urlShortnerImage.svg";
import { FaSpinner } from "react-icons/fa";
const LoginPage = () => {
  const { setUser } = useContext(AuthContext);
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
      const res = await axios.post(
        "https://trim-url-gpxt.onrender.com/auth/login",
        form,
        {
          withCredentials: true,
        }
      );
      alert(res.data.message);
      setUser(res.data.userData);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-6">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-16 max-w-7xl w-full">
        <div className="card w-full max-w-sm shadow-xl bg-base-100 p-4">
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
                className="btn btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin text-white" />
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Google Button */}
            <div className="flex justify-center mt-4">
              <GoogleButton />
            </div>

            <p className="text-center mt-4 text-sm">
              Don’t have an account?{" "}
              <a href="/signup" className="link link-primary">
                Sign Up
              </a>
            </p>
          </div>
        </div>

        {/* RIGHT: Illustration */}
        <div className="hidden lg:block lg:w-[45%] w-full flex justify-center">
          <img
            src={UrlShortnerImage}
            className="w-full max-w-lg object-contain drop-shadow-xl rounded-xl"
            alt="Shortener Illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
