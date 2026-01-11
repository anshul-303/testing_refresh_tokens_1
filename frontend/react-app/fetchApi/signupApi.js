const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function signUp(email, password, navigate) {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Signup failed");
  }

  const data = await res.json();
  navigate("/login");
  return data;
}
