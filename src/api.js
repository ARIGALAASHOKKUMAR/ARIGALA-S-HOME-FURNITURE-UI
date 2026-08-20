const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

export async function apiRequest(path, options = {}) {
  const { token, headers, ...requestOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (response.status === 204) return null;

  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) {
    throw new Error(body.message || "Something went wrong. Please try again.");
  }

  return body.data ?? body;
}
