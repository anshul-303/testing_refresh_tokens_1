import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../fetchApi/loginApi";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
      <div className="w-screen min-h-screen bg-zinc-900 text-white flex justify-center flex-col items-center gap-6">
        <form
          className="flex flex-col  p-8 bg-zinc-800 rounded-lg shadow-lg w-full max-w-md"
          onSubmit={async (e) => {
            e.preventDefault();
            const data = await login(email, password, navigate);
            console.log(data);
          }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email ID
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              autoComplete="off"
              className="px-4 py-2 bg-zinc-700 border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              type="text"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              autoComplete="off"
              className="px-4 py-2 bg-zinc-700 border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
