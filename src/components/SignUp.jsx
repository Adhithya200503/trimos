import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SignupImage from "../assets/signup.svg";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://trim-url-gpxt.onrender.com/auth/signup",
        form,
        {
          withCredentials: true,
        }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-6">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-16 max-w-7xl w-full">
        <div className="hidden lg:block lg:w-[45%] w-full flex justify-center">
          <img
            src={SignupImage}
            className="w-full max-w-lg object-contain drop-shadow-xl rounded-xl"
            alt="Shortener Illustration"
          />
        </div>
        <div className=" w-96 bg-base-100 shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Create Account
          </h2>
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />
            <button className="btn btn-primary w-full mt-2">Sign Up</button>
          </form>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
