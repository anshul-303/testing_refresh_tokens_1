const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function getUserInfo(navigate) {
  const res = await fetch(`${API_URL}/get-user-details`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  // 1. If Access Token is expired/invalid
  if (res.status === 401) {
    console.log("Access token expired, attempting refresh...");

    const refreshRes = await fetch(`${API_URL}/refresh`, {
      method: "GET", // Or POST, depending on your backend
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    // 2. If Refresh Token is ALSO expired or invalid
    if (!refreshRes.ok) {
      console.error("Refresh token expired. Logging out.");
      navigate("/login");
      return null; // Stop the execution here
    }

    // 3. Refresh succeeded, retry the original request ONCE
    return getUserInfo(navigate);
  }

  // 4. Handle other errors (404, 500, etc.)
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch user data");
  }

  return await res.json();
}

export async function logoutUser(navigate) {
  try {
    const res = await fetch(`${API_URL}/logout`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.ok) navigate("/login");
    console.log("The user is logged out!");

    if (!res.ok) {
      const data = await res.json();
      console.log(data);
    }
  } catch (error) {
    console.log("Error detected : ", error);
  }
}
