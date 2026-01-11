const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function login(email, password, navigate) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }
  const data = await res.json();
  navigate("/userDetails");
  return data;
}
