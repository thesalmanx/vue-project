import { useCsrfTokenStore } from "../../csrfTokenStore";

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body: any = null
): Promise<any> {
  const csrfTokenStore = useCsrfTokenStore();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add the CSRF token if it's available
  if (csrfTokenStore.token) {
    headers["X-CSRFToken"] = csrfTokenStore.token;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred");
  }

  return response.json();
}
