import { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Signup from "../components/Signup";
import Login from "../components/Login";
import TodosPage from "../components/TodosPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userDetails" element={<TodosPage />} />
      </Routes>
    </>
  );
}

export default App;
