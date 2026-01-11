import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserInfo } from "../fetchApi/getUserInfo";
import { logoutUser } from "../fetchApi/getUserInfo";

export default function TodosPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserDetailsApi = async () => {
      const data = await getUserInfo(navigate);
      console.log(data);
      setEmail(data.email);
    };
    fetchUserDetailsApi(navigate);
  });

  return (
    <>
      <div className="w-screen h-screen bg-zinc-900 text-white flex justify-center flex-col items-center">
        Todos Page
        <div>Email ID: {email}</div>
        <button
          onClick={async () => {
            await logoutUser(navigate);
          }}
          className="mt-4 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
        >
          Log out
        </button>
      </div>
    </>
  );
}
