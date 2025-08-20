const BASE_URL = "http://10.220.239.63:8000/api";

export const update = async (endpoint: string, method = "GET", body?: any, token?: string) => {
  const headers: any = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return await res.json();
};

