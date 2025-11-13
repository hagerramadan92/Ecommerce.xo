export const API_URL = "https://ecommecekhaled.renix4tech.com/api/v1";

export async function fetchHomeData() {
  try {
    const res = await fetch(`${API_URL}/home`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    if (!data.status) throw new Error(data.message || "فشل جلب البيانات");

    return data.data; 
  } catch (err) {
    console.error("Error fetching home data:", err);
    return null;
  }
}
