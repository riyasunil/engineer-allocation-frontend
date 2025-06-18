import React, { useEffect, useRef, useState } from "react";
import logo from "../../../assets/logo.png";
import { useLoginMutation } from "@/api-service/auth/login.api";
import { useNavigate, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const usernameRef = useRef<HTMLInputElement>(null);
  const currentUser = useAppSelector((state) => state.user.currentUser);




  useEffect(() => {
    if (currentUser && currentUser.role?.role_name) {
      navigate(`/${currentUser.role.role_name.toLowerCase()}`);
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (password.length < 5 && password.length > 0) {
      setPasswordError("Password cannot be less than 5 characters");
    } else {
      setPasswordError("");
    }
  }, [password]);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email: username, password }).unwrap();
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("user_id", response.user_id);
      navigate(`/${response.role.toLowerCase()}`);
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error?.data?.message || "Login failed");
    }
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-[3fr_2fr] bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white">
      {/* Left section */}
      <div className="flex items-center justify-center p-10 bg-gradient-to-br from-indigo-800 via-purple-700 to-fuchsia-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_40%)] z-0" />
        <div className="relative z-10 text-center max-w-xl">
          <div className="flex items-center justify-center mb-6 space-x-4">
            <img src={logo} alt="Logo" className="h-14 w-14 object-contain" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Welcome to KeyValue
            </h2>
          </div>
          <p className="text-blue-100 text-lg leading-relaxed">
            Engineer Allocation Platform – simplify team management and
            productivity tracking with elegance and clarity.
          </p>
        </div>
      </div>

      {/* Right login form */}
      <div className="relative flex items-center justify-center bg-blue-950/60">
        <div className="absolute w-full h-full bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 animate-pulse opacity-20 blur-3xl z-0" />
        <div className="z-10 w-full max-w-md px-6 py-10 shadow-2xl rounded-3xl backdrop-blur-lg bg-white text-gray-900 mx-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h1 className="text-center mb-6 text-4xl font-extrabold text-gray-800">
              Sign In
            </h1>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleUsernameChange}
                ref={usernameRef}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {usernameError && <p className="text-red-600">{usernameError}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                onChange={handlePasswordChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {passwordError && <p className="text-red-600">{passwordError}</p>}
              {error && <p className="text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors"
              disabled={
                isLoading ||
                usernameError !== "" ||
                passwordError !== "" ||
                username === "" ||
                password === ""
              }
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
