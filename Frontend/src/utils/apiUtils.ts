// Get auth headers with maybe extra ones
export function getAuthHeaders(extraHeaders: Record<string, string> = {}) {
  const token = localStorage.getItem("token");
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// To handle API ERRORS globally
export const handleApiError = async (
  response: Response
): Promise<Error & { status?: number }> => {
  let errorMessage: string;

  try {
    const errorData: { message?: string } = await response.json();
    errorMessage = errorData.message || `Error: ${response.status}`;
  } catch {
    errorMessage = `Request failed with status: ${response.status}`;
  }

  const error = new Error(errorMessage) as Error & { status?: number };
  error.status = response.status;

  // Handle specific error codes
  if (response.status === 403) {
    // Unauthorized - token expired or invalid
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/"; // Redirect to login or home page
  }

  return error;
};

type HttpMethod = "GET" | "POST" |  "DELETE" | "OPTIONS";

interface ApiRequestOptions {
  method?: HttpMethod;
  body?: any;
  downloadBlob?: boolean;
}

interface ApiRequestOptions {
  method?: HttpMethod;
  body?: any;
  downloadBlob?: boolean;
  successCode?: number; // Expected success status code
  customErrors?: Record<number, string>; // Status code → custom message
}

export async function apiRequest<T>(
  baseURL: string,
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    downloadBlob = false,
    customErrors = {},
    successCode = 200,
  } = options;

  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method,
      headers: getAuthHeaders(
        body ? { "Content-Type": "application/json" } : undefined
      ),
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status !== successCode) {
      if (response.status === 403) {
        // Unauthorized - token expired or invalid
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/"; // Redirect to login or home page
      }

      // Use custom error message if status code is defined
      const errorMessage = customErrors[response.status];
      if (errorMessage) {
        const error = new Error(errorMessage) as Error & { status?: number };
        error.status = response.status;
        throw error;
      }

      // Otherwise fallback to default handler
      const error = await handleApiError(response);
      throw error;
    }

    return downloadBlob
      ? ((await response.blob()) as unknown as T)
      : await response.json();
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
}
